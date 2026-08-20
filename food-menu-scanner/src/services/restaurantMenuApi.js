import {
  getRestaurantSession,
  requirePermission,
  requireRestaurantSession,
} from './restaurantAuth';
import { delay, readJson, uid, writeJson } from './adminStorage';

const MENU_KEY = 'restaurant_menus';

const DEFAULT_CATEGORIES = [
  'South Indian',
  'Starters',
  'Main Course',
  'Rice',
  'Beverages',
  'Desserts',
];

function emptyMenu() {
  return {
    categories: [...DEFAULT_CATEGORIES],
    dishes: [],
  };
}

function seedGatewayIfNeeded(store) {
  if (store.rest_gateway) return store;
  store.rest_gateway = {
    categories: [...DEFAULT_CATEGORIES],
    dishes: [
      {
        id: 'dish_masala_dosa',
        name: 'Masala Dosa',
        description: 'Crispy dosa with spiced potato filling.',
        price: 80,
        category: 'South Indian',
        imageUrl: '',
        calories: 320,
        protein: 8,
        carbohydrates: 48,
        fat: 10,
        ingredients: ['rice batter', 'potato', 'onion', 'spices'],
        allergens: ['gluten'],
        isVeg: true,
        isVegan: false,
        isJain: false,
        available: true,
        published: true,
        createdAt: '2026-06-12T10:00:00.000Z',
        updatedAt: '2026-06-12T10:00:00.000Z',
      },
      {
        id: 'dish_paneer_tikka',
        name: 'Paneer Tikka',
        description: 'Tandoor-grilled paneer with spices.',
        price: 180,
        category: 'Starters',
        imageUrl: '',
        calories: 280,
        protein: 16,
        carbohydrates: 12,
        fat: 18,
        ingredients: ['paneer', 'yogurt', 'spices'],
        allergens: ['dairy'],
        isVeg: true,
        isVegan: false,
        isJain: false,
        available: true,
        published: true,
        createdAt: '2026-06-12T10:00:00.000Z',
        updatedAt: '2026-06-12T10:00:00.000Z',
      },
      {
        id: 'dish_veg_biryani',
        name: 'Veg Biryani',
        description: 'Fragrant basmati rice with mixed vegetables.',
        price: 160,
        category: 'Rice',
        imageUrl: '',
        calories: 420,
        protein: 10,
        carbohydrates: 62,
        fat: 14,
        ingredients: ['basmati rice', 'vegetables', 'spices'],
        allergens: [],
        isVeg: true,
        isVegan: true,
        isJain: false,
        available: true,
        published: true,
        createdAt: '2026-06-12T10:00:00.000Z',
        updatedAt: '2026-06-12T10:00:00.000Z',
      },
    ],
  };
  writeJson(MENU_KEY, store);
  return store;
}

function getStore() {
  const store = readJson(MENU_KEY, {}) || {};
  return seedGatewayIfNeeded(store);
}

function saveStore(store) {
  writeJson(MENU_KEY, store);
}

function restaurantMenu(restaurantId) {
  const store = getStore();
  if (!store[restaurantId]) {
    store[restaurantId] = emptyMenu();
    saveStore(store);
  }
  return store[restaurantId];
}

async function withSession(permissionKey) {
  const session = await getRestaurantSession();
  if (permissionKey) requirePermission(session, permissionKey);
  else requireRestaurantSession(session);
  return session;
}

export async function getRestaurantProfile() {
  const session = await withSession();
  await delay();
  return {
    id: session.user.restaurantId,
    slug: session.user.restaurantSlug,
    name: session.user.restaurantName,
  };
}

export async function getCategories() {
  const session = await withSession('viewMenu');
  await delay(120);
  return restaurantMenu(session.user.restaurantId).categories;
}

export async function createCategory(name) {
  const session = await withSession('manageCategories');
  await delay(200);
  const store = getStore();
  const menu = restaurantMenu(session.user.restaurantId);
  const trimmed = String(name || '').trim();
  if (!trimmed) {
    const err = new Error('Category name is required.');
    err.code = 'VALIDATION';
    throw err;
  }
  if (!menu.categories.includes(trimmed)) {
    menu.categories = [...menu.categories, trimmed];
    store[session.user.restaurantId] = menu;
    saveStore(store);
  }
  return menu.categories;
}

