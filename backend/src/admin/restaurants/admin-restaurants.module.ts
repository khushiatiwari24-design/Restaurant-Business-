import { Module } from '@nestjs/common';
import { AdminRestaurantsController } from './admin-restaurants.controller';
import { AdminRestaurantsService } from './admin-restaurants.service';

@Module({
  controllers: [AdminRestaurantsController],
  providers: [AdminRestaurantsService],
  exports: [AdminRestaurantsService],
})
export class AdminRestaurantsModule {}
