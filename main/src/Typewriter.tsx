import $ from "jquery";
import React from "react";
import withStyles, { WithStylesProps } from "react-jss";
import { insertAt, removeChar } from "./utils";

const styles = () => ({
  container: {
    "--cursor-color": "black",
    borderRight: "0.15em solid var(--cursor-color)",
    transition: "border-right 0.2s"
  },
  blink: {
    animation: "$blink-caret 0.9s step-end infinite"
  },
  // https://github.com/mui/material-ui/issues/13793
  "@keyframes blink-caret": {
    "0%": {
      borderColor: "transparent"
    },
    "50%": {
      borderColor: "var(--cursor-color)"
    }
  }
});

// https://css-tricks.com/snippets/css/typewriter-effect/

type Props = WithStylesProps<typeof styles> & {
  defaultCursorColor: string;
  dataToRotate: string[][][]; // E.g: [["A"], ["BC", span css class without < or >, cursor color]]
  timeBeforeDelete: number;
  typeSpeed?: number;
};

class Typewriter extends React.Component<Props> {
  mContainerRef = React.createRef<HTMLSpanElement>();

  mInternalBlockPointer = 0; // Point at characters of text at index 0 inside a block
  mBlockPointer = 0; // Point at the whole block showing where we are
  mHTMLPointer = 0; // Insert/Delete exactly at this point then move pointer up/down

  mCurrentHTML = "";
  mCurrentDataRotateIndex = 0;
  mIsDeleting = false;

  mTimeoutTick = -1;

  componentDidMount() {
    this.tick();
  }

  componentWillUnmount() {
    this.mInternalBlockPointer = 0;
    this.mBlockPointer = 0;
    this.mHTMLPointer = 0;

    this.mCurrentHTML = "";
    this.mCurrentDataRotateIndex = 0;
    this.mIsDeleting = false;

    window.clearTimeout(this.mTimeoutTick);
  }

  tick() {
    const { current: containerCurrent } = this.mContainerRef;
    const { classes, defaultCursorColor, dataToRotate, timeBeforeDelete, typeSpeed } = this.props;

    if (!containerCurrent) {
      return;
    }

    const rotateDataIndex = this.mCurrentDataRotateIndex % dataToRotate.length;
    const textBlocks = dataToRotate[rotateDataIndex];
    const currentBlock = textBlocks[this.mBlockPointer];

    // Set cursor color
    this.setCursorColor(containerCurrent, currentBlock, defaultCursorColor);

    // Adding
    if (!this.mIsDeleting) {
      this.add(textBlocks, currentBlock);
    }

    // Deleting
    else {
      this.delete(textBlocks, currentBlock);
    }

    containerCurrent.innerHTML = '<span class="wrap">' + this.mCurrentHTML + "</span>";

    // Setting up wait time for typing

    let waitTime = typeSpeed ? typeSpeed - Math.random() * (typeSpeed - 100) : 200 - Math.random() * 100; // Range: 100 -> 200 ms

    // Still deleting
    if (this.mIsDeleting && this.mCurrentHTML !== "") {
      waitTime /= 2;
    }

    // Finish deleting the whole current data
    if (this.mIsDeleting && this.mCurrentHTML === "") {
      this.mInternalBlockPointer = 0; // Point at characters of text at index 0 inside a block
      this.mBlockPointer = 0; // Point at the whole block showing where we are
      this.mHTMLPointer = 0; // Insert/Delete exactly at this point then move pointer up/down

      this.mIsDeleting = false;
      this.mCurrentDataRotateIndex++; // Check out next data

      waitTime = 500;
    }

    // Finish typing the whole current data
    if (
      !this.mIsDeleting &&
      this.mBlockPointer === textBlocks.length - 1 &&
      this.mInternalBlockPointer === currentBlock[0].length
    ) {
      this.mInternalBlockPointer--;
      this.mIsDeleting = true;

      $(containerCurrent).addClass(classes.blink);

      waitTime = timeBeforeDelete;
    }

    this.mTimeoutTick = window.setTimeout(() => {
      $(containerCurrent).removeClass(classes.blink);
      this.tick();
    }, waitTime);
  }