export async function getRestaurantMenu({ search = '', category = 'all', status = 'all' } = {}) {
  const session = await withSession('viewMenu');
  await delay();
  let dishes = [...restaurantMenu(session.user.restaurantId).dishes];
  const q = search.trim().toLowerCase();
  if (q) {
    dishes = dishes.filter((d) =>
      [d.name, d.category, ...(d.ingredients || [])]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }
  if (category !== 'all') dishes = dishes.filter((d) => d.category === category);
  if (status === 'active') dishes = dishes.filter((d) => d.available && d.published);
  if (status === 'unavailable') dishes = dishes.filter((d) => !d.available);
  if (status === 'draft') dishes = dishes.filter((d) => !d.published);

  return dishes.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getMenuItem(dishId) {
  const session = await withSession('viewMenu');
  await delay(120);
  const dish = restaurantMenu(session.user.restaurantId).dishes.find((d) => d.id === dishId);
  if (!dish) {
    const err = new Error('Dish not found.');
    err.code = 'NOT_FOUND';
    throw err;
  }
  return dish;
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Create dish for the authenticated restaurant only.
 * Backend: POST /restaurants/me/menu-items
 */
export async function createMenuItem(payload) {
  const session = await withSession('addDish');
  await delay(400);

  const name = String(payload.name || '').trim();
  const price = Number(payload.price);
  const category = String(payload.category || '').trim();

  if (!name || !category || Number.isNaN(price) || price < 0) {
    const err = new Error('Dish name, category, and a valid price are required.');
    err.code = 'VALIDATION';
    throw err;
  }

  const now = new Date().toISOString();
  const dish = {
    id: uid('dish'),
    name,
    description: String(payload.description || '').trim(),
    price,
    category,
    imageUrl: String(payload.imageUrl || '').trim(),
    calories: payload.calories === '' || payload.calories == null ? null : Number(payload.calories),
    protein: payload.protein === '' || payload.protein == null ? null : Number(payload.protein),
    carbohydrates:
      payload.carbohydrates === '' || payload.carbohydrates == null
        ? null
        : Number(payload.carbohydrates),
    fat: payload.fat === '' || payload.fat == null ? null : Number(payload.fat),
    ingredients: normalizeList(payload.ingredients),
    allergens: normalizeList(payload.allergens),
    isVeg: Boolean(payload.isVeg),
    isVegan: Boolean(payload.isVegan),
    isJain: Boolean(payload.isJain),
    available: payload.available !== false,
    published: payload.published !== false,
    createdAt: now,
    updatedAt: now,
  };

  const store = getStore();
  const menu = restaurantMenu(session.user.restaurantId);
  if (!menu.categories.includes(category)) {
    menu.categories = [...menu.categories, category];
  }
  menu.dishes = [...menu.dishes, dish];
  store[session.user.restaurantId] = menu;
  saveStore(store);
  return dish;
}

export async function updateMenuItem(dishId, payload) {
  const session = await withSession('editDish');
  await delay(350);
  const store = getStore();
  const menu = restaurantMenu(session.user.restaurantId);
  const idx = menu.dishes.findIndex((d) => d.id === dishId);
  if (idx < 0) {
    const err = new Error('Dish not found in your restaurant menu.');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const current = menu.dishes[idx];
  const next = {
    ...current,
    ...payload,
    name: payload.name != null ? String(payload.name).trim() : current.name,
    description:
      payload.description != null ? String(payload.description).trim() : current.description,
    price: payload.price != null ? Number(payload.price) : current.price,
    category: payload.category != null ? String(payload.category).trim() : current.category,
    imageUrl: payload.imageUrl != null ? String(payload.imageUrl).trim() : current.imageUrl,
    ingredients:
      payload.ingredients != null ? normalizeList(payload.ingredients) : current.ingredients,
    allergens: payload.allergens != null ? normalizeList(payload.allergens) : current.allergens,
    updatedAt: new Date().toISOString(),
  };

  menu.dishes[idx] = next;
  store[session.user.restaurantId] = menu;
  saveStore(store);
  return next;
}

export async function deleteMenuItem(dishId) {
  const session = await withSession('deleteDish');
  await delay(300);
  const store = getStore();
  const menu = restaurantMenu(session.user.restaurantId);
  const before = menu.dishes.length;
  menu.dishes = menu.dishes.filter((d) => d.id !== dishId);
  if (menu.dishes.length === before) {
    const err = new Error('Dish not found.');
    err.code = 'NOT_FOUND';
    throw err;
  }
  store[session.user.restaurantId] = menu;
  saveStore(store);
  return true;
}

export async function getRestaurantTables() {
  await withSession('manageTables');
  await delay(150);
  return [];
}

export async function getRestaurantQRCodes() {
  await withSession('manageQr');
  await delay(150);
  return [];
}

export async function getRestaurantDashboardStats() {
  const session = await withSession('viewDashboard');
  await delay();
  const menu = restaurantMenu(session.user.restaurantId);
  const dishes = menu.dishes;
  return {
    totalDishes: dishes.length,
    availableDishes: dishes.filter((d) => d.available).length,
    unavailableDishes: dishes.filter((d) => !d.available).length,
    categories: menu.categories.length,
    tables: 0,
    activeQrCodes: 0,
  };
}
