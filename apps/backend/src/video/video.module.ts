import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FfmpegProvider } from './ffmpeg';
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
  providers: [VideoService, PrismaService, FfmpegProvider],
})
export class VideoModule {}
