import { getRestaurants } from './restaurantsApi';

/**
 * Dashboard stats from live restaurants list.
 * Backend: later GET /api/v1/admin/stats
 */
export async function getAdminDashboardStats() {
  const restaurants = await getRestaurants({ status: 'all' });
  const total = restaurants.length;
  const active = restaurants.filter((r) => r.status === 'active').length;
  const suspended = restaurants.filter((r) => r.status === 'suspended').length;

  return {
    totalRestaurants: total,
    activeRestaurants: active,
    suspendedRestaurants: suspended,
    totalDishes: restaurants.reduce((n, r) => n + (r.stats?.dishes || 0), 0),
    totalTables: restaurants.reduce((n, r) => n + (r.stats?.tables || 0), 0),
  };
}
