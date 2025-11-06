import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { Programa } from './entities/programa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProgramasService {
  constructor(
    @InjectRepository(Programa)
    private programasRepository: Repository<Programa>,
  ) {}

  async create(createProgramaDto: CreateProgramaDto): Promise<Programa> {
    const existe = await this.programasRepository.findOneBy({
      nombre: createProgramaDto.nombre,
    });

    if (existe) throw new ConflictException('El programa ya existe');

    const programa = new Programa();
    programa.idNivelAcademico = createProgramaDto.idNivelAcademico;
    programa.nombre = createProgramaDto.nombre.trim();
    programa.descripcion = createProgramaDto.descripcion.trim();
    programa.version = createProgramaDto.version;
    programa.duracionMeses = createProgramaDto.duracionMeses;
    programa.costo = createProgramaDto.costo;
    programa.fechaInicio = createProgramaDto.fechaInicio;
    programa.estado = createProgramaDto.estado.trim();
    return this.programasRepository.save(programa);
  }

  async findAll(): Promise<Programa[]> {
    return this.programasRepository.find({
      relations: { nivelAcademico: true },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        version: true,
        duracionMeses: true,
        costo: true,
        fechaInicio: true,
        estado: true,
        nivelAcademico: {
          id: true,
          descripcion: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Programa> {
    const programa = await this.programasRepository.findOne({
      where: { id },
      relations: { nivelAcademico: true },
    });

    if (!programa) throw new NotFoundException('El programa no existe');
    return programa;
  }

  async update(
    id: number,
    updateProgramaDto: UpdateProgramaDto,
  ): Promise<Programa> {
    const programa = await this.findOne(id);
    Object.assign(programa, updateProgramaDto);
    return this.programasRepository.save(programa);
  }

  async remove(id: number) {
    const programa = await this.findOne(id);
    if (programa) return this.programasRepository.softRemove(programa);
  }
}
