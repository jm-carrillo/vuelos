/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { AeropuertoEntity } from '../../aeropuerto/aeropuerto.entity/aeropuerto.entity';

@Entity()
export class AerolineaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    nombre: string;
    
    @Column()
    descripcion: string;
    
    @Column()
    fechaFundacion: Date;
    
    @Column()
    paginaWeb: string;

    @ManyToMany(() => AeropuertoEntity, aeropuerto => aeropuerto.aerolineas)
    @JoinTable() 
    aeropuertos: AeropuertoEntity[];
}
