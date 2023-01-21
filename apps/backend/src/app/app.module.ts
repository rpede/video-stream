import { Module } from '@nestjs/common';
import { VideoModule } from '../video/video.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [VideoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
