import { transformTimestampToDateTimeString, transformTimestampToIsoString } from '../src/date_utils';


// TODO: see if Jest supports something like Rspec's `shared_examples` to simplify these tests
describe('transformTimestampToDateTimeString', () => {
    it('formats a given timestamp correctly', () => {
        expect(transformTimestampToDateTimeString(1445304338281)).toBe('Mon, Oct 19, 2015, 06:25 PM')
    })
})

describe('transformTimestampToIsoString', () => {
    it('formats a given timestamp correctly', () => {
        expect(transformTimestampToIsoString(1445304338281)).toBe('2015-10-20T01:25:38.281Z')
    })
})
