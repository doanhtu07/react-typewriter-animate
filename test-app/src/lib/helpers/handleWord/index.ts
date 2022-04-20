import $ from "jquery";
import { PackInfo, TypewriterClassNames, WordBlock } from "../../types";
import { ComposedTypewriterProps } from "../../Typewriter";
import { deepCopyData } from "../../utils";
import { addChar } from "./addChar";
import { deleteChar } from "./deleteChar";
import { moveToPreviousNonEmptyWordBlock, setCursorColor } from "./helpers";

export const handleWord = (props: ComposedTypewriterProps, pack: PackInfo, moveOn: () => void) => {
  const {
    defaultCursorColor,

    typeVariance,
    maxTypeSpeed,

    deleteVariance,
    maxDeleteSpeed,

    timeBeforeWriteNewRotateData,
    timeBeforeDelete,

    loop
  } = props;

  const { current: containerCurrent } = pack.containerRef;
  const { current: contentCurrent } = pack.contentRef;

  if (!containerCurrent || !contentCurrent) {
    return;
  }

  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];

  // console.log(pack.isDeleting ? "delete" : "add", pack.currentHTML);

  /**
   *  If we are deleting and internal block pointer === -1:
   *  => We have finished removing this block
   *  => Move backward to next non-empty WordBlock
   */
  if (pack.isDeleting && pack.internalBlockPointer === -1) {
    moveToPreviousNonEmptyWordBlock(pack);
  }

  /**
   *  If we are deleting and block pointer === -1: This case happens as a result of moving to previous non-empty WordBlock
   *  => We have traversing all blocks from right to left
   *  => Move to next data in rotation cycle (Remember to reset necessary variables before handling next data)
   */
  if (pack.isDeleting && pack.blockPointer === -1) {
    // Blink
    $(containerCurrent).addClass(TypewriterClassNames.Blink);

    // Reset necessary variables
    pack.internalBlockPointer = 0;
    pack.blockPointer = 0;
    pack.HTMLPointer = 0;

    pack.currentHTML = "";
    pack.isDeleting = false;

    pack.copyDataToRotate = deepCopyData(props.dataToRotate);

    // Check out next data
    pack.currentDataRotateIndex++;

    const waitTime = timeBeforeWriteNewRotateData ?? 500;

    pack.timeoutTick = window.setTimeout(() => {
      // Stop blinking
      $(containerCurrent).removeClass(TypewriterClassNames.Blink);
      moveOn();
    }, waitTime);

    return;
  }

  const oldBlock = textBlocks[pack.blockPointer] as WordBlock;

  /**
   *  If we are deleting and current block is empty and no span class:
   *  => We continue moving backward to next non-empty WordBlock
   */
  if (pack.isDeleting && oldBlock.text === "" && !oldBlock.spanClass) {
    moveToPreviousNonEmptyWordBlock(pack);
  }

  const newBlock = textBlocks[pack.blockPointer] as WordBlock;

  // *** Set cursor color ***
  setCursorColor(containerCurrent, defaultCursorColor, pack);

  // *** Adding ***
  if (!pack.isDeleting) {
    // Note: Since this is when we are not deleting, all moving above is not applicable.

    addChar(pack);

    /**
     *  When we finish adding text from WordBlock / WordBlock is empty:
     *  - Move block pointer forward to check new block
     *  - Set internal block pointer to 0
     */
    if (pack.internalBlockPointer === newBlock.text.length || newBlock.text.length === 0) {
      pack.blockPointer++;
      pack.internalBlockPointer = 0;
    }
  }

  // *** Deleting ***
  else {
    deleteChar(pack);
  }

  // *** Update HTML ***
  contentCurrent.innerHTML = pack.currentHTML;

  let waitTime = 0;

  // *** Calculate wait time during typing ***
  const final_typeVariance = newBlock.override?.typeVariance ?? typeVariance ?? 100;
  const final_maxTypeSpeed = newBlock.override?.maxTypespeed ?? maxTypeSpeed ?? 200;
  waitTime = final_maxTypeSpeed - Math.random() * final_typeVariance;

  // *** Calculate wait time during deleting ***
  if (pack.isDeleting && pack.currentHTML !== "") {
    const final_deleteVariance = newBlock.override?.deleteVariance ?? deleteVariance ?? 50;
    const final_maxDeleteSpeed = newBlock.override?.maxDeleteSpeed ?? maxDeleteSpeed ?? 100;
    waitTime = final_maxDeleteSpeed - Math.random() * final_deleteVariance;
  }

  /**
   *  If we are deleting and HTML is empty: This case can happen as a result of deleteChar function
   *  => We have finished deleting all blocks
   *  => Move to next data in rotation cycle (Remember to reset necessary variables before handling next data)
   */
  if (pack.isDeleting && pack.currentHTML === "") {
    pack.internalBlockPointer = 0;
    pack.blockPointer = 0;
    pack.HTMLPointer = 0;

    pack.currentHTML = "";
    pack.isDeleting = false;

    pack.copyDataToRotate = deepCopyData(props.dataToRotate);

    pack.currentDataRotateIndex++; // Check out next data

    waitTime = timeBeforeWriteNewRotateData ?? 500;
  }

  /**
   *  If we are not deleting (adding) and block pointer is out-of-bound:
   *  => We have finished traversing all blocks from left to right
   *      - Move HTML pointer backward (b/c HTML is pointing to a new blank position while adding)
   *      - Move internal block pointer backward (in case last adding block is a WordBlock)
   *      - Change signal to DELETING
   */
  if (!pack.isDeleting && pack.blockPointer === textBlocks.length) {
    // Blink
    $(containerCurrent).addClass(TypewriterClassNames.Blink);

    // Check loop and if it is last data to rotate
    if (!loop && pack.currentDataRotateIndex === pack.copyDataToRotate.length - 1) {
      return;
    }

    pack.HTMLPointer--;
    pack.internalBlockPointer--;

    pack.isDeleting = true;

    waitTime = timeBeforeDelete ?? 1000;
  }

  pack.timeoutTick = window.setTimeout(() => {
    // Stop blinking
    $(containerCurrent).removeClass(TypewriterClassNames.Blink);
    moveOn();
  }, waitTime);
};
