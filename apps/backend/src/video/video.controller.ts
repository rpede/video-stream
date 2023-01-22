import {
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import 'multer';
import { Video } from '@video-stream/interface';
import { PrismaService } from './prisma.service';
import { createReadStream } from 'fs';

@Controller('video')
export class VideoController {
  constructor(private readonly db: PrismaService) {}

  @Get()
  videos(): Promise<Video[]> {
    return this.db.video
      .findMany()
      .then((videos) =>
        videos.map((video) => ({
          id: video.id,
          name: video.name,
          size: video.size,
        }))
      );
  }

  @Get(':id')
  async play(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const video = await this.db.video.findUnique({ where: { id } });
    res.set({ 'Content-Type': video.mimetype });
    return new StreamableFile(createReadStream(video.path));
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /video\/*/ })],
      })
    )
    file: Express.Multer.File
  ) {
    console.log(file);
    return this.db.video.create({
      data: {
        name: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  }
}
