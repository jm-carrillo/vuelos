/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, ParseUUIDPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ErroresDeNegocioInterceptor } from '../compartido/interceptores/errores-de-negocio.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AeropuertoDto } from 'src/aeropuerto/aeropuerto.dto/aeropuerto.dto';

@Controller('airlines')
@UseInterceptors(ErroresDeNegocioInterceptor)
export class AerolineaAeropuertoController {
    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService){}

    @Post(':aerolineaId/airports/:aeropuertoId')
    async addAirportToAirline(@Param('aerolineaId', ParseUUIDPipe) aerolineaId: string, @Param('aeropuertoId', ParseUUIDPipe) aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.addAirportToAirline(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/airports/:aeropuertoId')
    async findAirportFromAirline(@Param('aerolineaId', ParseUUIDPipe) aerolineaId: string, @Param('aeropuertoId', ParseUUIDPipe) aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.findAirportFromAirline(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/airports')
    async findAirportsFromAirline(@Param('aerolineaId', ParseUUIDPipe) aerolineaId: string) {
        return await this.aerolineaAeropuertoService.findAirportsFromAirline(aerolineaId);
    }  
    
    @Put(':aerolineaId/airports')
    async updateAirportsFromAirline(@Body() aeropuertoDto: AeropuertoDto[], @Param('aerolineaId', ParseUUIDPipe) aerolineaId: string) {
        const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertoDto)
        return await this.aerolineaAeropuertoService.updateAirportsFromAirline(aerolineaId, aeropuertos);
    }

    @Delete(':aerolineaId/airports/:aeropuertoId')
    @HttpCode(204)
       async deleteAirportFromAirline(@Param('aerolineaId', ParseUUIDPipe) aerolineaId: string, @Param('aeropuertoId', ParseUUIDPipe) aeropuertoId: string){
           return await this.aerolineaAeropuertoService.deleteAirportFromAirline(aerolineaId, aeropuertoId);
       }
}
