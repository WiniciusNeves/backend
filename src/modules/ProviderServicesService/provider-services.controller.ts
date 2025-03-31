import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProviderServicesService } from './provider-services.service';
import { CreateProviderServiceDto } from './dto/create-provider-service.dto';
import { UpdateProviderServiceDto } from './dto/update-provider-service.dto';

@Controller('provider-services')
export class ProviderServicesController {
  constructor(private readonly providerServicesService: ProviderServicesService) {}

  @Post()
  create(@Body() createProviderServiceDto: CreateProviderServiceDto) {
    return this.providerServicesService.create(createProviderServiceDto);
  }

  @Get()
  findAll() {
    return this.providerServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providerServicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProviderServiceDto: UpdateProviderServiceDto) {
    return this.providerServicesService.update(+id, updateProviderServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providerServicesService.remove(+id);
  }
}
