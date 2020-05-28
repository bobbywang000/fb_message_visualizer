import { arraysMatch, arraysMatchUnordered, splitArray } from '../src/array_utils';

// TODO: see if Jest supports something like shared_examples in rspec to simplify these tests
describe('arraysMatch', () => {
    it('fails if arrays are of unequal length', () => {
        expect(arraysMatch([], [1])).toBe(false);
    });

    it('fails if arrays contain different elements', () => {
        expect(arraysMatch([2], [1])).toBe(false);
    });

    it('fails if arrays are a permutation of one another', () => {
        expect(arraysMatch([2, 1], [1, 2])).toBe(false);
    });

    it('succeeds if arrays have the exact same elements in the same order', () => {
        expect(arraysMatch([1, 2], [1, 2])).toBe(true);
    });
});

describe('arraysMatchUnordered', () => {
    it('fails if arrays are of unequal length', () => {
        expect(arraysMatchUnordered([], [1])).toBe(false);
    });

    it('fails if arrays contain different elements', () => {
        expect(arraysMatchUnordered([2], [1])).toBe(false);
    });

    it('succeeds if arrays are a permutation of one another', () => {
        expect(arraysMatchUnordered([2, 1], [1, 2])).toBe(true);
    });

    it('succeeds if arrays have the exact same elements in the same order', () => {
        expect(arraysMatchUnordered([1, 2], [1, 2])).toBe(true);
    });
});

describe('splitArray', () => {
    it('splits array into segments no longer than a specified maximum length', () => {
        expect(splitArray([1, 2, 3, 4, 5], 2)).toStrictEqual([[1, 2], [3, 4], [5]]);
    });

    it('succeeds if the maximum length is longer than the array length', () => {
        expect(splitArray([1, 2, 3, 4, 5], 6)).toStrictEqual([[1, 2, 3, 4, 5]]);
    });

    it('errors if the maximum length is less than 1', () => {
        expect(() => splitArray([1, 2, 3, 4, 5], 0)).toThrowError(/segmentLength/);
    });

    it('errors if the maximum length is not an integer', () => {
        expect(() => splitArray([1, 2, 3, 4, 5], 1.2)).toThrowError(/segmentLength/);
    });
});
