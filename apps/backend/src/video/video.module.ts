import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from './prisma.service';
import { TranscoderService } from './transcoder.service';
import { VideoController } from './video.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [VideoController],
  providers: [TranscoderService, PrismaService],
})
export class VideoModule { }
