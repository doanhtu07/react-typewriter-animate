import { PackInfo } from "../types";

// --------- Life Cycle --------

export const resetPack = (pack: PackInfo) => {
  pack.internalBlockPointer = 0;
  pack.blockPointer = 0;
  pack.HTMLPointer = 0;

  pack.currentHTML = "";
  pack.currentDataRotateIndex = 0;
  pack.isDeleting = false;
};
