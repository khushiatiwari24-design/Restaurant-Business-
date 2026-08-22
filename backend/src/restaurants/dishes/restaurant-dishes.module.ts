import { Module } from '@nestjs/common';
import { RestaurantContextService } from '../restaurant-context.service';
import { RestaurantDishesController } from './restaurant-dishes.controller';
import { RestaurantDishesService } from './restaurant-dishes.service';

@Module({
  controllers: [RestaurantDishesController],
  providers: [RestaurantDishesService, RestaurantContextService],
  exports: [RestaurantDishesService, RestaurantContextService],
})
export class RestaurantDishesModule {}
