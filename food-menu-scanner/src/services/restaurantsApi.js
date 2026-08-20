import { getAdminSession, requireSuperAdmin, ROLES } from './adminAuth';
import { delay, readJson, slugify, uid, writeJson } from './adminStorage';

const RESTAURANTS_KEY = 'restaurants';

/** Subscription plans — later: GET /billing/plans */
export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceLabel: '₹0/mo',
    features: ['1 branch', '50 dishes', '5 QR tables'],
  },
  {
    id: 'starter',
    name: 'Starter',
    priceLabel: '₹999/mo',
    features: ['2 branches', '200 dishes', '25 QR tables'],
  },
  {
    id: 'professional',
    name: 'Professional',
    priceLabel: '₹2,499/mo',
    features: ['5 branches', 'Unlimited dishes', '100 QR tables', 'Analytics'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceLabel: 'Custom',
    features: ['Unlimited branches', 'SLA', 'Custom QR domains', 'Priority support'],
  },
];

function seedIfEmpty() {
  const existing = readJson(RESTAURANTS_KEY, null);
  if (existing) return existing;

  const seeded = [
    {
      id: 'rest_gateway',
      name: 'Gateway Restaurant',
      slug: 'gateway-restaurant',
      description: 'Classic Indian vegetarian dining with a modern menu experience.',
      logoUrl: '',
      coverUrl: '',
      phone: '+91 98765 43210',
      email: 'hello@gateway.example',
      address: '12 MG Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      status: 'active',
      subscriptionPlanId: 'professional',
      admin: {
        id: 'user_rest_gateway',
        name: 'Ravi Sharma',
        email: 'ravi@gateway.example',
        phone: '+91 98765 11111',
        status: 'active',
        role: ROLES.RESTAURANT_ADMIN,
      },
      stats: {
        categories: 24,
        dishes: 303,
        publishedDishes: 290,
        unavailableDishes: 13,
        tables: 18,
        activeQrCodes: 16,
        revokedQrCodes: 2,
      },
      createdAt: '2026-06-12T10:00:00.000Z',
      updatedAt: '2026-06-12T10:00:00.000Z',
    },
    {
      id: 'rest_spice',
      name: 'Spice Route Cafe',
      slug: 'spice-route-cafe',
      description: 'Street-food inspired cafe with QR table ordering.',
      logoUrl: '',
      coverUrl: '',
      phone: '+91 99887 76655',
      email: 'contact@spiceroute.example',
      address: '88 FC Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      status: 'suspended',
      subscriptionPlanId: 'starter',
      admin: {
        id: 'user_rest_spice',
        name: 'Neha Patel',
        email: 'neha@spiceroute.example',
        phone: '+91 99887 70000',
        status: 'active',
        role: ROLES.RESTAURANT_ADMIN,
      },
      stats: {
        categories: 8,
        dishes: 64,
        publishedDishes: 50,
        unavailableDishes: 14,
        tables: 10,
        activeQrCodes: 0,
        revokedQrCodes: 10,
      },
      createdAt: '2026-07-01T08:30:00.000Z',
      updatedAt: '2026-07-20T12:00:00.000Z',
    },
  ];
  writeJson(RESTAURANTS_KEY, seeded);
  return seeded;
}

function getAll() {
  return seedIfEmpty();
}

export function ensureRestaurantsSeeded() {
  return seedIfEmpty();
}

function saveAll(list) {
  writeJson(RESTAURANTS_KEY, list);
}

function planById(id) {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id) || SUBSCRIPTION_PLANS[0];
}

async function withSuperAdmin() {
  const session = await getAdminSession();
  requireSuperAdmin(session);
  return session;
}

export async function getSubscriptionPlans() {
  await delay(120);
  return SUBSCRIPTION_PLANS;
}

/**
 * List all restaurants (Super Admin only).
 * Backend: GET /admin/restaurants
 */
