import { read, write, glob } from '../src/file_utils';

const fs = require('fs')
jest.mock('fs')
const filename = 'foo.abc'
const contents = 'foo bar'

describe('read', () => {
    fs.readFileSync.mockReturnValue(contents)

    it('reads the given file', () => {
        expect(read(filename)).toBe(contents)
    })
})

describe('write', () => {
    it('writes to the given file', () => {
        write(filename, contents)
        expect(fs.writeFileSync).toHaveBeenCalledWith(filename, contents)
    })
})

const globModule = require('glob')
jest.mock('glob')

describe('glob', () => {
    const matchingFiles = ['./foo/a.json', './foo/bar/b.json']
    globModule.sync.mockReturnValue(matchingFiles)

    it('returns the matching paths', () => {
        expect(glob('./**/*.json')).toBe(matchingFiles)
    })
})
