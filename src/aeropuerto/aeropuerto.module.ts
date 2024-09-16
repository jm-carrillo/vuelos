/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { AeropuertoController } from './aeropuerto.controller';

@Module({
  providers: [AeropuertoService],
  imports: [TypeOrmModule.forFeature([AeropuertoEntity])],
  controllers: [AeropuertoController]
})
export class AeropuertoModule {}
