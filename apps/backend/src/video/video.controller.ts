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
import { TranscoderService } from './transcoder.service';
import { LowQuality } from './formats';

@Controller('video')
export class VideoController {

  constructor(
    private readonly db: PrismaService,
    private readonly transcoder: TranscoderService
  ) { }

  @Get()
  async videos(): Promise<Video[]> {
    const videos = await this.db.video.findMany();
    return videos.map((video) => ({
      id: video.id,
      name: video.name,
      size: video.size,
    }))
  }

  @Get(':id')
  async play(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const video = await this.db.video.findUnique({ where: { id } });
    const output = this.transcoder.stream(video.path, new LowQuality());
    res.contentType(output.mimetype);
    return new StreamableFile(output.stream);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /video\/*/ })],
      })
    )
    file: Express.Multer.File
  ) {
    const video = await this.db.video.create({
      data: {
        name: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
    return video;
  }

}
