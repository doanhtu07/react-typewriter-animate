import { ActionBlock, WordBlock } from "../types";

export const deepCopyData = (data: (WordBlock | ActionBlock)[][]) => {
  return data.map((el) => {
    return el.map((block) => ({ ...block }));
  });
};
