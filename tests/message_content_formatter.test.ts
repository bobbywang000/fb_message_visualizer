import { MessageContentFormatter } from '../src/message_content_formatter';
import { stripIndent } from 'common-tags';
import { type } from 'os';

describe('format', () => {
    const formatter = new MessageContentFormatter('~/fb-user-json');
    const baseMessage = {
        sender_name: 'My Friend',
        timestamp_ms: 1481812402669,
        type: 'Generic',
    };

    it('formats text messages correctly', () => {
        const message = {
            content: 'Hi \ud83d\ude01',
            ...baseMessage,
        };

        expect(formatter.format(message)).toBe('Hi 😁');
    });

    it('formats stickers correctly', () => {
        const message = {
            sticker: {
                uri: 'messages/stickers_used/123_456_789.png',
            },
            ...baseMessage,
        };

        expect(formatter.format(message)).toBe(
            `<img src="~/fb-user-json/messages/stickers_used/123_456_789.png" class="sticker">`,
        );
    });

    it('formats file attachments correctly', () => {
        const message = {
            files: [
                {
                    uri: 'messages/inbox/MyFriend_HaiKks38/files/Attachment1.pdf',
                    creation_timestamp: 1421707714,
                },
                {
                    uri: 'messages/inbox/MyFriend_HaiKks38/files/Attachment2.txt',
                    creation_timestamp: 1421707717,
                },
            ],
            ...baseMessage,
        };

        expect(formatter.format(message)).toBe(stripIndent`
            Attached file: <a href="~/fb-user-json/messages/inbox/MyFriend_HaiKks38/files/Attachment1.pdf">Attachment1.pdf</a>
            Attached file: <a href="~/fb-user-json/messages/inbox/MyFriend_HaiKks38/files/Attachment2.txt">Attachment2.txt</a>
        `);
    });

    it('formats static photos correctly', () => {
        const message = {
            photos: [
                {
                    uri: 'messages/inbox/MyFriend_HaiKks38/photos/Photo1.jpg',
                    creation_timestamp: 1421707714,
                },
                {
                    uri: 'messages/inbox/MyFriend_HaiKks38/photos/Photo2.png',
                    creation_timestamp: 1421707717,
                },
            ],
            ...baseMessage,
        };

        expect(formatter.format(message)).toBe(stripIndent`
           <img src="~/fb-user-json/messages/inbox/MyFriend_HaiKks38/photos/Photo1.jpg">
           <img src="~/fb-user-json/messages/inbox/MyFriend_HaiKks38/photos/Photo2.png">
        `);
    });

    it('formats videos correctly', () => {
        const message = {
            videos: [
                {
                    uri: 'messages/inbox/MyFriend_HaiKks38/videos/Video1.mp4',
                    creation_timestamp: 1421707714,
                },
                {
                    uri: 'messages/inbox/MyFriend_HaiKks38/videos/Video2.mp4',
                    creation_timestamp: 1421707717,
                },
            ],
            ...baseMessage,
        };

        expect(formatter.format(message)).toBe(stripIndent`
           <video controls src="~/fb-user-json/messages/inbox/MyFriend_HaiKks38/videos/Video1.mp4">
           <video controls src="~/fb-user-json/messages/inbox/MyFriend_HaiKks38/videos/Video2.mp4">
        `);
    });

    it('formats audio messages correctly', () => {
        const message = {
            audio_files: [
                {
                    uri: 'messages/inbox/MyFriend_HaiKks38/audio/Audio1.aac',
                    creation_timestamp: 1421707714,
                },
                {
                    uri: 'messages/inbox/MyFriend_HaiKks38/audio/Audio2.mp3',
                    creation_timestamp: 1421707717,
                },
            ],
            ...baseMessage,
        };

        expect(formatter.format(message)).toBe(stripIndent`
           <audio controls src="~/fb-user-json/messages/inbox/MyFriend_HaiKks38/audio/Audio1.aac">
           <audio controls src="~/fb-user-json/messages/inbox/MyFriend_HaiKks38/audio/Audio2.mp3">
        `);
    });

    it('formats gifs correctly', () => {
        const message = {
            gifs: [
                {
                    uri: 'messages/inbox/MyFriend_HaiKks38/gifs/Gif1.gif',
                    creation_timestamp: 1421707714,
                },
                {
                    uri: 'messages/inbox/MyFriend_HaiKks38/gifs/Gif2.gif',
                    creation_timestamp: 1421707717,
                },
            ],
            ...baseMessage,
        };

        expect(formatter.format(message)).toBe(stripIndent`
           <img src="~/fb-user-json/messages/inbox/MyFriend_HaiKks38/gifs/Gif1.gif">
           <img src="~/fb-user-json/messages/inbox/MyFriend_HaiKks38/gifs/Gif2.gif">
        `);
    });

    it('formats plan messages correctly', () => {
        const message = {
            plan: {
                title: 'dinner',
                timestamp: 1492275600,
                location: "cane's",
            },
            ...baseMessage,
        };

        expect(formatter.format(message)).toBe('Plan: dinner');
    });

    it('formats empty messages correctly', () => {
        const message = {
            ip: '1.2.3.4',
            ...baseMessage,
        };

        expect(formatter.format(message)).toBe('');
    });

    it('formats unknown messages correctly', () => {
        const message = {
            foo: 'bar',
            ...baseMessage,
        };

        expect(formatter.format(message)).toBe(
            'Unknown type. Full hash: {"foo":"bar","sender_name":"My Friend","timestamp_ms":1481812402669,"type":"Generic"}',
        );
    });
});
