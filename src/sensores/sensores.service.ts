import { Injectable } from '@nestjs/common';
import { CreateSensoreDto } from './dto/create-sensore.dto';
import { UpdateSensoreDto } from './dto/update-sensore.dto';
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface Sensor {
  id: number;
  nome: string;
  tipo: string;
  pino: number;
  ativo?: boolean;
}

@Injectable()
export class SensoresService {
  private readonly filePath = join(process.cwd(), 'data', 'sensores.json');

  private async readData(): Promise<Sensor[]> {
    try {
      const data = await readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private async saveData(data: Sensor[]): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async create(dto: CreateSensoreDto): Promise<Sensor> {
    const sensores = await this.readData();
    const novoSensor: Sensor = { id: Date.now(), ...dto, ativo: true };
    sensores.push(novoSensor);
    await this.saveData(sensores);
    return novoSensor;
  }

  async findAll(): Promise<Sensor[]> {
    return this.readData();
  }

  async findOne(id: number): Promise<Sensor | undefined> {
    const sensores = await this.readData();
    return sensores.find(s => s.id === id);
  }

  async update(id: number, dto: UpdateSensoreDto): Promise<Sensor | null> {
    const sensores = await this.readData();
    const index = sensores.findIndex(s => s.id === id);
    if (index > -1) {
      sensores[index] = { ...sensores[index], ...dto };
      await this.saveData(sensores);
      return sensores[index];
    }
    return null;
  }

  async patch(id: number, dto: UpdateSensoreDto): Promise<Sensor | null> {
    return this.update(id, dto);
  }

  async remove(id: number): Promise<void> {
    let sensores = await this.readData();
    sensores = sensores.filter(s => s.id !== id);
    await this.saveData(sensores);
  }
}