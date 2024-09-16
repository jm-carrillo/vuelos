/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../compartido/utilidades/typeorm-testing-config';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let listaAeropuertos : AeropuertoEntity[];  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();
 
    listaAeropuertos = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
          nombre: faker.company.name(),
          codigo: faker.string.alphanumeric(3),
          pais: faker.location.country(),
          ciudad: faker.location.city()
        })
        listaAeropuertos.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past().toDateString(),
      paginaWeb: faker.internet.url(),
      aeropuertos: listaAeropuertos
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline deberia adicionar un aeropuerto a una aerolinea', async () => {
    const aeropuertoNuevo: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    const aerolineaNueva: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past().toDateString(),
      paginaWeb: faker.internet.url()
    })
 
    const resultado: AerolineaEntity = await service.addAirportToAirline(aerolineaNueva.id, aeropuertoNuevo.id);
   
    expect(resultado.aeropuertos.length).toBe(1);
    expect(resultado.aeropuertos[0]).not.toBeNull();
    expect(resultado.aeropuertos[0].nombre).toBe(aeropuertoNuevo.nombre)
  });

  it('addAirportToAirline deberia lanzar una excepción para un aeropuerto invalido', async () => {
    const aerolineaNueva: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past().toDateString(),
      paginaWeb: faker.internet.url()
    })
 
    try {
      await service.addAirportToAirline(aerolineaNueva.id, faker.string.uuid())
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "El aeropuerto con el id dado no existe");
    }
  });

  it('addAirportToAirline deberia lanzar una excepción para una aerolinea invalida', async () => {
    const aeropuertoNuevo: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    try {
      await service.addAirportToAirline(faker.string.uuid(), aeropuertoNuevo.id)
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "La aerolinea con el id dado no existe");
    }    
  });

  it('findAirportFromAirline deberia retornar un producto de una categoria', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0];
    const aeropuertoAlmacenado: AeropuertoEntity = await service.findAirportFromAirline(aerolinea.id, aeropuerto.id)
    expect(aeropuertoAlmacenado).not.toBeNull();
    expect(aeropuertoAlmacenado.nombre).toBe(aeropuerto.nombre);
    expect(aeropuertoAlmacenado.codigo).toBe(aeropuerto.codigo);
    expect(aeropuertoAlmacenado.pais).toBe(aeropuerto.pais);
    expect(aeropuertoAlmacenado.ciudad).toBe(aeropuerto.ciudad);    
  });

  it('findAirportFromAirline deberia lanzar una excepción para un aeropuerto invalido', async () => {
    try {
      await service.findAirportFromAirline(aerolinea.id, faker.string.uuid())
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "El aeropuerto con el id dado no existe");
    }  
  });

  it('findAirportFromAirline deberia lanzar una excepción para una aerolinea invalida', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0];
    try {
      await service.findAirportFromAirline(faker.string.uuid(), aeropuerto.id)
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "La aerolinea con el id dado no existe");
    }  
  });

  it('findAirportFromAirline deberia lanzar una excepción para un aeropuerto no asociado con la aerolinea', async () => {
    const aeropuertoNuevo: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    try {
      await service.findAirportFromAirline(aerolinea.id, aeropuertoNuevo.id)
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.PRECONDITION_FAILED);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "El aeropuerto con el id dado no esta asociado con la aerolinea");
    }  
  });

  it('findAirportFromAirline deberia retornar los aeropuertos de una aerolinea dada', async ()=>{
    const aeropuertos: AeropuertoEntity[] = await service.findAirportsFromAirline(aerolinea.id);
    expect(aeropuertos.length).toBe(5)
  });

  it('findAirportFromAirline deberia lanzar una excepción por una aerolinea invalida', async () => {
    try {
      await service.findAirportFromAirline(faker.string.uuid(), listaAeropuertos[0].id)
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "La aerolinea con el id dado no existe");
    }  
  });

  it('updateAirportsFromAirline deberia actualizar una lista de aeropuertos de una aerolinea', async () => {
    const aeropuertoNuevo: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    const aerolineaActualizada: AerolineaEntity = await service.updateAirportsFromAirline(aerolinea.id, [aeropuertoNuevo]);
    expect(aerolineaActualizada.aeropuertos.length).toBe(1); 
    expect(aerolineaActualizada.aeropuertos[0].nombre).toBe(aeropuertoNuevo.nombre);
    expect(aerolineaActualizada.aeropuertos[0].codigo).toBe(aeropuertoNuevo.codigo);
    expect(aerolineaActualizada.aeropuertos[0].pais).toBe(aeropuertoNuevo.pais);
    expect(aerolineaActualizada.aeropuertos[0].ciudad).toBe(aeropuertoNuevo.ciudad);
  });

  it('updateAirportsFromAirline deberia lanzar una excepción por una aerolinea invalida', async () => {
    const aeropuertoNuevo: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    try {
      await service.updateAirportsFromAirline(faker.string.uuid(), [aeropuertoNuevo])
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "La aerolinea con el id dado no existe");
    } 
  });

  it('updateAirportsFromAirline deberia lanzar una excepción por un aeropuerto invalido', async () => {
    const aeropuertoNuevo: AeropuertoEntity = listaAeropuertos[0];
    aeropuertoNuevo.id = faker.string.uuid();
 
    try {
      await service.updateAirportsFromAirline(aerolinea.id, [aeropuertoNuevo])
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "El aeropuerto con el id dado no existe");
    }  
  });

  it('deleteAirportFromAirline deberia eliminar un aeropuerto de una aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0];
   
    await service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id);
 
    const aerolineaAlmacenada: AerolineaEntity = await aerolineaRepository.findOne({where: {id: aerolinea.id}, relations: ["aeropuertos"]});
    const aeropuertoEliminado: AeropuertoEntity = aerolineaAlmacenada.aeropuertos.find(a => a.id === aeropuerto.id);
 
    expect(aeropuertoEliminado).toBeUndefined();
 
  });

  it('deleteAirportFromAirline deberia lanzar una excepción por un aeropuerto invalido', async () => {
    try {
      await service.deleteAirportFromAirline(aerolinea.id, faker.string.uuid())
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "El aeropuerto con el id dado no existe");
    }  
  });

  it('deleteAirportFromAirline deberia lanzar una excepción por una aerolinea invalida', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0];
    try {
      await service.deleteAirportFromAirline(faker.string.uuid(), aeropuerto.id)
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "La aerolinea con el id dado no existe");
    }  
  });

  it('deleteAirportFromAirline deberia lanzar una excepción por un aeropuerto no asociado con una aerolinea dada', async () => {
    const aeropuertoNuevo: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    try {
      await service.deleteAirportFromAirline(aerolinea.id, aeropuertoNuevo.id)
    }
    catch (error) {      
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.PRECONDITION_FAILED);
      expect((error as HttpException).getResponse()).toHaveProperty("mensaje", "El aeropuerto con el id dado no esta asociado con la aerolinea");
    }  
  });
});
