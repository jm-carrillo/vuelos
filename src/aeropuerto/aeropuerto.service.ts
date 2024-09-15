/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';


@Injectable()
export class AeropuertoService {
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>

    async findAll(): Promise<AeropuertoEntity[]> {
        return await this.aeropuertoRepository.find({ relations: ["aerolineas"] });
    }

    async findOne(id: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}, relations: ['aerolineas']});
        if (!aeropuerto)
          throw new HttpException({mensaje:'El aeropuerto con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);
    
        return aeropuerto;
      }

    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {        
        if (aeropuerto.codigo.length != 3)
            throw new HttpException({mensaje:'El codigo del aeropuerto debe tener 3 caracteres', codigo: HttpStatus.BAD_REQUEST}, HttpStatus.BAD_REQUEST);

        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const persistedAeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
        if (!persistedAeropuerto)
          throw new HttpException({mensaje:'El aeropuerto con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);
        if (aeropuerto.codigo.length != 3)
            throw new HttpException({mensaje:'El codigo del aeropuerto debe tener 3 caracteres', codigo: HttpStatus.BAD_REQUEST}, HttpStatus.BAD_REQUEST);      
            
        return await this.aeropuertoRepository.save({...persistedAeropuerto, ...aeropuerto});
      }

      async delete(id: string) {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
        if (!aeropuerto)
          throw new HttpException({mensaje:'El aeropuerto con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);
    
        await this.aeropuertoRepository.remove(aeropuerto);
      }
}
