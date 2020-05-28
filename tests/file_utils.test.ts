import { read, write, glob } from '../src/file_utils';
import * as fs from 'fs';
import * as globModule from 'glob';

const filename = 'foo.abc';
const contents = 'foo bar';

jest.mock('fs');
const fsModule = fs as jest.Mocked<typeof fs>;

describe('read', () => {
    fsModule.readFileSync.mockReturnValue(contents);

    it('reads the given file', () => {
        expect(read(filename)).toBe(contents);
    });
});

describe('write', () => {
    it('writes to the given file', () => {
        write(filename, contents);
        expect(fsModule.writeFileSync).toHaveBeenCalledWith(filename, contents);
    });
});

jest.mock('glob');
describe('glob', () => {
    const matchingFiles = ['./foo/a.json', './foo/bar/b.json'];
    globModule.sync.mockReturnValue(matchingFiles);

    it('returns the matching paths', () => {
        expect(glob('./**/*.json')).toBe(matchingFiles);
    });
});
