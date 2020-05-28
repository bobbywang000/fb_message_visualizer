import { FileGenerator } from '../src/file_generator';
import { write } from '../src/file_utils';
import { stripIndent } from 'common-tags';

const messages = [
    {
        sender: 'Me',
        isFromSelf: true,
        datetime: 'Wed, May 27, 2020, 12:05 AM',
        epochMs: 1590563103123,
        participants: ['Baz Qux', 'Foo Bar'],
        participantsDigest: 'af27f12b8',
        content: 'Sup',
    },
    {
        sender: 'Baz Q',
        isFromSelf: false,
        datetime: 'Wed, May 27, 2020, 12:06 AM',
        epochMs: 1590563205567,
        participants: ['Baz Qux', 'Foo Bar'],
        participantsDigest: 'af27f12b8',
        content: 'Aye',
    },
];
const digests = ['a123abc', 'a456def'];
const backupJsonPath = 'backup.json';
const autogenCssPath = 'autogen.css';
const baseCssPath = 'base.css';
const outputFolder = 'gen';

const fileGenerator = new FileGenerator(messages, digests, backupJsonPath, autogenCssPath, baseCssPath, outputFolder);

const generatedBackupJson = stripIndent`
[
    {
        \"sender\": \"Me\",
        \"isFromSelf\": true,
        \"datetime\": \"Wed, May 27, 2020, 12:05 AM\",
        \"epochMs\": 1590563103123,
        \"participants\": [
            \"Baz Qux\",
            \"Foo Bar\"
        ],
        \"participantsDigest\": \"af27f12b8\",
        \"content\": \"Sup\"
    },
    {
        \"sender\": \"Baz Q\",
        \"isFromSelf\": false,
        \"datetime\": \"Wed, May 27, 2020, 12:06 AM\",
        \"epochMs\": 1590563205567,
        \"participants\": [
            \"Baz Qux\",
            \"Foo Bar\"
        ],
        \"participantsDigest\": \"af27f12b8\",
        \"content\": \"Aye\"
    }
]`;

const generatedCss = stripIndent`
div.a123abc {
background: hsl(263, 90%, 40%);
color: white;
}
div.a456def {
background: hsl(133, 90%, 40%);
color: white;
}
`;

const generatedHtmlSegment = stripIndent`
        <html lang=\"en\">
        <head>
            <meta charset=\"utf-8\">
            <link rel=\"stylesheet\" href=\"base.css\">
            <link rel=\"stylesheet\" href=\"autogen.css\">
        </head>

        <body>
        <h1>Messages</h1>

        <div class=\"af27f12b8 right\" title=\"Groupchat: Baz Qux,Foo Bar\">
            <p><b>Me: </b>Sup</p>
            <p class=\"datetime\">Wed, May 27, 2020, 12:05 AM</p>
        </div>
        <div class=\"af27f12b8 left\" title=\"Groupchat: Baz Qux,Foo Bar\">
            <p><b>Baz Q: </b>Aye</p>
            <p class=\"datetime\">Wed, May 27, 2020, 12:06 AM</p>
        </div>
        </body>
        </html>
`.trim();

// TODO: ask Geng whether this is the idiomatic way to do partial mocks in Jest
jest.mock('../src/file_utils');

describe('writeBackupJson', () => {
    it('writes the expected JSON', () => {
        fileGenerator.writeBackupJson();
        expect(write).toBeCalledWith('gen/backup.json', generatedBackupJson);
    });
});

describe('writeCss', () => {
    it('writes the expected CSS', () => {
        fileGenerator.writeCss();
        expect(write).toBeCalledWith('gen/autogen.css', generatedCss);
    });
});

describe('writeAllHtmlSegments', () => {
    it('writes the expected HTML files', () => {
        fileGenerator.writeAllHtmlSegments();
        expect(write).toBeCalledWith(
            'gen/2020-05-27T07:05:03.123Z_2020-05-27T07:06:45.567Z.html',
            generatedHtmlSegment,
        );
    });
});
