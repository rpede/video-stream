import {
  Controller,
  FileTypeValidator,
  Get,
  Logger,
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
import { Ffmpeg, InjectFfmpeg, lowQuality } from './ffmpeg';
import * as stream from 'stream';

@Controller('video')
export class VideoController {
  private readonly logger = new Logger(VideoController.name);

  constructor(
    private readonly db: PrismaService,
    @InjectFfmpeg() private readonly ffmpeg: Ffmpeg
  ) { }

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
    res.contentType('video/mp4');
    const video = await this.db.video.findUnique({ where: { id } });
    console.log(video.path);
    const transformStream = new stream.Transform({
      transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
      },
    });
    const proc = this.ffmpeg(video.path)
      .preset(lowQuality)
      .on('end', () => {
          this.logger.log('file has been converted succesfully');
        })
      .on('error', function (err) {
        this.logger.log('an error happened: ' + err.message);
      })
      .pipe(transformStream, { end: true });
    return new StreamableFile(transformStream);
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
    this.logger.log(file);
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
