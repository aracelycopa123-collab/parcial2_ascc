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
    const nombreTrim = createProgramaDto.nombre.trim();

    // Comprobación case-insensitive para evitar duplicados por mayúsculas/minúsculas
      const existe = await this.programasRepository.findOneBy({
        nombre: nombreTrim,
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
    programa.areaConocimiento = (createProgramaDto as any).areaConocimiento;
    return this.programasRepository.save(programa);
  }

  async findAll(q?: string) {
    return await this.programasRepository.find({
      relations: ['nivelAcademico'],
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
    // Si se intenta cambiar el nombre, verificar unicidad (excluyendo este id)
    let dtoToAssign: any = updateProgramaDto;
    if (updateProgramaDto.nombre) {
      const nombreTrim = (updateProgramaDto.nombre as string).trim();
      const existe = await this.programasRepository
        .createQueryBuilder('p')
        .where('LOWER(p.nombre) = LOWER(:nombre)', { nombre: nombreTrim })
        .andWhere('p.id != :id', { id })
        .getOne();

      if (existe) throw new ConflictException('El programa ya existe');
      dtoToAssign = { ...updateProgramaDto, nombre: nombreTrim } as any;
    }

    Object.assign(programa, dtoToAssign);
    return this.programasRepository.save(programa);
  }

  async remove(id: number) {
    const programa = await this.findOne(id);
    if (programa) return this.programasRepository.softRemove(programa);
  }
}
