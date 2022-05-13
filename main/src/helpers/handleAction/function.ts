import { DefaultSetting } from "../../defaults";
import { PackInfo } from "../../types";
import { ComposedTypewriterProps } from "../../Typewriter";

// --------- Handle Function --------

export const handleFunction = (
  props: ComposedTypewriterProps,
  pack: PackInfo,
  moveOn: () => void,
  func: () => void
) => {
  const { timeBeforeDelete } = props;
  const { current: contentCurrent } = pack.contentRef;

  if (!contentCurrent) {
    return;
  }

  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];

  func();

  if (pack.blockPointer === textBlocks.length - 1) {
    // If current action is the last block, set wait time to timeBeforeDelete
    pack.isDeleting = true;

    const waitTime = timeBeforeDelete ?? DefaultSetting.timeBeforeDelete;

    pack.timeoutTick = window.setTimeout(() => {
      moveOn();
    }, waitTime);
  } else {
    // Else, move on as usual
    moveOn();
  }
};
