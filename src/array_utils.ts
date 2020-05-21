import { AssertionError } from "assert";

// I can't believe JS doesn't have this built-in
export const arraysMatch = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let index = 0; index < arr1.length; index++) {
    if (arr1[index] !== arr2[index]) {
      return false;
    }
  }

  return true;
};

export const arraysMatchUnordered = (arr1: any[], arr2: any[]): boolean => {
  // sort() mutates the array so we copy it using slice() first
  return arraysMatch(arr1.slice().sort(), arr2.slice().sort());
};

export const splitArray = (arr: any[], segmentLength: number): any[] => {
  let segments = [];
  let index = 0;
  const arrayLength = arr.length;

  // Would returning a promise be better here?
  if (segmentLength < 1 || Math.floor(segmentLength) !== segmentLength) {
    throw new AssertionError({
      message: "segmentLength must be a positive integer.",
    });
  }

  while (index < arrayLength) {
    segments.push(arr.slice(index, index + segmentLength));
    index += segmentLength;
  }

  return segments;
};
