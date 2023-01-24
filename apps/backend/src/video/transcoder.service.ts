import { Injectable, Logger } from "@nestjs/common";
import * as ffmpeg from 'fluent-ffmpeg';
import * as stream from 'stream';
import { Format } from "./formats";
import * as fs from 'fs';

export type TranscoderOutput = {
    mimetype: string;
    stream: stream.Readable;
};

@Injectable()
export class TranscoderService {
    private readonly logger = new Logger(TranscoderService.name);

    stream(inputPath: string, format: Format): TranscoderOutput {
        this.logger.log(`Outputting: ${format.name}`);
        const transformStream = new stream.Transform({
            transform(chunk, encoding, callback) {
                this.push(chunk);
                callback();
            },
        });
        const proc = ffmpeg(inputPath)
            .preset(format.preset)
            .on('end', () => this.logger.log('transcoding done'))
            .on('error', (err) => this.logger.error(err))
            .pipe(transformStream, { end: true });
        return { mimetype: format.mimetype, stream: transformStream }
    }

    async writeToFile(inputPath: string, outputPath: string, format: Format) {
        return new Promise((resolve, reject) => {
            var writeStream = fs.createWriteStream(outputPath);
            const proc = ffmpeg(inputPath)
                .preset(format.preset)
                .on('end', () => resolve(writeStream.bytesWritten))
                .on('error', (err) => reject(err))
                .pipe(writeStream, { end: true });
        })
    }
}