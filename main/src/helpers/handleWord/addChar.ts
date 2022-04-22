import { PackInfo, WordBlock } from "../../types";
import { ComposedTypewriterProps } from "../../Typewriter";
import { unblinkCursor } from "../../utils/Cursor";
import { insertAt } from "../../utils/String";

export const addChar = (props: ComposedTypewriterProps, pack: PackInfo) => {
  unblinkCursor(props, pack);

  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];
  const currentBlock = textBlocks[pack.blockPointer] as WordBlock;

  /**
   *  If current block is a span and internal block pointer points to first character:
   *  => Meaning we have just started adding this block
   *  => Add a new span to HTML
   *  => Move HTML pointer inside span
   */
  if (currentBlock.spanClass && pack.internalBlockPointer === 0) {
    const { spanClass } = currentBlock;

    // E.g: <span id="id"></span>
    pack.currentHTML += `<span class="${spanClass}"></span>`;

    pack.HTMLPointer = pack.currentHTML.length - "</span>".length;
  }

  const { text } = currentBlock;
  const char = text[pack.internalBlockPointer];

  // console.log("Adding a char", pack.currentHTML, pack.currentHTML[pack.HTMLPointer]);

  /**
   *  - Insert new character in HTML
   *  - Move HTML pointer forward
   *  - Move internal block pointer forward
   */
  pack.currentHTML = insertAt(pack.currentHTML, char, pack.HTMLPointer);
  pack.HTMLPointer++;
  pack.internalBlockPointer++;

  /**
   *  When we finish adding text from WordBlock / WordBlock is empty:
   *  - If current block is a span
   *      => Move HTML pointer outside span
   */
  if (pack.internalBlockPointer === text.length || text.length === 0) {
    if (currentBlock.spanClass) {
      pack.HTMLPointer += `/span> `.length;
    }
  }
};
