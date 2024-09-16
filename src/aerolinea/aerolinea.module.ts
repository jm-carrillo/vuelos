/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { AerolineaController } from './aerolinea.controller';

@Module({
  providers: [AerolineaService],
  imports: [TypeOrmModule.forFeature([AerolineaEntity])],
  controllers: [AerolineaController]
})
export class AerolineaModule {}
