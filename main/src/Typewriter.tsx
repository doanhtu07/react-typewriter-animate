import clsx from "clsx";
import React from "react";
import { handleAction } from "./helpers/handleAction";
import { resetPack } from "./helpers/handleLifeCycle";
import { handleWord } from "./helpers/handleWord";
import { PackInfo, TypewriterClassNames, TypewriterProps } from "./types";
import { deepCopyData } from "./utils";

export type ComposedTypewriterProps = TypewriterProps;

// https://css-tricks.com/snippets/css/typewriter-effect/

class Typewriter extends React.Component<ComposedTypewriterProps> {
  mPack: PackInfo = {
    containerRef: React.createRef<HTMLSpanElement>(),
    contentRef: React.createRef<HTMLSpanElement>(),

    // Since we want to support deleting, we must have a copy data and perform delete on it. We will restore original data after rotate through all data.
    copyDataToRotate: deepCopyData(this.props.dataToRotate),

    internalBlockPointer: 0, // Point at characters of text at index 0 inside a block
    blockPointer: 0, // Point at the whole block showing where we are
    HTMLPointer: 0, // Insert/Delete exactly at this point then move pointer up/down

    currentHTML: "",
    currentDataRotateIndex: 0,
    isDeleting: false,

    deleteCache: {
      original_internalBlockPointer: -1,
      original_blockPointer: -1
    },

    timeoutTick: -1 // Remain the same even after reseting
  };

  componentDidMount() {
    this.tick();
  }

  componentWillUnmount() {
    resetPack(this.mPack);
    window.clearTimeout(this.mPack.timeoutTick);
  }

  tick() {
    const rotateDataIndex = this.mPack.currentDataRotateIndex % this.mPack.copyDataToRotate.length;
    const textBlocks = this.mPack.copyDataToRotate[rotateDataIndex];

    let currentBlock = textBlocks[this.mPack.blockPointer];

    // *** Handle action ***
    if (currentBlock && currentBlock.type === "action") {
      /**
       * If deleting (i.e: Currently traversing blocks from right to left):
       * - Don't even care about actions
       * - Move to previous block
       *    - Case 1: If previous block is WordBlock => Don't forget to set internal block pointer
       *    - Case 2: If block pointer is now out of bound => This means we have finished deleting everything => Move to next data array
       * - Call tick again to handle this new block
       */
      if (this.mPack.isDeleting) {
        this.mPack.blockPointer--;

        // Case 1
        currentBlock = textBlocks[this.mPack.blockPointer];
        if (currentBlock.type === "word") {
          this.mPack.internalBlockPointer = currentBlock.text.length - 1;
        }

        // Case 2
        if (this.mPack.blockPointer === -1) {
          this.mPack.currentDataRotateIndex++;
        }

        this.tick();
        return;
      }

      handleAction(this.props, this.mPack, () => this.tick());
    }

    // *** Handle word / out-of-bound block ***
    else {
      handleWord(this.props, this.mPack, () => this.tick());
    }
  }

  render() {
    const { containerClass, contentClass } = this.props;
    const { containerRef, contentRef } = this.mPack;

    return (
      <span ref={containerRef} className={clsx(TypewriterClassNames.Container, containerClass)}>
        <span ref={contentRef} className={clsx(TypewriterClassNames.Content, contentClass)}></span>
      </span>
    );
  }
}

export default Typewriter;
