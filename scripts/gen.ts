import { run } from '../src/cli';
import buildOptions from 'minimist-options';
import * as minimist from 'minimist';

const options = buildOptions({
    ownName: {
        type: 'string',
        alias: 'name',
    },
    fbJsonPath: {
        type: 'string',
        alias: 'fb',
    },
    outputFolder: {
        type: 'string',
        alias: 'out',
    },
    backupJsonPath: {
        type: 'string',
        alias: 'backup',
        default: 'backup.json',
    },
    autogenCssPath: {
        type: 'string',
        alias: 'auto',
        default: 'autogen.css',
    },
    baseCssPath: {
        type: 'string',
        alias: 'base',
        default: 'base.css',
    },
    writeBackupJson: {
        type: 'boolean',
        alias: 'backup',
        default: false,
    },
});

run(minimist(process.argv.slice(2), options));
