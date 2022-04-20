import $ from "jquery";
import { ActionBlock, PackInfo, TypewriterClassNames } from "../../types";
import { ComposedTypewriterProps } from "../../Typewriter";
import { handleDelete } from "./delete";

export const handleAction = (props: ComposedTypewriterProps, pack: PackInfo, moveOn: () => void) => {
  const { current: containerCurrent } = pack.containerRef;

  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];
  const currentBlock = textBlocks[pack.blockPointer] as ActionBlock;

  switch (currentBlock.action) {
    case "delete":
      /**
       *  Store these two pointers since we will use these pointers in handleDelete function.
       *  After handleDelete finishes, we will restore these pointers.
       *  Like in MIPS stack.
       */
      pack.deleteCache.original_internalBlockPointer = pack.internalBlockPointer;
      pack.deleteCache.original_blockPointer = pack.blockPointer;

      // Blink sometimes before executing deletion
      if (containerCurrent) {
        $(containerCurrent).addClass(TypewriterClassNames.Blink);
      }

      pack.timeoutTick = window.setTimeout(() => {
        // Stop blinking
        if (containerCurrent) {
          $(containerCurrent).removeClass(TypewriterClassNames.Blink);
        }

        handleDelete(props, pack, moveOn, currentBlock.amount);
      }, currentBlock.wait ?? 1000);
  }
};
