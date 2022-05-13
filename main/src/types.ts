import React from "react";

export type WordBlock = {
  type: "word";
  text: string;
  spanClass?: string;
  cursorColor?: string;
  override?: {
    maxTypespeed?: number;
    typeVariance?: number;

    maxDeleteSpeed?: number;
    deleteVariance?: number;
  };
};

export type ActionBlock = {
  type: "action";
} & Action;

type Action =
  | {
      action: "delete";
      amount: number;
      wait?: number; // Default wait time before delete is 1000ms
    }
  | {
      action: "function";
      func: () => void;
      wait?: number; // Default wait time before doing function is 0ms
    };

export type PackInfo = {
  containerRef: React.RefObject<HTMLSpanElement>;
  contentRef: React.RefObject<HTMLSpanElement>;

  copyDataToRotate: (WordBlock | ActionBlock)[][];

  internalBlockPointer: number;
  blockPointer: number;
  HTMLPointer: number;

  currentHTML: string;
  currentDataRotateIndex: number;
  isDeleting: boolean;

  timeoutTick: number;

  deleteCache: {
    original_internalBlockPointer: number;
    original_blockPointer: number;
  };

  timeoutBlinkCursor: number;
};

export type TypewriterProps = {
  dataToRotate: (WordBlock | ActionBlock)[][];

  defaultCursorColor?: string; // Default "black"
  cursorBlinkRate?: string; // Default "900ms"
  timeBeforeBlinkCursor?: number; // Default 500ms

  timeBeforeDelete?: number; // Default 1000ms
  timeBeforeWriteNewRotateData?: number; // Default 500ms

  maxTypeSpeed?: number; // Default 200ms.
  typeVariance?: number; // Default 100ms. Range = [maxTypespeed - variance, maxTypespeed]

  maxDeleteSpeed?: number; // Default 100ms
  deleteVariance?: number; // Default 50ms

  start?: boolean; // Default true
  loop?: boolean; // Default false

  containerClass?: string;
  contentClass?: string;
};

export enum TypewriterClassNames {
  Container = "Typewriter-container",
  Content = "Typewriter-content",
  Blink = "Typewriter-blink",
  Blink_Caret = "Typewriter-blink-caret"
}
