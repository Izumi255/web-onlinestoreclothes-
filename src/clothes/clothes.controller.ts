import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { CreateClothesDto } from './dto/create-clothes.dto';
import { UpdateClothesDto } from './dto/update-clothes.dto';
import { Clothes } from './entities/clothes.entity';

@Controller('clothes')
export class ClothesController {
  constructor(private readonly clothesService: ClothesService) {}

  @Get()
  findAll(): Clothes[] {
    return this.clothesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Clothes {
    return this.clothesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClothesDto: CreateClothesDto): Clothes {
    return this.clothesService.create(createClothesDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClothesDto: UpdateClothesDto,
  ): Clothes {
    return this.clothesService.update(id, updateClothesDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.clothesService.remove(id);
  }
}
