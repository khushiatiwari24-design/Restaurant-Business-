/**
 * @jest-environment node
 */
import { adminLogin, adminLogout, getAdminSession, ROLES } from './adminAuth';
import {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  suspendRestaurant,
  activateRestaurant,
} from './restaurantsApi';
import { getAdminDashboardStats } from './adminStats';

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
    subscriptionPlanId: 'starter',
  });
  expect(created.admin.role).toBe(ROLES.RESTAURANT_ADMIN);

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
    })
  ).rejects.toMatchObject({ code: 'FORBIDDEN' });
});