  // Helpers

  setCursorColor = (containerCurrent: HTMLSpanElement, currentBlock: string[], defaultCursorColor: string) => {
    if (currentBlock.length >= 3) {
      const cursorColor = currentBlock[2];

      if (cursorColor === "") {
        containerCurrent.style.setProperty("--cursor-color", defaultCursorColor);
      } else {
        containerCurrent.style.setProperty("--cursor-color", cursorColor);
      }
    } else {
      containerCurrent.style.setProperty("--cursor-color", defaultCursorColor);
    }
  };

  add = (textBlocks: string[][], currentBlock: string[]) => {
    // Check if need span and internal block pointer is pointing at first letter: Add SPAN, move html pointer
    if (currentBlock.length !== 1 && this.mInternalBlockPointer === 0) {
      const cssClass = currentBlock[1];

      // E.g: <span id="id"></span>
      this.mCurrentHTML += `<span class="${cssClass}"></span>`;

      this.mHTMLPointer += `span class="${cssClass}"><`.length;
    }

    const text = currentBlock[0];
    const char = text[this.mInternalBlockPointer];

    this.mCurrentHTML = insertAt(this.mCurrentHTML, char, this.mHTMLPointer);

    this.mInternalBlockPointer++;
    this.mHTMLPointer++;

    // This means we finish adding text inside block: move html pointer out of SPAN (if applicable), move to next block, reset internal block pointer
    if (this.mInternalBlockPointer === text.length) {
      if (currentBlock.length !== 1) {
        this.mHTMLPointer += `/span> `.length;
      }

      // Reset block pointer and internal block pointer if block pointer is not pointing to the last block
      if (this.mBlockPointer < textBlocks.length - 1) {
        this.mBlockPointer++;
        this.mInternalBlockPointer = 0;
      }
    }
  };

  delete = (textBlocks: string[][], currentBlock: string[]) => {
    // Check if current block has span and internal block pointer is pointing at last letter: move html pointer
    if (currentBlock.length !== 1 && this.mInternalBlockPointer === currentBlock[0].length - 1) {
      // Find start of ending span tag
      while (this.mCurrentHTML[this.mHTMLPointer] !== "<") {
        this.mHTMLPointer--;
      }
      this.mHTMLPointer--;
    }

    this.mCurrentHTML = removeChar(this.mCurrentHTML, this.mHTMLPointer);

    this.mInternalBlockPointer--;
    this.mHTMLPointer--;

    // This means we finish deleting text inside block: move html pointer in front of SPAN (if applicable), move to previous block, reset internal block pointer
    if (this.mInternalBlockPointer === -1) {
      if (currentBlock.length !== 1) {
        // Find start of starting span tag
        while (this.mCurrentHTML[this.mHTMLPointer] !== "<") {
          this.mHTMLPointer--;
        }
        this.mHTMLPointer--;

        // Delete the whole span. Keep things previous to that span.
        this.mCurrentHTML = this.mCurrentHTML.substring(0, this.mHTMLPointer + 1);
      }

      // Reset block pointer and internal block pointer if block pointer is not pointing to the first block
      if (this.mBlockPointer > 0) {
        this.mBlockPointer--;
        const newBlock = textBlocks[this.mBlockPointer];
        this.mInternalBlockPointer = newBlock[0].length - 1;
      }
      // If it's first block already and we have deleted it all, move internal block to 0
      else {
        this.mInternalBlockPointer++;
      }
    }
  };

  render() {
    const { classes } = this.props;
    const { mContainerRef } = this;

    return <span ref={mContainerRef} className={classes.container}></span>;
  }
}

export default withStyles(styles)(Typewriter);
