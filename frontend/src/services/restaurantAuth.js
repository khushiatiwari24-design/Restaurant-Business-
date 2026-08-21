import { delay, readJson, removeKey, writeJson } from './adminStorage';
import { RESTAURANT_ROLES } from './restaurantAuthShared';
import { authenticateRestaurantUser } from './restaurantUsers';

export { RESTAURANT_ROLES };

/** Demo restaurant users — swap for NestJS JWT + membership later. */
const DEMO_USERS = [
  {
    id: 'user_gateway_owner',
    email: 'owner@gateway.example',
    password: 'Owner@123',
    name: 'Rahul Owner',
    role: RESTAURANT_ROLES.OWNER,
    restaurantId: 'rest_gateway',
    restaurantSlug: 'gateway-restaurant',
    restaurantName: 'Gateway Restaurant',
  },
  {
    id: 'user_gateway_manager',
    email: 'manager@gateway.example',
    password: 'Manager@123',
    name: 'Priya Manager',
    role: RESTAURANT_ROLES.MANAGER,
    restaurantId: 'rest_gateway',
    restaurantSlug: 'gateway-restaurant',
    restaurantName: 'Gateway Restaurant',
  },
  {
    id: 'user_gateway_staff',
    email: 'staff@gateway.example',
    password: 'Staff@123',
    name: 'Amit Staff',
    role: RESTAURANT_ROLES.STAFF,
    restaurantId: 'rest_gateway',
    restaurantSlug: 'gateway-restaurant',
    restaurantName: 'Gateway Restaurant',
  },
];

const SESSION_KEY = 'restaurant_session';

export const DEMO_RESTAURANT_CREDENTIALS = DEMO_USERS.map((u) => ({
  email: u.email,
  password: u.password,
  role: u.role,
}));

/**
 * Role → permission matrix (backend must enforce the same rules).
 */
export function getPermissions(role) {
  const isOwner = role === RESTAURANT_ROLES.OWNER;
  const isManager = role === RESTAURANT_ROLES.MANAGER;
  const isStaff = role === RESTAURANT_ROLES.STAFF;

  return {
    viewDashboard: isOwner || isManager || isStaff,
    manageProfile: isOwner,
    manageSettings: isOwner,
    manageStaff: isOwner,
    viewMenu: isOwner || isManager || isStaff,
    addDish: isOwner || isManager || isStaff,
    editDish: isOwner || isManager || isStaff,
    deleteDish: isOwner || isManager,
    manageAvailability: isOwner || isManager || isStaff,
    manageCategories: isOwner || isManager,
    manageIngredients: isOwner || isManager,
    manageTables: isOwner || isManager,
    manageQr: isOwner || isManager,
    viewAnalytics: isOwner || isManager,
  };
}

function buildSession(user) {
  return {
    token: `rest_jwt_${Date.now()}`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      restaurantId: user.restaurantId,
      restaurantSlug: user.restaurantSlug,
      restaurantName: user.restaurantName,
    },
    permissions: getPermissions(user.role),
    expiresAt: Date.now() + 1000 * 60 * 60 * 12,
  };
}

/**
 * Restaurant portal login.
 * Backend: POST /auth/restaurant/login → JWT + user + restaurant membership.
 */
export async function restaurantLogin({ email, password }) {
  await delay();
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized || !password) {
    const err = new Error('Email and password are required.');
    err.code = 'VALIDATION';
    throw err;
  }

  const demo = DEMO_USERS.find(
    (u) => u.email === normalized && u.password === password
  );
  if (demo) {
    const session = buildSession(demo);
    writeJson(SESSION_KEY, session);
    return session;
  }

  const registered = await authenticateRestaurantUser({
    email: normalized,
    password,
  });
  if (!registered) {
    const err = new Error('Invalid email or password.');
    err.code = 'UNAUTHORIZED';
    throw err;
  }

  const session = buildSession(registered);
  writeJson(SESSION_KEY, session);
  return session;
}

export async function getRestaurantSession() {
  await delay(80);
  return getRestaurantSessionSync();
}

export function getRestaurantSessionSync() {
  const session = readJson(SESSION_KEY, null);
  if (!session?.token || !session?.user?.restaurantId) return null;
  if (session.expiresAt && Date.now() > session.expiresAt) {
    removeKey(SESSION_KEY);
    return null;
  }
  return {
    ...session,
    permissions: session.permissions || getPermissions(session.user.role),
  };
}

export async function restaurantLogout() {
  await delay(120);
  removeKey(SESSION_KEY);
}

export async function getCurrentRestaurantUser() {
  const session = await getRestaurantSession();
  if (!session) return null;
  return {
    user: session.user,
    restaurant: {
      id: session.user.restaurantId,
      slug: session.user.restaurantSlug,
      name: session.user.restaurantName,
    },
    role: session.user.role,
    permissions: session.permissions,
  };
}

export function requireRestaurantSession(session) {
  if (!session?.user?.restaurantId) {
    const err = new Error('Restaurant authentication required.');
    err.code = 'UNAUTHORIZED';
    throw err;
  }
}

export function requirePermission(session, permissionKey) {
  requireRestaurantSession(session);
  const permissions = session.permissions || getPermissions(session.user.role);
  if (!permissions[permissionKey]) {
    const err = new Error('You do not have permission for this action.');
    err.code = 'FORBIDDEN';
    throw err;
  }
}
