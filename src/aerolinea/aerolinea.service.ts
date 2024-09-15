/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';


@Injectable()
export class AerolineaService {
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({ relations: ["aeropuertos"] });
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}, relations: ['aeropuertos']});
        if (!aerolinea)
          throw new HttpException({mensaje:'La aerolinea con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);
    
        return aerolinea;
      }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const fecha_actual = new Date();         
        if (aerolinea.fechaFundacion > fecha_actual)
            throw new HttpException({mensaje:'La fecha de fundacion es mayor que la fecha actual', codigo: HttpStatus.BAD_REQUEST}, HttpStatus.BAD_REQUEST);

        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedAerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        const fecha_actual = new Date();
        if (!persistedAerolinea)
          throw new HttpException({mensaje:'La aerolinea con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);
        if (aerolinea.fechaFundacion)
            if (aerolinea.fechaFundacion > fecha_actual)
                throw new HttpException({mensaje:'La fecha de fundacion es mayor que la fecha actual', codigo: HttpStatus.BAD_REQUEST}, HttpStatus.BAD_REQUEST);        
            
        return await this.aerolineaRepository.save({...persistedAerolinea, ...aerolinea});
      }

      async delete(id: string) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!aerolinea)
          throw new HttpException({mensaje:'La aerolinea con el id dado no existe', codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);
    
        await this.aerolineaRepository.remove(aerolinea);
      }
}
