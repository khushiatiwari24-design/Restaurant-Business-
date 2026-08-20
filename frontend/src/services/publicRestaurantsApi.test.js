/**
 * @jest-environment node
 */
import {
  getPublicRestaurantBySlug,
  getPublicRestaurants,
} from './publicRestaurantsApi';
import { createMenuItem } from './restaurantMenuApi';
import { restaurantLogin, restaurantLogout } from './restaurantAuth';
import { suspendRestaurant, activateRestaurant } from './restaurantsApi';
import { adminLogin, adminLogout } from './adminAuth';

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

test('public discovery shows only active restaurants and published dishes', async () => {
  const publicList = await getPublicRestaurants();
  expect(publicList.some((r) => r.slug === 'gateway-restaurant')).toBe(true);
  expect(publicList.some((r) => r.slug === 'spice-route-cafe')).toBe(false);

  const page = await getPublicRestaurantBySlug('gateway-restaurant');
  expect(page.restaurant.name).toBe('Gateway Restaurant');
  expect(page.dishes.length).toBeGreaterThan(0);
  expect(page.dishes.every((d) => d.name)).toBe(true);

  await expect(getPublicRestaurantBySlug('unknown-restaurant')).rejects.toMatchObject({
    code: 'NOT_FOUND',
  });
  await expect(getPublicRestaurantBySlug('dashboard')).rejects.toMatchObject({
    code: 'NOT_FOUND',
  });

  await adminLogin({ email: 'admin@dilyum.com', password: 'SuperAdmin@123' });
  await suspendRestaurant('rest_gateway');
  const afterSuspend = await getPublicRestaurants();
  expect(afterSuspend.some((r) => r.slug === 'gateway-restaurant')).toBe(false);
  await activateRestaurant('rest_gateway');
  await adminLogout();

  await restaurantLogin({ email: 'owner@gateway.example', password: 'Owner@123' });
  const created = await createMenuItem({
    name: 'Public Special',
    price: 99,
    category: 'Starters',
    published: true,
    available: true,
  });
  await restaurantLogout();

  const refreshed = await getPublicRestaurantBySlug('gateway-restaurant');
  expect(refreshed.dishes.some((d) => d.id === created.id)).toBe(true);
});
