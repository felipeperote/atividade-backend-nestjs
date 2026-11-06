import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface Task {
  id: number;
  descricao: string;
  inicio: number;
  fim: number;
  status?: string;
  resultado?: number[] | null;
}

@Injectable()
export class TasksService {
  private readonly filePath = join(process.cwd(), 'data', 'tasks.json');

  private async readTasks(): Promise<Task[]> {
    try {
      const data = await readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(tasks, null, 2));
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const tasks = await this.readTasks();
    const newTask: Task = { id: Date.now(), ...dto, status: 'Pendente', resultado: null };
    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  }

  async findAll(): Promise<Task[]> {
    return this.readTasks();
  }

  async findOne(id: number): Promise<Task | undefined> {
    const tasks = await this.readTasks();
    return tasks.find(t => t.id === id);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task | null> {
    const tasks = await this.readTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index > -1) {
      tasks[index] = { ...tasks[index], ...dto };
      await this.saveTasks(tasks);
      return tasks[index];
    }
    return null;
  }

  async patch(id: number, dto: UpdateTaskDto): Promise<Task | null> {
    return this.update(id, dto);
  }

  async remove(id: number): Promise<void> {
    let tasks = await this.readTasks();
    tasks = tasks.filter(t => t.id !== id);
    await this.saveTasks(tasks);
  }
}