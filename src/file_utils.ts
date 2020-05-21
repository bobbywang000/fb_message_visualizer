import { readFileSync, writeFileSync } from "fs";
import { sync } from "glob";

export const read = (filename: string): string => {
  return readFileSync(filename).toString();
};

export const write = (filename: string, contents: string): void => {
  writeFileSync(filename, contents);
};

export const glob = (pattern: string): string[] => {
  return sync(pattern);
};
