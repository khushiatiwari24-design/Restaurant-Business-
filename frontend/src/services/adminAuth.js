import { delay, readJson, removeKey, writeJson } from './adminStorage';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  RESTAURANT_ADMIN: 'RESTAURANT_ADMIN',
};

/** Demo Super Admin — replace with NestJS JWT auth later. */
const DEMO_SUPER_ADMIN = {
  id: 'user_super_admin',
  email: 'admin@dilyum.com',
  password: 'SuperAdmin@123',
  name: 'Platform Super Admin',
  role: ROLES.SUPER_ADMIN,
};

const SESSION_KEY = 'session';

/**
 * Authenticate Super Admin.
 * Backend swap: POST /auth/admin/login → JWT + user.
 */
export async function adminLogin({ email, password }) {
  await delay();
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized || !password) {
    const err = new Error('Email and password are required.');
    err.code = 'VALIDATION';
    throw err;
  }
  if (
    normalized !== DEMO_SUPER_ADMIN.email ||
    password !== DEMO_SUPER_ADMIN.password
  ) {
    const err = new Error('Invalid admin email or password.');
    err.code = 'UNAUTHORIZED';
    throw err;
  }

  const session = {
    token: `mock_jwt_${Date.now()}`,
    user: {
      id: DEMO_SUPER_ADMIN.id,
      email: DEMO_SUPER_ADMIN.email,
      name: DEMO_SUPER_ADMIN.name,
      role: DEMO_SUPER_ADMIN.role,
    },
    expiresAt: Date.now() + 1000 * 60 * 60 * 12,
  };
  writeJson(SESSION_KEY, session);
  return session;
}

export async function getAdminSession() {
  await delay(80);
  const session = readJson(SESSION_KEY, null);
  if (!session?.token || !session?.user) return null;
  if (session.expiresAt && Date.now() > session.expiresAt) {
    removeKey(SESSION_KEY);
    return null;
  }
  return session;
}

export function getAdminSessionSync() {
  const session = readJson(SESSION_KEY, null);
  if (!session?.token || !session?.user) return null;
  if (session.expiresAt && Date.now() > session.expiresAt) {
    removeKey(SESSION_KEY);
    return null;
  }
  return session;
}

export async function adminLogout() {
  await delay(120);
  removeKey(SESSION_KEY);
}

export function requireSuperAdmin(session) {
  if (!session?.user || session.user.role !== ROLES.SUPER_ADMIN) {
    const err = new Error('Super Admin access required.');
    err.code = 'FORBIDDEN';
    throw err;
  }
}

export const DEMO_ADMIN_CREDENTIALS = {
  email: DEMO_SUPER_ADMIN.email,
  password: DEMO_SUPER_ADMIN.password,
};
