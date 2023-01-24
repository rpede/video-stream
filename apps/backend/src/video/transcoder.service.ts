import { Injectable, Logger } from "@nestjs/common";
import * as ffmpeg from 'fluent-ffmpeg';
import * as stream from 'stream';
import { Format } from "./formats";

export type TranscoderOutput = {
    mimetype: string;
    stream: stream.Readable;
};

@Injectable()
export class TranscoderService {
    private readonly logger = new Logger(TranscoderService.name);

    stream(path: string, format: Format): TranscoderOutput {
        this.logger.log(`Outputting: ${format.name}`);
        const transformStream = new stream.Transform({
            transform(chunk, encoding, callback) {
                this.push(chunk);
                callback();
            },
        });
        const proc = ffmpeg(path)
            .preset(format.preset)
            .on('end', () => {
                this.logger.log('transcoding done');
            })
            .on('error', function (err) {
                this.logger.error(err);
            })
            .pipe(transformStream, { end: true });
        return { mimetype: format.mimetype, stream: transformStream }
    }
}