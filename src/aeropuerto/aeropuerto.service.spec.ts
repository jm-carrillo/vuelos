/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../compartido/utilidades/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let listaAeropuertos: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();    
    listaAeropuertos = []
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await repository.save({
          nombre: faker.company.name(),
          codigo: faker.string.alphanumeric(3),
          pais: faker.location.country(),
          ciudad: faker.location.city()
        });
        listaAeropuertos.push(aeropuerto);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(listaAeropuertos.length);
  });

  it('findOne deberia retornar un aeropuerto por id', async () => {
    const aeropuertoAlmacenado: AeropuertoEntity = listaAeropuertos[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(aeropuertoAlmacenado.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(aeropuertoAlmacenado.nombre);
    expect(aeropuerto.codigo).toEqual(aeropuertoAlmacenado.codigo);
    expect(aeropuerto.pais).toEqual(aeropuertoAlmacenado.pais);
    expect(aeropuerto.pais).toEqual(aeropuertoAlmacenado.pais);
  });

  it('findOne deberia lanzar una excepción para un aeropuerto invalido', async () => {
    try {
      await service.findOne(faker.string.uuid())
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "El aeropuerto con el id dado no existe");
    }
  });

  it('create deberia retornar un nuevo aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: []
    }
 
    const nuevaAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(nuevaAeropuerto).not.toBeNull();
 
    const aeropuertoAlmacenado: AeropuertoEntity = await repository.findOne({where: {id: nuevaAeropuerto.id}})
    expect(aeropuertoAlmacenado).not.toBeNull();
    expect(aeropuertoAlmacenado.nombre).toEqual(nuevaAeropuerto.nombre);
    expect(aeropuertoAlmacenado.codigo).toEqual(nuevaAeropuerto.codigo);
    expect(aeropuertoAlmacenado.pais).toEqual(nuevaAeropuerto.pais);
    expect(aeropuertoAlmacenado.ciudad).toEqual(nuevaAeropuerto.ciudad);
  });

  it('create deberia lanzar una excepción para un aeropuerto con codigo que no contiene 3 caracteres', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(5),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: []
    }
 
    try {
      await service.create(aeropuerto);
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "El codigo del aeropuerto debe tener 3 caracteres");
    }
  });

  it('update deberia modificar un aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0];
    aeropuerto.nombre = "Nuevo nombre";
    const aeropuertoActualizado: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(aeropuertoActualizado).not.toBeNull();
    const aeropuertoAlmacenado: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(aeropuertoAlmacenado).not.toBeNull();
    expect(aeropuertoAlmacenado.nombre).toEqual(aeropuerto.nombre);
  });

  it('update deberia lanzar una excepción para un aeropuerto con codigo que no contiene 3 caracteres', async () => {
    let aeropuerto: AeropuertoEntity = listaAeropuertos[0];
    aeropuerto = {
      ...aeropuerto, codigo: faker.string.alphanumeric(5)
    }
    try {
      await service.update(aeropuerto.id, aeropuerto)
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "El codigo del aeropuerto debe tener 3 caracteres");
    }    
  });

  it('update deberia lanzar una excepción para una aeropuerto invalido', async () => {
    let aeropuerto: AeropuertoEntity = listaAeropuertos[0];
    aeropuerto = {
      ...aeropuerto, nombre: "Nuevo nombre"
    }
    try {
      await service.update(faker.string.uuid(), aeropuerto)
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "El aeropuerto con el id dado no existe");
    }    
  });

  it('delete deberia remover un aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0];
    await service.delete(aeropuerto.id);
     const aeropuertoEliminado: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(aeropuertoEliminado).toBeNull();
  });

  it('delete deberia lanzar una excepción para un aeropuerto invalido', async () => {
    try {
      await service.delete(faker.string.uuid())
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "El aeropuerto con el id dado no existe");
    }    
  });

});
