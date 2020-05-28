import NameUtils from '../src/name_utils';

describe('abbreviateFullName', () => {
    const nameUtils = new NameUtils('First Last');

    it('abbreviates correctly given a first and last name', () => {
        expect(nameUtils.format('My Friend')).toBe('My F');
    });

    it('abbreviates correctly if there are middle names', () => {
        expect(nameUtils.format('My Closest Friend')).toBe('My C F');
    });

    it('does not abbreviate if only a first name is given', () => {
        expect(nameUtils.format('Foo')).toBe('Foo');
    });

    it('does not abbreviate if an empty string is given', () => {
        expect(nameUtils.format('')).toBe('');
    });

    it('returns an alias if the real name is my name', () => {
        expect(nameUtils.format('First Last')).toBe('Me');
    });
});
