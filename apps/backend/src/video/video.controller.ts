import { Controller, Get } from '@nestjs/common';
import { Video } from '@video-stream/interface';

@Controller('videos')
export class VideoController {
  @Get()
  get() {
    return [
      {
        id: 1,
        name: 'Me at the Zoo',
        length: 20,
      },
    ] as Video[];
  }
}
