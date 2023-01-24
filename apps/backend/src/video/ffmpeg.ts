import { Inject, Provider } from "@nestjs/common";
import * as ffmpeg from 'fluent-ffmpeg';

const FFMPEG_TOKEN = 'FfmpegToken';

export const FfmpegProvider: Provider<Ffmpeg> = {
    provide: FFMPEG_TOKEN,
    useValue: ffmpeg,
};

export const InjectFfmpeg = () => {
    return Inject(FFMPEG_TOKEN);
}

export type Ffmpeg = typeof ffmpeg;

export const lowQuality = (vid: ffmpeg.FfmpegCommand) => vid
    .addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
    .format('mp4')
    .size('640x?')
    .videoBitrate('512k')
    .videoCodec('libx264')
    .fps(24)
    .audioBitrate('96k')
    .audioCodec('aac')
    .audioFrequency(22050)
    .audioChannels(2);