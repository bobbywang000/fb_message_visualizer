import { transformTimestampToDateTimeString } from "./date_utils";
import { MessageContentFormatter, html } from "./message_content_formatter";
import NameUtils from "./name_utils";
import * as crypto from "crypto";

export interface Message {
  sender: string;
  isFromSelf: boolean;
  datetime: string;
  epochMs: number;
  participants: string[];
  participantsDigest: string;
  content: html;
}

export class Conversation {
  // TODO: add interface here for type of `messages`
  readonly messages: any[];
  readonly messageContentFormatter: MessageContentFormatter;
  readonly nameUtils: NameUtils;
  readonly participants: string[];
  readonly participantsDigest: string;

  constructor(
    jsonString: string,
    nameUtils: NameUtils,
    messageContentFormatter: MessageContentFormatter
  ) {
    const json = JSON.parse(jsonString);

    this.messages = json.messages.slice().reverse();
    this.participants = json.participants.map(
      (participantHash) => participantHash.name
    );
    this.participantsDigest = this.generateParticipantsDigest(
      this.participants
    );
    this.nameUtils = nameUtils;
    this.messageContentFormatter = messageContentFormatter;
  }

  getInternalRepresentation(): {
    messages: Message[];
    participantsDigest: string;
  } {
    return {
      messages: this.messages.map((message) => {
        return {
          sender: this.nameUtils.format(message.sender_name),
          isFromSelf: this.nameUtils.isOwnName(message.sender_name),
          datetime: transformTimestampToDateTimeString(message.timestamp_ms),
          epochMs: message.timestamp_ms,
          participants: this.participants,
          participantsDigest: this.participantsDigest,
          content: this.messageContentFormatter.format(message),
        };
      }),
      participantsDigest: this.participantsDigest,
    };
  }

  private generateParticipantsDigest(participants: string[]): string {
    const rawHash = crypto
      .createHash("md5")
      .update(participants.sort().toString())
      .digest("hex");
    // css selectors can't start with a digit so we prepend an A here,
    // and we don't need all 16^32 bits so we just take the least significant 4 bytes.
    return "a" + rawHash.slice(rawHash.length - 8);
  }
}
