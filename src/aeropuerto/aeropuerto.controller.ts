/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, ParseUUIDPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ErroresDeNegocioInterceptor } from '../compartido/interceptores/errores-de-negocio.interceptor';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { AeropuertoDto } from './aeropuerto.dto/aeropuerto.dto';

@Controller('airports')
@UseInterceptors(ErroresDeNegocioInterceptor)
export class AeropuertoController {
    constructor(private readonly aeropuertoService: AeropuertoService){}

    @Get()
    async findAll() {
      return await this.aeropuertoService.findAll();
    }
  
    @Get(':aeropuertoId')
    async findOne(@Param('aeropuertoId', ParseUUIDPipe) aeropuertoId: string) {
      return await this.aeropuertoService.findOne(aeropuertoId);
    }
  
    @Post()
    async create(@Body() aeropuertoDto: AeropuertoDto) {
      const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
      return await this.aeropuertoService.create(aeropuerto);
    }
  
    @Put(':aeropuertoId')
    async update(@Param('aeropuertoId', ParseUUIDPipe) aeropuertoId: string, @Body() aeropuertoDto: AeropuertoDto) {
      const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
      return await this.aeropuertoService.update(aeropuertoId, aeropuerto);
    }
  
    @Delete(':aeropuertoId')
    @HttpCode(204)
    async delete(@Param('aeropuertoId', ParseUUIDPipe) aeropuertoId: string) {
      return await this.aeropuertoService.delete(aeropuertoId);
    }    
}
