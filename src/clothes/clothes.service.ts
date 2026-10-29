import { Injectable, NotFoundException } from '@nestjs/common';
import { Clothes } from './entities/clothes.entity';
import { CreateClothesDto } from './dto/create-clothes.dto';
import { UpdateClothesDto } from './dto/update-clothes.dto';

@Injectable()
export class ClothesService {
  private items: Clothes[] = [
    {
      id: '1',
      title: 'Худі оверсайз базове',
      price: 1800,
      size: 'L',
      material: '100% бавовна',
      color: 'Чорний',
    },
    {
      id: '2',
      title: 'Джинси прямі Regular Fit',
      price: 2400,
      size: '32/32',
      material: 'Денім',
      color: 'Синій класичний',
    },
    {
      id: '3',
      title: 'Кросівки бігові Ultralight',
      price: 3200,
      size: '42',
      material: 'Дихаюча сітка, текстиль',
      color: 'Білий',
    },
  ];

  findAll(): Clothes[] {
    return this.items;
  }

  findOne(id: string): Clothes {
    const item = this.items.find((entity) => entity.id === id);
    if (!item) {
      throw new NotFoundException(`Сутність з ID ${id} не знайдена`);
    }
    return item;
  }

  create(dto: CreateClothesDto): Clothes {
    const newItem: Clothes = {
      id: Date.now().toString(),
      ...dto,
    };
    this.items.push(newItem);
    return newItem;
  }

  update(id: string, dto: UpdateClothesDto): Clothes {
    const index = this.items.findIndex((entity) => entity.id === id);
    if (index === -1) {
      throw new NotFoundException(`Сутність з ID ${id} не знайдена`);
    }

    const updatedItem: Clothes = {
      ...this.items[index],
      ...dto,
    };

    this.items[index] = updatedItem;
    return updatedItem;
  }

  remove(id: string): void {
    const index = this.items.findIndex((entity) => entity.id === id);
    if (index === -1) {
      throw new NotFoundException(`Сутність з ID ${id} не знайдена`);
    }
    this.items.splice(index, 1);
  }
}
