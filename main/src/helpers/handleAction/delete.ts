import { DefaultSetting } from "../../defaults";
import { PackInfo, WordBlock } from "../../types";
import { ComposedTypewriterProps } from "../../Typewriter";
import { setCursorColor } from "../../utils/Cursor";
import { moveToPreviousNonEmptyWordBlock } from "../../utils/WordBlock";
import { deleteChar } from "../handleWord/deleteChar";

// --------- Handle Delete --------

export const handleDelete = (props: ComposedTypewriterProps, pack: PackInfo, moveOn: () => void, amount: number) => {
  const { deleteVariance, maxDeleteSpeed } = props;

  const { current: containerCurrent } = pack.containerRef;
  const { current: contentCurrent } = pack.contentRef;

  if (!containerCurrent || !contentCurrent) {
    return;
  }

  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];

  // 2 base cases

  /**
   *  Base case 1:
   *  - If amount <= 0 => Finish delete action & Move on.
   *  - Why not === only? We account in invalid inputs, too (e.g: input amount = -1)
   */
  if (amount <= 0) {
    prepareToMoveOn(pack);
    moveOn();
    return;
  }

  const oldBlock = textBlocks[pack.blockPointer];

  /**
   *  3 cases:
   *    1. Current block is an action: Meaning there are nothing to delete
   *    2. Internal block pointer is out of bound: Happens when we finish deleting a WordBlock
   *    3. Text is empty:
   *        - Happens when we revisit a deleted WordBlock / The block itself is empty from beginning
   *        => Either way, we don't care. We only care about blocks with letter to delete
   */
  if (oldBlock.type !== "word" || pack.internalBlockPointer === -1 || oldBlock.text === "") {
    moveToPreviousNonEmptyWordBlock(pack);
  }

  /**
   *  Base case 2:
   *  - If we already traversed all blocks from right to left
   */
  if (pack.blockPointer === -1) {
    prepareToMoveOn(pack);
    moveOn();
    return;
  }

  /**
   *  This takes in account the 3 cases changing our "current" block.
   */
  const newBlock = textBlocks[pack.blockPointer] as WordBlock;

  // *** Set cursor color ***
  setCursorColor(props, pack);

  // *** Delete ***
  deleteChar(props, pack);

  /**
   *  After deleting 1 character in HTML, we want to delete that 1 character in WordBlock to keep record for later ActionBlock's.
   */
  newBlock.text = newBlock.text.substring(0, newBlock.text.length - 1);

  // *** Update HTML ***
  contentCurrent.innerHTML = pack.currentHTML;

  let waitTime = 0;

  const final_deleteVariance = newBlock.override?.deleteVariance ?? deleteVariance ?? DefaultSetting.deleteVariance;
  const final_maxDeleteSpeed = newBlock.override?.maxDeleteSpeed ?? maxDeleteSpeed ?? DefaultSetting.maxDeleteSpeed;
  waitTime = final_maxDeleteSpeed - Math.random() * final_deleteVariance;

  /**
   *  Call handleDelete again with (amount - 1)
   */
  pack.timeoutTick = window.setTimeout(() => {
    handleDelete(props, pack, moveOn, amount - 1);
  }, waitTime);
};

// --------- Helpers ---------

const prepareToMoveOn = (pack: PackInfo) => {
  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];

  /**
   *  We move HTML pointer forward so that later ADDING would add in new position.
   */
  pack.HTMLPointer++;

  /**
   *  If current block is a span and we have not deleted everything inside this span
   *  => Move HTML pointer outside </span> so that ADDING would add in new position
   */
  const currentBlock = textBlocks[pack.blockPointer] as WordBlock;
  if (pack.blockPointer !== -1 && currentBlock.spanClass && currentBlock.text !== "") {
    pack.HTMLPointer += `/span> `.length;
  }

  /**
   *  Restore original pointers
   */
  pack.internalBlockPointer = pack.deleteCache.original_internalBlockPointer;
  pack.blockPointer = pack.deleteCache.original_blockPointer;

  /**
   *  If current action is the last block
   *  =>  - Switch to delete mode
   *      - Move HTML pointer back for deleting (b/c from above, HTML pointer is pointing to a new blank position)
   */
  if (pack.blockPointer === textBlocks.length - 1) {
    pack.isDeleting = true;
    pack.HTMLPointer--;
  } else {
    /**
     *  Else:
     *  - Move block pointer forward to check next block
     *  - Set internal block pointer to 0 (in case next block is a WordBlock)
     */
    pack.blockPointer++;
    pack.internalBlockPointer = 0;
  }
};
