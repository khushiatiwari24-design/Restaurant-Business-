/**
 * @jest-environment node
 */
import {
  getPermissions,
  restaurantLogin,
  restaurantLogout,
  getRestaurantSession,
  RESTAURANT_ROLES,
} from './restaurantAuth';
import {
  createMenuItem,
  getRestaurantMenu,
  deleteMenuItem,
} from './restaurantMenuApi';

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

test('restaurant login scopes menu to assigned restaurant and roles', async () => {
  await expect(getRestaurantMenu()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });

  const owner = await restaurantLogin({
    email: 'owner@gateway.example',
    password: 'Owner@123',
  });
  expect(owner.user.role).toBe(RESTAURANT_ROLES.OWNER);
  expect(owner.user.restaurantId).toBe('rest_gateway');
  expect(getPermissions(owner.user.role).manageSettings).toBe(true);

  const created = await createMenuItem({
    name: 'Test Dosa',
    price: 90,
    category: 'South Indian',
    ingredients: 'rice, potato',
    isVeg: true,
  });
  expect(created.name).toBe('Test Dosa');

  const menu = await getRestaurantMenu({ search: 'Test Dosa' });
  expect(menu.some((d) => d.id === created.id)).toBe(true);

  await restaurantLogout();
  expect(await getRestaurantSession()).toBeNull();

  const staff = await restaurantLogin({
    email: 'staff@gateway.example',
    password: 'Staff@123',
  });
  expect(getPermissions(staff.user.role).deleteDish).toBe(false);
  expect(getPermissions(staff.user.role).addDish).toBe(true);

  await expect(deleteMenuItem(created.id)).rejects.toMatchObject({ code: 'FORBIDDEN' });
});
