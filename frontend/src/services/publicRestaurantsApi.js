import { delay } from './adminStorage';
import { ensureRestaurantsSeeded } from './restaurantsApi';
import { getPublishedMenuByRestaurantId } from './restaurantMenuApi';

/** Portal path segments that must not be treated as public restaurant slugs. */
export const RESERVED_RESTAURANT_PATHS = new Set([
  'dashboard',
  'menu',
  'profile',
  'settings',
  'categories',
  'ingredients',
  'tables',
  'qr',
  'analytics',
  'login',
]);

function toPublicRestaurant(r) {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description || '',
    logoUrl: r.logoUrl || '',
    coverUrl: r.coverUrl || '',
    city: r.city || '',
    state: r.state || '',
    address: r.address || '',
    phone: r.phone || '',
  };
}

/**
 * Active restaurants for customer discovery.
 * Backend: GET /api/v1/public/restaurants
 */
export async function getPublicRestaurants({ search = '' } = {}) {
  await delay(200);
  const q = String(search || '').trim().toLowerCase();
  let list = ensureRestaurantsSeeded().filter((r) => r.status === 'active');

  if (q) {
    list = list.filter((r) =>
      [r.name, r.city, r.state, r.slug]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }

  return list
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(toPublicRestaurant);
}

/**
 * Restaurant profile + published menu by slug.
 * Backend: GET /api/v1/public/restaurants/:slug
 */
export async function getPublicRestaurantBySlug(slug) {
  await delay(250);
  const normalized = String(slug || '').trim().toLowerCase();

  if (!normalized || RESERVED_RESTAURANT_PATHS.has(normalized)) {
    const err = new Error('Restaurant not found.');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const restaurant = ensureRestaurantsSeeded().find(
    (r) => r.slug === normalized && r.status === 'active'
  );

  if (!restaurant) {
    const err = new Error('Restaurant not found.');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const { categories, dishes } = getPublishedMenuByRestaurantId(restaurant.id);

  return {
    restaurant: toPublicRestaurant(restaurant),
    categories,
    dishes: dishes.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description || '',
      price: d.price,
      category: d.category,
      image: d.imageUrl || '',
      calories: d.calories,
      protein: d.protein,
      carbohydrates: d.carbohydrates,
      fat: d.fat,
      ingredients: d.ingredients || [],
      allergens: d.allergens || [],
      isVeg: Boolean(d.isVeg),
      isVegan: Boolean(d.isVegan),
      isJain: Boolean(d.isJain),
    })),
  };
}
