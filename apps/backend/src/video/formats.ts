import * as ffmpeg from 'fluent-ffmpeg';

export interface Format {
    name: string;
    mimetype: string;
    preset: ffmpeg.PresetFunction;
}

export class LowQuality implements Format {
    readonly name = LowQuality.name;
    readonly mimetype = 'video/mp4';

    preset(ffmpeg: ffmpeg.FfmpegCommand) {
        return ffmpeg.addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov')
            .format('mp4')
            .size('640x?')
            .videoBitrate('512k')
            .videoCodec('libx264')
            .fps(24)
            .audioBitrate('96k')
            .audioCodec('aac')
            .audioFrequency(22050)
            .audioChannels(2);
    }
}