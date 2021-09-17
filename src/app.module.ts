import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntityModule } from './app/entity.module';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    EntityModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
