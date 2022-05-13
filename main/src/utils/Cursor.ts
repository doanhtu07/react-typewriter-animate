import $ from "jquery";
import { DefaultSetting } from "../defaults";
import { PackInfo, TypewriterClassNames } from "../types";
import { ComposedTypewriterProps } from "../Typewriter";

export const setCursorClass = (props: ComposedTypewriterProps, pack: PackInfo) => {
  const { cursor } = props;

  const { current: cursorCurrent } = pack.cursorRef;

  const rotateDataIndex = pack.currentDataRotateIndex % pack.copyDataToRotate.length;
  const textBlocks = pack.copyDataToRotate[rotateDataIndex];
  const currentBlock = textBlocks[pack.blockPointer];

  if (!cursorCurrent) {
    return;
  }

  /**
   *  We only care when current block is WordBlock and non-empty
   */
  if (currentBlock.type === "word" && currentBlock.text !== "") {
    /**
     *  Update cursor character if applicable
     */
    if (currentBlock.cursor?.char) {
      cursorCurrent.textContent = currentBlock.cursor.char;
    } else {
      cursorCurrent.textContent = cursor?.char ?? DefaultSetting.cursor.char;
    }

    /**
     *  We remove cursor style completely when encountering a block that does not have cursorClass.
     */
    if (!currentBlock.cursor?.cursorClass) {
      $(cursorCurrent).removeClass(pack.cursorCache.prevCursorClass);
      pack.cursorCache.prevCursorClass = "";
    }

    /**
     *  We set cursor style when current block has cursorClass but has not applied to cursor current
     */
    if (currentBlock.cursor?.cursorClass && !$(cursorCurrent).hasClass(currentBlock.cursor.cursorClass)) {
      $(cursorCurrent).removeClass(pack.cursorCache.prevCursorClass);
      pack.cursorCache.prevCursorClass = currentBlock.cursor.cursorClass;
      $(cursorCurrent).addClass(currentBlock.cursor.cursorClass);
    }
  }
};

export const blinkCursor = (props: ComposedTypewriterProps, pack: PackInfo) => {
  const cursorBlinkRate = props.cursor?.cursorBlinkRate;
  const timeBeforeBlinkCursor = props.cursor?.timeBeforeBlinkCursor;

  pack.timeoutBlinkCursor = window.setTimeout(() => {
    const { current: cursorCurrent } = pack.cursorRef;

    if (cursorCurrent) {
      blinkCursorHelper(cursorCurrent, cursorBlinkRate ?? DefaultSetting.cursor.cursorBlinkRate, true);
    }
  }, timeBeforeBlinkCursor ?? DefaultSetting.cursor.timeBeforeBlinkCursor);
};

export const unblinkCursor = (props: ComposedTypewriterProps, pack: PackInfo) => {
  const cursorBlinkRate = props.cursor?.cursorBlinkRate;
  const timeBeforeBlinkCursor = props.cursor?.timeBeforeBlinkCursor;

  const { current: cursorCurrent } = pack.cursorRef;

  if (!cursorCurrent) {
    return;
  }

  // Clear blinking cursor
  if (pack.timeoutBlinkCursor !== -1) {
    blinkCursorHelper(cursorCurrent, cursorBlinkRate ?? DefaultSetting.cursor.cursorBlinkRate, false);
    window.clearTimeout(pack.timeoutBlinkCursor);

    // Blink when timeout. This can terminate due to handleAction or handleWord.
    pack.timeoutBlinkCursor = window.setTimeout(() => {
      if (cursorCurrent) {
        blinkCursorHelper(cursorCurrent, cursorBlinkRate ?? DefaultSetting.cursor.cursorBlinkRate, true);
      }
    }, timeBeforeBlinkCursor ?? DefaultSetting.cursor.timeBeforeBlinkCursor);
  }
};

const blinkCursorHelper = (cursorCurrent: HTMLSpanElement, blinkRate: string, blink: boolean) => {
  if (blink) {
    cursorCurrent.style.setProperty("--cursor-blink-rate", blinkRate);
    $(cursorCurrent).addClass(TypewriterClassNames.Blink);
  } else {
    $(cursorCurrent).removeClass(TypewriterClassNames.Blink);
  }
};
