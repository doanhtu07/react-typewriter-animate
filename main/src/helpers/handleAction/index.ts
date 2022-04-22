import { DefaultSetting } from "../../defaults";
import { ActionBlock, PackInfo } from "../../types";
import { ComposedTypewriterProps } from "../../Typewriter";
import { handleDelete } from "./delete";

export const handleAction = (props: ComposedTypewriterProps, pack: PackInfo, moveOn: () => void) => {
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

      pack.timeoutTick = window.setTimeout(() => {
        handleDelete(props, pack, moveOn, currentBlock.amount);
      }, currentBlock.wait ?? DefaultSetting.ActionBlock.delete.wait);
  }
};