export async function getRestaurants({ search = '', status = 'all' } = {}) {
  await withSuperAdmin();
  await delay();
  let list = getAll();
  const q = search.trim().toLowerCase();
  if (q) {
    list = list.filter((r) =>
      [r.name, r.city, r.admin?.name, r.admin?.email, r.slug]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }
  if (status !== 'all') {
    list = list.filter((r) => r.status === status);
  }
  return list
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((r) => ({
      ...r,
      subscriptionPlan: planById(r.subscriptionPlanId),
    }));
}

/**
 * Create restaurant + restaurant admin + defaults.
 * Backend flow: create restaurant → user → assign → branch → categories → subscription → audit.
 */
export async function createRestaurant(payload) {
  await withSuperAdmin();
  await delay(500);

  const name = String(payload.name || '').trim();
  const slug = slugify(payload.slug || name);
  const phone = String(payload.phone || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const address = String(payload.address || '').trim();
  const city = String(payload.city || '').trim();
  const adminName = String(payload.adminName || '').trim();
  const adminEmail = String(payload.adminEmail || '').trim().toLowerCase();

  if (!name || !slug || !phone || !email || !address || !city || !adminName || !adminEmail) {
    const err = new Error('Please fill all required fields.');
    err.code = 'VALIDATION';
    throw err;
  }

  const list = getAll();
  if (list.some((r) => r.slug === slug)) {
    const err = new Error('Restaurant slug already exists. Choose another.');
    err.code = 'CONFLICT';
    throw err;
  }
  if (list.some((r) => r.admin?.email === adminEmail)) {
    const err = new Error('A restaurant admin with this email already exists.');
    err.code = 'CONFLICT';
    throw err;
  }

  const now = new Date().toISOString();
  const restaurant = {
    id: uid('rest'),
    name,
    slug,
    description: String(payload.description || '').trim(),
    logoUrl: String(payload.logoUrl || '').trim(),
    coverUrl: String(payload.coverUrl || '').trim(),
    phone,
    email,
    address,
    city,
    state: String(payload.state || '').trim(),
    pincode: String(payload.pincode || '').trim(),
    status: 'active',
    subscriptionPlanId: payload.subscriptionPlanId || 'free',
    admin: {
      id: uid('user'),
      name: adminName,
      email: adminEmail,
      phone: String(payload.adminPhone || '').trim(),
      status: 'active',
      role: ROLES.RESTAURANT_ADMIN,
    },
    // Defaults created by backend pipeline
    defaultBranch: {
      id: uid('branch'),
      name: 'Main Branch',
      isDefault: true,
    },
    defaultCategories: ['Starters', 'Main Course', 'Beverages', 'Desserts'],
    stats: {
      categories: 4,
      dishes: 0,
      publishedDishes: 0,
      unavailableDishes: 0,
      tables: 0,
      activeQrCodes: 0,
      revokedQrCodes: 0,
    },
    audit: [
      {
        id: uid('audit'),
        action: 'RESTAURANT_CREATED',
        at: now,
        by: 'SUPER_ADMIN',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  list.push(restaurant);
  saveAll(list);

  return {
    ...restaurant,
    subscriptionPlan: planById(restaurant.subscriptionPlanId),
  };
}

export async function getRestaurant(restaurantId) {
  await withSuperAdmin();
  await delay();
  const restaurant = getAll().find((r) => r.id === restaurantId);
  if (!restaurant) {
    const err = new Error('Restaurant not found.');
    err.code = 'NOT_FOUND';
    throw err;
  }
  return {
    ...restaurant,
    subscriptionPlan: planById(restaurant.subscriptionPlanId),
  };
}

export async function updateRestaurant(restaurantId, payload) {
  await withSuperAdmin();
  await delay(400);
  const list = getAll();
  const idx = list.findIndex((r) => r.id === restaurantId);
  if (idx < 0) {
    const err = new Error('Restaurant not found.');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const current = list[idx];
  const nextSlug = payload.slug != null ? slugify(payload.slug) : current.slug;
  if (nextSlug && list.some((r) => r.id !== restaurantId && r.slug === nextSlug)) {
    const err = new Error('Restaurant slug already exists.');
    err.code = 'CONFLICT';
    throw err;
  }

  const updated = {
    ...current,
    ...payload,
    slug: nextSlug || current.slug,
    admin: {
      ...current.admin,
      ...(payload.admin || {}),
    },
    updatedAt: new Date().toISOString(),
  };
  delete updated.subscriptionPlan;
  list[idx] = updated;
  saveAll(list);
  return {
    ...updated,
    subscriptionPlan: planById(updated.subscriptionPlanId),
  };
}

export async function activateRestaurant(restaurantId) {
  return updateRestaurant(restaurantId, { status: 'active' });
}

export async function suspendRestaurant(restaurantId) {
  return updateRestaurant(restaurantId, { status: 'suspended' });
}

export async function getRestaurantUsers(restaurantId) {
  const restaurant = await getRestaurant(restaurantId);
  return restaurant.admin ? [restaurant.admin] : [];
}
