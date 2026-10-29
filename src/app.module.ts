import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClothesController } from './clothes/clothes.controller';
import { ClothesService } from './clothes/clothes.service';

@Module({
  imports: [],
  controllers: [AppController, ClothesController],
  providers: [AppService, ClothesService],
})
export class AppModule {}
