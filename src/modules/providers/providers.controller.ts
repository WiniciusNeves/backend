import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  async create(@Body() createProviderDto: CreateProviderDto): Promise<Provider> {
    return this.providersService.create(createProviderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Provider[]> {
    return this.providersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Provider> {
    return this.providersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProviderDto: UpdateProviderDto,
  ): Promise<Provider> {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<Provider> {
    return this.providersService.remove(id);
  }
}
