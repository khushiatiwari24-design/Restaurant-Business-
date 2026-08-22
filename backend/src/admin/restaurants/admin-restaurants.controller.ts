import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RestaurantStatus } from '@prisma/client';
import { AppRole } from '../../common/constants';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminRestaurantsService } from './admin-restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('admin/restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AppRole.SUPER_ADMIN)
export class AdminRestaurantsController {
  constructor(private readonly restaurantsService: AdminRestaurantsService) {}

  @Get()
  list(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.restaurantsService.list({ search, status });
  }

  @Get('plans')
  listPlans() {
    return this.restaurantsService.listPlans();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.restaurantsService.getOne(id);
  }

  @Post()
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(dto);
  }

  @Patch(':id/suspend')
  suspend(@Param('id') id: string) {
    return this.restaurantsService.setStatus(id, RestaurantStatus.SUSPENDED);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.restaurantsService.setStatus(id, RestaurantStatus.ACTIVE);
  }
}
