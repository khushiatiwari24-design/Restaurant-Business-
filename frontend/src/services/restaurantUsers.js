import { delay, readJson, writeJson } from './adminStorage';
import { RESTAURANT_ROLES } from './restaurantAuthShared';
import { verifyPassword } from './passwordHash';

const USERS_KEY = 'restaurant_users';

/**
 * Persist restaurant portal users (owners created by Super Admin, etc.).
 * Never store plaintext passwords — only passwordHash.
 */
export function listRestaurantUsers() {
  return readJson(USERS_KEY, []) || [];
}

function saveUsers(users) {
  writeJson(USERS_KEY, users);
}

export function findRestaurantUserByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  return listRestaurantUsers().find((u) => u.email === normalized) || null;
}

/**
 * Register a restaurant owner after Super Admin creates a restaurant.
 * Backend: create user + membership in one transaction.
 */
export function registerRestaurantUser(user) {
  const email = String(user.email || '').trim().toLowerCase();
  if (!email || !user.passwordHash) {
    const err = new Error('Restaurant user email and passwordHash are required.');
    err.code = 'VALIDATION';
    throw err;
  }
  const users = listRestaurantUsers();
  if (users.some((u) => u.email === email)) {
    const err = new Error('A restaurant user with this email already exists.');
    err.code = 'CONFLICT';
    throw err;
  }
  const record = {
    id: user.id,
    email,
    name: String(user.name || '').trim(),
    phone: String(user.phone || '').trim(),
    role: user.role || RESTAURANT_ROLES.OWNER,
    restaurantId: user.restaurantId,
    restaurantSlug: user.restaurantSlug,
    restaurantName: user.restaurantName,
    passwordHash: user.passwordHash,
    status: user.status || 'active',
    createdAt: user.createdAt || new Date().toISOString(),
  };
  users.push(record);
  saveUsers(users);
  return sanitizeRestaurantUser(record);
}

export function sanitizeRestaurantUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function authenticateRestaurantUser({ email, password }) {
  await delay(80);
  const user = findRestaurantUserByEmail(email);
  if (!user || user.status !== 'active') return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return sanitizeRestaurantUser(user);
}
