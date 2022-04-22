import { PackInfo } from "../types";

export const moveToPreviousNonEmptyWordBlock = (pack: PackInfo) => {
  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];

  /**
   *  Since this function's task is searching "previous" block
   *  => Start off by moving block pointer backward
   */
  pack.blockPointer--;

  /**
   *  While block is an ActionBlock / WordBlock but with empty text:
   *  => Move block pointer backward
   */
  let block = textBlocks[pack.blockPointer];
  while (pack.blockPointer >= 0 && (block.type !== "word" || (block.type === "word" && block.text === ""))) {
    pack.blockPointer--;
    block = textBlocks[pack.blockPointer];
  }

  /**
   *  If block pointer is -1
   *  => We don't have any previous non-empty WordBlock
   */
  if (pack.blockPointer === -1) {
    return;
  }

  /**
   *  Now we know our new "current" block is WordBlock.
   *  Set internal block pointer to last character of this WordBlock.
   */
  const currentBlock = textBlocks[pack.blockPointer];
  if (currentBlock.type === "word") {
    pack.internalBlockPointer = currentBlock.text.length - 1;
  }
};

export const isLastWordBlock = (pack: PackInfo) => {
  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];

  let pointer = pack.blockPointer;

  if (textBlocks[pointer].type !== "word") {
    return false;
  }

  pointer++;

  while (pointer < textBlocks.length && textBlocks[pointer].type !== "word") {
    pointer++;
  }

  if (pointer < textBlocks.length) {
    return false;
  } else {
    return true;
  }
};
