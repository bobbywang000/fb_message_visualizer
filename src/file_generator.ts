import { stripIndent } from 'common-tags';
import { join } from 'path';
import { splitArray } from './array_utils';
import { transformTimestampToIsoString } from './date_utils';
import { write } from './file_utils';
import { Message } from './conversation';
import { html } from './message_content_formatter';

// TODO: generate digests from messages array instead of passing in
// TODO: read settings from a config file rather than being super opinionated on how this should look.
export class FileGenerator {
    private readonly MAX_MESSAGES_PER_SEGMENT = 5000;

    readonly autogenCssPath: string;
    readonly baseCssPath: string;
    readonly backupJsonPath: string;
    readonly digests: string[];
    readonly messages: Message[];
    readonly outputFolder: string;

    // TODO: look into named/keyword arguments for typescript
    constructor(
        messages: Message[],
        digests: string[],
        backupJsonPath: string,
        autogenCssPath: string,
        baseCssPath: string,
        outputFolder: string,
    ) {
        this.autogenCssPath = autogenCssPath;
        this.backupJsonPath = backupJsonPath;
        this.digests = digests;
        this.messages = messages;
        this.baseCssPath = baseCssPath;
        this.outputFolder = outputFolder;
    }

    writeBackupJson(): void {
        write(join(this.outputFolder, this.backupJsonPath), this.generateBackupJson());
    }

    writeCss(): void {
        write(join(this.outputFolder, this.autogenCssPath), this.generateCss());
    }

    writeAllHtmlSegments(): void {
        splitArray(this.messages, this.MAX_MESSAGES_PER_SEGMENT).forEach((segment) => {
            write(this.htmlFilename(segment), this.generateHtmlSegment(this.generateMessageDivs(segment)));
        });
    }

    private generateBackupJson(): string {
        return JSON.stringify(this.messages, null, 4);
    }

    private generateCss(): string {
        return this.digests
            .map((digest) => {
                return `
div.${digest} {
${this.generateDivProperties(digest)}
}
            `.trim();
            })
            .join('\n');
    }

    private generateDivProperties(digest): string {
        const hue = parseInt(digest, 16) % 359;
        const saturation = '90%';

        let lightness;
        let textColor;
        if (hue % 2 == 0) {
            lightness = '80%';
            textColor = 'black';
        } else {
            lightness = '40%';
            textColor = 'white';
        }
        return stripIndent`
      background: hsl(${hue}, ${saturation}, ${lightness});
      color: ${textColor};
    `.trim();
    }

    private generateHtmlSegment(messageDivs: string[]): html {
        // We don't want to indent here because otherwise the
        // indentation of the messageDivs will be off.
        return `
<html lang="en">
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="${this.baseCssPath}">
    <link rel="stylesheet" href="${this.autogenCssPath}">
</head>

<body>
<h1>Messages</h1>

${messageDivs.join('\n')}
</body>
</html>
        `.trim();
    }

    private htmlFilename(segment): string {
        const first = segment[0];
        const last = segment[segment.length - 1];

        return join(
            this.outputFolder,
            `${transformTimestampToIsoString(first.epochMs)}_${transformTimestampToIsoString(last.epochMs)}.html`,
        );
    }

    private generateMessageDivs(messages: Message[]): html[] {
        return messages.map((message) => {
            const justification = message.isFromSelf ? 'right' : 'left';
            const divClass = [message.participantsDigest, justification].join(' ');
            return stripIndent`
                <div class="${divClass}" title="Groupchat: ${message.participants}">
                    <p><b>${message.sender}: </b>${message.content}</p>
                    <p class="datetime">${message.datetime}</p>
                </div>
            `.trim();
        });
    }
}
