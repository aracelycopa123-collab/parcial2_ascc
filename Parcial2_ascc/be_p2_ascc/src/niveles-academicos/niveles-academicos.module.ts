import { Module } from '@nestjs/common';
import { NivelesAcademicosService } from './niveles-academicos.service';
import { NivelesAcademicosController } from './niveles-academicos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NivelAcademico } from './entities/nivel-academico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NivelAcademico])],
  controllers: [NivelesAcademicosController],
  providers: [NivelesAcademicosService],
  exports: [
    TypeOrmModule.forFeature([NivelAcademico]),
    NivelesAcademicosService,
  ],
})
export class NivelesAcademicosModule {}
