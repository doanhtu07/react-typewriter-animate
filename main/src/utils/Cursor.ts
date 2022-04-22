import $ from "jquery";
import { DefaultSetting } from "../defaults";
import { PackInfo, TypewriterClassNames } from "../types";
import { ComposedTypewriterProps } from "../Typewriter";

export const setCursorColor = (props: ComposedTypewriterProps, pack: PackInfo) => {
  const { defaultCursorColor } = props;
  const { current: containerCurrent } = pack.containerRef;

  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];
  const currentBlock = textBlocks[pack.blockPointer];

  /**
   *  We can only set cursor color when this is a WordBlock, non-empty, and has cursorColor
   */
  if (currentBlock.type === "word" && currentBlock.text !== "" && currentBlock.cursorColor) {
    const { cursorColor } = currentBlock;
    if (cursorColor === "") {
      containerCurrent?.style.setProperty("--cursor-color", defaultCursorColor ?? DefaultSetting.defaultCursorColor);
    } else {
      containerCurrent?.style.setProperty("--cursor-color", cursorColor);
    }
  } else {
    /**
     *  Else: We just use default cursor color
     */
    containerCurrent?.style.setProperty("--cursor-color", defaultCursorColor ?? DefaultSetting.defaultCursorColor);
  }
};

export const blinkCursor = (props: ComposedTypewriterProps, pack: PackInfo) => {
  const { cursorBlinkRate, timeBeforeBlinkCursor } = props;

  pack.timeoutBlinkCursor = window.setTimeout(() => {
    const { current: containerCurrent } = pack.containerRef;

    if (containerCurrent) {
      blinkCursorHelper(containerCurrent, cursorBlinkRate ?? DefaultSetting.cursorBlinkRate, true);
    }
  }, timeBeforeBlinkCursor ?? DefaultSetting.timeBeforeBlinkCursor);
};

export const unblinkCursor = (props: ComposedTypewriterProps, pack: PackInfo) => {
  const { cursorBlinkRate, timeBeforeBlinkCursor } = props;
  const { current: containerCurrent } = pack.containerRef;

  if (!containerCurrent) {
    return;
  }

  // Clear blinking cursor
  if (pack.timeoutBlinkCursor !== -1) {
    blinkCursorHelper(containerCurrent, cursorBlinkRate ?? DefaultSetting.cursorBlinkRate, false);
    window.clearTimeout(pack.timeoutBlinkCursor);

    // Blink when timeout. This can terminate due to handleAction or handleWord.
    pack.timeoutBlinkCursor = window.setTimeout(() => {
      if (containerCurrent) {
        blinkCursorHelper(containerCurrent, cursorBlinkRate ?? DefaultSetting.cursorBlinkRate, true);
      }
    }, timeBeforeBlinkCursor ?? DefaultSetting.timeBeforeBlinkCursor);
  }
};

const blinkCursorHelper = (containerCurrent: HTMLSpanElement, blinkRate: string, blink: boolean) => {
  if (blink) {
    containerCurrent.style.setProperty("--cursor-blink-rate", blinkRate);
    $(containerCurrent).addClass(TypewriterClassNames.Blink);
  } else {
    $(containerCurrent).removeClass(TypewriterClassNames.Blink);
  }
};
