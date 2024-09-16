/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, ParseUUIDPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ErroresDeNegocioInterceptor } from '../compartido/interceptores/errores-de-negocio.interceptor';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { AerolineaDto } from './aerolinea.dto/aerolinea.dto';


@Controller('airlines')
@UseInterceptors(ErroresDeNegocioInterceptor)
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService){}

    @Get()
    async findAll() {
      return await this.aerolineaService.findAll();
    }
  
    @Get(':aerolineaId')
    async findOne(@Param('aerolineaId', ParseUUIDPipe) aerolineaId: string) {
      return await this.aerolineaService.findOne(aerolineaId);
    }
  
    @Post()
    async create(@Body() aerolineaDto: AerolineaDto) {
      const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
      return await this.aerolineaService.create(aerolinea);
    }
  
    @Put(':aerolineaId')
    async update(@Param('aerolineaId', ParseUUIDPipe) aerolineaId: string, @Body() aerolineaDto: AerolineaDto) {
      const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
      return await this.aerolineaService.update(aerolineaId, aerolinea);
    }
  
    @Delete(':aerolineaId')
    @HttpCode(204)
    async delete(@Param('aerolineaId', ParseUUIDPipe) aerolineaId: string) {
      return await this.aerolineaService.delete(aerolineaId);
    }    
}
