/**
 * @jest-environment node
 */
import { webcrypto } from 'crypto';
import { adminLogin, adminLogout, getAdminSession, ROLES } from './adminAuth';
import {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  suspendRestaurant,
  activateRestaurant,
} from './restaurantsApi';
import { getAdminDashboardStats } from './adminStats';
import { restaurantLogin, restaurantLogout, RESTAURANT_ROLES } from './restaurantAuth';
import { listRestaurantUsers } from './restaurantUsers';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

const store = new Map();

beforeAll(() => {
  global.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
});

beforeEach(() => {
  store.clear();
});

test('super admin can manage restaurants; unauthenticated cannot', async () => {
  await expect(getRestaurants()).rejects.toMatchObject({ code: 'FORBIDDEN' });

  const session = await adminLogin({
    email: 'admin@dilyum.com',
    password: 'SuperAdmin@123',
  });
  expect(session.user.role).toBe(ROLES.SUPER_ADMIN);
  expect(await getAdminSession()).toBeTruthy();

  const stats = await getAdminDashboardStats();
  expect(typeof stats.totalRestaurants).toBe('number');

  const created = await createRestaurant({
    name: 'Test Kitchen',
    slug: 'test-kitchen',
    phone: '9999999999',
    email: 'test@kitchen.example',
    address: '1 Test St',
    city: 'Pune',
    adminName: 'Test Admin',
    adminEmail: 'admin@testkitchen.example',
    adminPassword: 'SecurePass1',
    subscriptionPlanId: 'starter',
  });
  expect(created.admin.role).toBe('RESTAURANT_OWNER');
  expect(created.admin.passwordHash).toBeUndefined();
  expect(created.admin.password).toBeUndefined();

  const found = await getRestaurants({ search: 'Test Kitchen' });
  expect(found.some((r) => r.id === created.id)).toBe(true);

  const one = await getRestaurant(created.id);
  expect(one.slug).toBe('test-kitchen');

  expect((await suspendRestaurant(created.id)).status).toBe('suspended');
  expect((await activateRestaurant(created.id)).status).toBe('active');

  await adminLogout();
  expect(await getAdminSession()).toBeNull();
  await expect(
    createRestaurant({
      name: 'Hack',
      slug: 'hack',
      phone: '1',
      email: 'a@b.c',
      address: 'x',
      city: 'y',
      adminName: 'z',
      adminEmail: 'z@b.c',
      adminPassword: 'SecurePass1',
    })
  ).rejects.toMatchObject({ code: 'FORBIDDEN' });
});

test('created restaurant owner can restaurant-login with hashed password only', async () => {
  await adminLogin({
    email: 'admin@dilyum.com',
    password: 'SuperAdmin@123',
  });

  const created = await createRestaurant({
    restaurant: {
      name: 'Owner Kitchen',
      slug: 'owner-kitchen',
      phone: '8888888888',
      email: 'hello@ownerkitchen.example',
      address: '2 Owner St',
      city: 'Mumbai',
    },
    owner: {
      name: 'New Owner',
      email: 'owner@ownerkitchen.example',
      phone: '7777777777',
      password: 'OwnerPass99',
    },
    subscription: { plan: 'free' },
  });

  const stored = listRestaurantUsers().find((u) => u.email === 'owner@ownerkitchen.example');
  expect(stored.passwordHash).toMatch(/^sha256\$/);
  expect(stored.password).toBeUndefined();
  expect(JSON.stringify(created)).not.toContain('OwnerPass99');
  expect(JSON.stringify(created)).not.toContain(stored.passwordHash);

  await adminLogout();

  const session = await restaurantLogin({
    email: 'owner@ownerkitchen.example',
    password: 'OwnerPass99',
  });
  expect(session.user.role).toBe(RESTAURANT_ROLES.OWNER);
  expect(session.user.restaurantId).toBe(created.id);
  expect(session.user.restaurantName).toBe('Owner Kitchen');

  await restaurantLogout();
  await expect(
    restaurantLogin({
      email: 'owner@ownerkitchen.example',
      password: 'wrong-password',
    })
  ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
});
