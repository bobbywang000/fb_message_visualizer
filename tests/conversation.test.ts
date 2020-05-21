import { Conversation } from '../src/conversation';
import { MessageContentFormatter } from '../src/message_content_formatter';
import NameUtils from '../src/name_utils';

describe('getInternalRepresentation', () => {
    const jsonString = JSON.stringify({
        participants: [
            {
                name: 'Foo Bar',
            },
            {
                name: 'Baz Qux',
            },
        ],
        messages: [
            {
                sender_name: 'Baz Qux',
                timestamp_ms: 1590563205567,
                type: 'Generic',
                content: 'Aye',
            },
            {
                sender_name: 'Foo Bar',
                timestamp_ms: 1590563103123,
                type: 'Generic',
                content: 'Sup',
            },
        ],
    })
    const nameUtils = new NameUtils('Foo Bar')
    const messageContentFormatter = new MessageContentFormatter('./')

    const conversation = new Conversation(jsonString, nameUtils, messageContentFormatter)

    it('generates the correct internal representation given a JSON string', () => {
        expect(conversation.getInternalRepresentation()).toEqual({
            messages: [
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
            ],
            participantsDigest: 'af27f12b8',
        })
    })
})
