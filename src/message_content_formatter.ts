import { join, basename } from 'path';
import { arraysMatchUnordered } from './array_utils';

// TODO: move this export into a separate file
export type html = string;

export class MessageContentFormatter {
    private readonly DEFAULT_BLANK_MESSAGE = '';
    private readonly DEFAULT_UNSENT_MESSAGE = 'Unsent message';

    private readonly STANDARD_MESSAGE_KEYS = [
        'sender_name',
        'timestamp_ms',
        'is_geoblocked_for_viewer',
        'is_unsent_image_by_messenger_kid_parent',
    ];

    private pathFromOutputDirToFbJsonRootDir: string;
    constructor(pathFromOutputDirToFbJsonRootDir: string) {
        // TODO clean up this unholy mess of path manip (what's relative? What's absolute? idk!)
        this.pathFromOutputDirToFbJsonRootDir = pathFromOutputDirToFbJsonRootDir.replace('/your_facebook_activity', '');
    }

    // TODO: Add better formatting for messages which are shares/forwards
    format(message: Record<string, unknown>): html {
        if ('content' in message) {
            return this.formatText(message);
        } else if ('sticker' in message) {
            return this.formatSticker(message);
        } else if ('files' in message) {
            return this.formatFiles(message);
        } else if ('photos' in message) {
            return this.formatPhotos(message);
        } else if ('videos' in message) {
            return this.formatVideos(message);
        } else if ('audio_files' in message) {
            return this.formatAudioFiles(message);
        } else if ('gifs' in message) {
            return this.formatGifs(message);
        } else if ('plan' in message) {
            return this.formatPlan(message);
        } else if ('is_unsent' in message) {
            return this.DEFAULT_UNSENT_MESSAGE;
        } else if ('share' in message) {
            return this.formatShare(message);
        } else if ('bumped_message_metadata' in message) {
            return this.formatBumpedMessage(message);
        } else if (this.isEmptyGenericMessage(message)) {
            return this.DEFAULT_BLANK_MESSAGE;
        } else {
            console.log(JSON.stringify(message));
            return `Unknown type. Full hash: ${JSON.stringify(message)}`;
        }
    }

    private formatText(message): html {
        return message.content.replace('\n', '<br>\n');
    }

    private formatSticker(message): html {
        return `<img src="${join(this.pathFromOutputDirToFbJsonRootDir, message.sticker.uri)}" class="sticker">`;
    }

    private formatFiles(message): html {
        return message.files
            .map((file) => {
                return `Attached file: <a href="${join(this.pathFromOutputDirToFbJsonRootDir, file.uri)}">${basename(
                    file.uri,
                )}</a>`;
            })
            .join('\n');
    }

    private formatPhotos(message): html {
        return message.photos
            .map((photo) => {
                return `<img src="${join(this.pathFromOutputDirToFbJsonRootDir, photo.uri)}">`;
            })
            .join('\n');
    }

    private formatVideos(message): html {
        return message.videos
            .map((video) => {
                return `<video controls src="${join(this.pathFromOutputDirToFbJsonRootDir, video.uri)}">`;
            })
            .join('\n');
    }

    // TODO: refactor to combine this logic with video
    private formatAudioFiles(message): html {
        return message.audio_files
            .map((audio) => {
                return `<audio controls src="${join(this.pathFromOutputDirToFbJsonRootDir, audio.uri)}">`;
            })
            .join('\n');
    }

    // TODO: refactor to combine this logic with photos
    private formatGifs(message): html {
        return message.gifs
            .map((gif) => {
                return `<img src="${join(this.pathFromOutputDirToFbJsonRootDir, gif.uri)}">`;
            })
            .join('\n');
    }

    private formatPlan(message): html {
        return `Plan: ${message.plan.title}`;
    }

    private isEmptyGenericMessage(message): boolean {
        const messageKeys = Object.keys(message);
        return (
            arraysMatchUnordered(messageKeys, this.STANDARD_MESSAGE_KEYS) ||
            arraysMatchUnordered(messageKeys, this.STANDARD_MESSAGE_KEYS.concat(['reactions'])) ||
            arraysMatchUnordered(messageKeys, this.STANDARD_MESSAGE_KEYS.concat(['ip']))
        );
    }

    private formatBumpedMessage(message): html {
        return `Bumped message: ${message.bumped_message_metadata.bumped_message}`;
    }

    private formatShare(message): html {
        return `Shared message: ${message.share.link}`;
    }
}
