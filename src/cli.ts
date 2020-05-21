import { Conversation } from "./conversation";
import { FileGenerator } from "./file_generator";
import { join, relative } from "path";
import { read, glob } from "./file_utils";
import { MessageContentFormatter } from "./message_content_formatter";
import NameUtils from "./name_utils";

const formatConversation = (
  nameUtils: NameUtils,
  formatter: MessageContentFormatter
) => {
  return (currChat) =>
    new Conversation(
      read(currChat),
      nameUtils,
      formatter
    ).getInternalRepresentation();
};

const mergeConversations = (acc, conversation) => {
  return {
    messages: acc.messages.concat(conversation.messages),
    participantsHash: acc.participantsHash.concat(
      conversation.participantsDigest
    ),
  };
};

export interface cliOptions {
  ownName: string;
  fbJsonPath: string;
  backupJsonPath: string;
  autogenCssPath: string;
  baseCssPath: string;
  outputFolder: string;
  writeBackupJson: boolean;
}

// TODO: figure out if this is idiomatic or if Typescript programmers
// prefer some flavor of "named parameters"
// TODO: add tests for this method
export const run = (opts: cliOptions): void => {
  const nameUtils = new NameUtils(opts.ownName);
  const formatter = new MessageContentFormatter(relative(opts.outputFolder, opts.fbJsonPath));

  const conversations = glob(join(opts.fbJsonPath, "messages/**/*.json")).map(
    formatConversation(nameUtils, formatter)
  );

  const { messages, participantsHash } = conversations.reduce(
    mergeConversations,
    {
      messages: [],
      participantsHash: [],
    }
  );

  messages.sort((e1, e2) => e1.epochMs - e2.epochMs);

  const fileGenerator = new FileGenerator(
    messages,
    participantsHash,
    opts.backupJsonPath,
    opts.autogenCssPath,
    relative(opts.outputFolder, opts.baseCssPath),
    opts.outputFolder
  );

  if (opts.writeBackupJson) {
    fileGenerator.writeBackupJson();
  }
  fileGenerator.writeCss();
  fileGenerator.writeAllHtmlSegments();
};
