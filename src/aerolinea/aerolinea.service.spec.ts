/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../compartido/utilidades/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let listaAerolineas: AerolineaEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();    
    listaAerolineas = []
    for(let i = 0; i < 5; i++){
        const aerolinea: AerolineaEntity = await repository.save({
          nombre: faker.company.name(),
          descripcion: faker.lorem.sentence(),
          fechaFundacion: faker.date.past(),
          paginaWeb: faker.internet.url()
        });
        listaAerolineas.push(aerolinea);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todas las aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(listaAerolineas.length);
  });

  it('findOne deberia retornar una aerolinea por id', async () => {
    const aerolineaAlmacenada: AerolineaEntity = listaAerolineas[0];
    const aerolinea: AerolineaEntity = await service.findOne(aerolineaAlmacenada.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(aerolineaAlmacenada.nombre);
    expect(aerolinea.descripcion).toEqual(aerolineaAlmacenada.descripcion);
    expect(aerolinea.fechaFundacion).toEqual(aerolineaAlmacenada.fechaFundacion);
    expect(aerolinea.paginaWeb).toEqual(aerolineaAlmacenada.paginaWeb);
  });

  it('findOne deberia lanzar una excepción para una aerolinea invalida', async () => {
    try {
      await service.findOne(faker.string.uuid())
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "La aerolinea con el id dado no existe");
    }
  });

  it('create deberia retornar una nueva aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      aeropuertos: []
    }
 
    const nuevaAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(nuevaAerolinea).not.toBeNull();
 
    const aerolineaAlmacenada: AerolineaEntity = await repository.findOne({where: {id: nuevaAerolinea.id}})
    expect(aerolineaAlmacenada).not.toBeNull();
    expect(aerolineaAlmacenada.nombre).toEqual(nuevaAerolinea.nombre);
    expect(aerolineaAlmacenada.descripcion).toEqual(nuevaAerolinea.descripcion);
    expect(aerolineaAlmacenada.fechaFundacion).toEqual(nuevaAerolinea.fechaFundacion);
    expect(aerolineaAlmacenada.paginaWeb).toEqual(nuevaAerolinea.paginaWeb);    
  });

  it('create deberia lanzar una excepción para una aerolinea con fecha de fundacion incorrecta', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.future(),
      paginaWeb: faker.internet.url(),
      aeropuertos: []
    }
 
    try {
      await service.create(aerolinea);
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "La fecha de fundacion es mayor que la fecha actual");
    }
  });

  it('update deberia modificar una aerolinea', async () => {
    const aerolinea: AerolineaEntity = listaAerolineas[0];
    aerolinea.nombre = "Nuevo nombre";
    const aerolineaActualizada: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(aerolineaActualizada).not.toBeNull();
    const aerolineaAlmacenada: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(aerolineaAlmacenada).not.toBeNull();
    expect(aerolineaAlmacenada.nombre).toEqual(aerolinea.nombre);
  });

  it('update deberia lanzar una excepción para una aerolinea con fecha de fundacion incorrecta', async () => {
    let aerolinea: AerolineaEntity = listaAerolineas[0];
    aerolinea = {
      ...aerolinea, fechaFundacion: faker.date.future()
    }
    try {
      await service.update(aerolinea.id, aerolinea)
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "La fecha de fundacion es mayor que la fecha actual");
    }    
  });

  it('update deberia lanzar una excepción para una aerolinea invalida', async () => {
    let aerolinea: AerolineaEntity = listaAerolineas[0];
    aerolinea = {
      ...aerolinea, nombre: "Nuevo nombre"
    }
    try {
      await service.update(faker.string.uuid(), aerolinea)
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "La aerolinea con el id dado no existe");
    }    
  });

  it('delete deberia remover una aerolinea', async () => {
    const aerolinea: AerolineaEntity = listaAerolineas[0];
    await service.delete(aerolinea.id);
     const aerolineaEliminada: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(aerolineaEliminada).toBeNull();
  });

  it('delete deberia lanzar una excepción para una aerolinea invalida', async () => {
    try {
      await service.delete(faker.string.uuid())
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "La aerolinea con el id dado no existe");
    }    
  });

});
