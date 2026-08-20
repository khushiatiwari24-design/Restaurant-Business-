import { getAdminSession, requireSuperAdmin } from './adminAuth';
import { delay } from './adminStorage';
import { ensureRestaurantsSeeded } from './restaurantsApi';

/**
 * Platform dashboard stats for Super Admin.
 * Backend: GET /admin/dashboard/stats
 */
export async function getAdminDashboardStats() {
  const session = await getAdminSession();
  requireSuperAdmin(session);
  await delay();

  const restaurants = ensureRestaurantsSeeded();
  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.filter((r) => r.status === 'active').length;
  const suspendedRestaurants = restaurants.filter((r) => r.status === 'suspended').length;
  const totalMenuItems = restaurants.reduce(
    (sum, r) => sum + (r.stats?.dishes || 0),
    0
  );
  const totalQrCodes = restaurants.reduce(
    (sum, r) =>
      sum + (r.stats?.activeQrCodes || 0) + (r.stats?.revokedQrCodes || 0),
    0
  );

  return {
    totalRestaurants,
    activeRestaurants,
    suspendedRestaurants,
    totalMenuItems,
    totalQrCodes,
  };
}
