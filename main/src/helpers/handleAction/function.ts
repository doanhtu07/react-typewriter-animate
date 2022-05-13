import { PackInfo } from "../../types";

// --------- Handle Function --------

export const handleFunction = (pack: PackInfo, moveOn: () => void, func: () => void) => {
  const { current: containerCurrent } = pack.containerRef;
  const { current: contentCurrent } = pack.contentRef;

  if (!containerCurrent || !contentCurrent) {
    return;
  }

  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];

  func();

  if (pack.blockPointer === textBlocks.length - 1) {
    pack.isDeleting = true;
  }

  moveOn();
};
