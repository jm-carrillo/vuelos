/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AerolineaAeropuertoService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,

        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ) {}

    async addAirportToAirline(aerolineaId: string, aeropuertoId: string): Promise<AerolineaEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
        if (!aeropuerto)
            throw new HttpException({mensaje:'El aeropuerto con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);
        
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]})
        if (!aerolinea)
            throw new HttpException({mensaje:'La aerolinea con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);            

        aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
        return await this.aerolineaRepository.save(aerolinea);
        }

    async findAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
        if (!aeropuerto)
            throw new HttpException({mensaje:'El aeropuerto con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);
        
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
        if (!aerolinea)
            throw new HttpException({mensaje:'La aerolinea con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);

        const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);

        if (!aerolineaAeropuerto)
            throw new HttpException({mensaje:'El aeropuerto con el id dado no esta asociado con la aerolinea', codigo: HttpStatus.PRECONDITION_FAILED}, HttpStatus.PRECONDITION_FAILED);            

        return aerolineaAeropuerto;
        }

    async findAirportsFromAirline(aerolineaId: string): Promise<AeropuertoEntity[]> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
        if (!aerolinea)
            throw new HttpException({mensaje:'La aerolinea con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);            
        
        return aerolinea.aeropuertos;
        }

    async updateAirportsFromAirline(aerolineaId: string, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});

        if (!aerolinea)
            throw new HttpException({mensaje:'La aerolinea con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);            

        for (let i = 0; i < aeropuertos.length; i++) {
            const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertos[i].id}});
            if (!aeropuerto)
                throw new HttpException({mensaje:'El aeropuerto con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);            
        }

        aerolinea.aeropuertos = aeropuertos;
        return await this.aerolineaRepository.save(aerolinea);
        }

    async deleteAirportFromAirline(aerolineaId: string, aeropuertoId: string){
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
        if (!aeropuerto)
            throw new HttpException({mensaje:'El aeropuerto con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);            

        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
        if (!aerolinea)
            throw new HttpException({mensaje:'La aerolinea con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);

        const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);

        if (!aerolineaAeropuerto)
            throw new HttpException({mensaje:'El aeropuerto con el id dado no esta asociado con la aerolinea', codigo: HttpStatus.PRECONDITION_FAILED}, HttpStatus.PRECONDITION_FAILED);            

        aerolinea.aeropuertos = aerolinea.aeropuertos.filter(e => e.id !== aeropuertoId);        
        await this.aerolineaRepository.save(aerolinea);
        }        
}
