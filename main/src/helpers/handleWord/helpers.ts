import { PackInfo } from "../../types";

export const setCursorColor = (containerCurrent: HTMLSpanElement, defaultCursorColor: string, pack: PackInfo) => {
  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];
  const currentBlock = textBlocks[pack.blockPointer];

  /**
   *  We can only set cursor color when this is a WordBlock, non-empty, and has cursorColor
   */
  if (currentBlock.type === "word" && currentBlock.text !== "" && currentBlock.cursorColor) {
    const { cursorColor } = currentBlock;
    if (cursorColor === "") {
      containerCurrent.style.setProperty("--cursor-color", defaultCursorColor);
    } else {
      containerCurrent.style.setProperty("--cursor-color", cursorColor);
    }
  } else {
    /**
     *  Else: We just use default cursor color
     */
    containerCurrent.style.setProperty("--cursor-color", defaultCursorColor);
  }
};

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
