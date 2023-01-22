import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from './prisma.service';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [VideoController],
  providers: [VideoService, PrismaService],
})
export class VideoModule {}
