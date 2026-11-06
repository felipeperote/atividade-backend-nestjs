import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { SensoresService } from './sensores.service';
import { CreateSensoreDto } from './dto/create-sensore.dto';
import { UpdateSensoreDto } from './dto/update-sensore.dto';

@Controller('sensores')
export class SensoresController {
  constructor(private readonly sensoresService: SensoresService) {}

  @Post()
  create(@Body() createSensoreDto: CreateSensoreDto) {
    return this.sensoresService.create(createSensoreDto);
  }

  @Get()
  findAll() {
    return this.sensoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensoresService.findOne(+id);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateSensoreDto: UpdateSensoreDto) {
    return this.sensoresService.update(+id, updateSensoreDto);
  }

  @Patch(':id')
  updatePatch(@Param('id') id: string, @Body() updateSensoreDto: UpdateSensoreDto) {
    return this.sensoresService.patch(+id, updateSensoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sensoresService.remove(+id);
  }
}