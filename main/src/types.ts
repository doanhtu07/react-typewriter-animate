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
} & {
  action: "delete";
  amount: number;
  wait?: number; // Default wait time before delete is 1000ms
};

export type PackInfo = {
  containerRef: React.RefObject<HTMLSpanElement>;

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
};

export type TypewriterProps = {
  dataToRotate: (WordBlock | ActionBlock)[][];

  defaultCursorColor: string;

  timeBeforeDelete?: number; // Default 1000ms
  timeBeforeWriteNewRotateData?: number; // Default 500ms

  maxTypeSpeed?: number; // Default 200ms.
  typeVariance?: number; // Default 100ms. Range = [maxTypespeed - variance, maxTypespeed]

  maxDeleteSpeed?: number; // Default 100ms
  deleteVariance?: number; // Default 50ms

  loop?: boolean;
};
