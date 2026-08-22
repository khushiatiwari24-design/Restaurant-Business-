import { Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicRestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(search = '') {
    const q = String(search || '').trim();
    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        status: RestaurantStatus.ACTIVE,
        deletedAt: null,
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' as const } },
                { city: { contains: q, mode: 'insensitive' as const } },
                { slug: { contains: q, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });

    return restaurants.map((r) => this.toPublic(r));
  }

  async getBySlug(slug: string) {
    const normalized = String(slug || '').trim().toLowerCase();
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        slug: normalized,
        status: RestaurantStatus.ACTIVE,
        deletedAt: null,
      },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found.');
    }
    return {
      restaurant: this.toPublic(restaurant),
      categories: [] as string[],
      dishes: [] as unknown[],
    };
  }

  private toPublic(r: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    city: string;
    state: string | null;
    address: string;
    phone: string;
  }) {
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description || '',
      logoUrl: r.logoUrl || '',
      coverUrl: r.coverImageUrl || '',
      city: r.city,
      state: r.state || '',
      address: r.address,
      phone: r.phone,
    };
  }
}
