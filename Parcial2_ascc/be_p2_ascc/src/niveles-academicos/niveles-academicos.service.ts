import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateNivelAcademicoDto } from './dto/update-nivel-academico.dto';
import { CreateNivelAcademicoDto } from './dto/create-nivel-academico.dto';
import { NivelAcademico } from './entities/nivel-academico.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NivelesAcademicosService {
  constructor(
    @InjectRepository(NivelAcademico)
    private nivelesAcademicosRepository: Repository<NivelAcademico>,
  ) {}

  async create(
    createNivelAcademicoDto: CreateNivelAcademicoDto,
  ): Promise<NivelAcademico> {
    const existe = await this.nivelesAcademicosRepository.findOneBy({
      nombre: createNivelAcademicoDto.nombre.trim(),
    });
    if (existe) throw new ConflictException('El nivel academico ya existe');

    const nivelAcademico = new NivelAcademico();
    nivelAcademico.nombre = createNivelAcademicoDto.nombre.trim();
    nivelAcademico.descripcion = createNivelAcademicoDto.descripcion?.trim();
    return this.nivelesAcademicosRepository.save(nivelAcademico);
  }

  async findAll(): Promise<NivelAcademico[]> {
    return this.nivelesAcademicosRepository.find();
  }

  async findOne(id: number): Promise<NivelAcademico> {
    const nivelAcademico = await this.nivelesAcademicosRepository.findOneBy({
      id,
    });
    if (!nivelAcademico)
      throw new NotFoundException('El nivel Academico no existe');
    return nivelAcademico;
  }

  async update(
    id: number,
    updateNivelAcademicoDto: UpdateNivelAcademicoDto,
  ): Promise<NivelAcademico> {
    const nivelAcademico = await this.findOne(id);
    Object.assign(nivelAcademico, updateNivelAcademicoDto);
    return this.nivelesAcademicosRepository.save(nivelAcademico);
  }

  async remove(id: number): Promise<NivelAcademico> {
    const nivelAcademico = await this.findOne(id);
    return this.nivelesAcademicosRepository.softRemove(nivelAcademico);
  }
}
