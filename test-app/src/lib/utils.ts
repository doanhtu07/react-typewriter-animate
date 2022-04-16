import { ActionBlock, WordBlock } from "./types";

export const insertAt = (des: string, s: string, pos: number): string => {
  return [des.slice(0, pos), s, des.slice(pos)].join("");
};

export const removeChar = (s: string, pos: number): string => {
  return [s.slice(0, pos), s.slice(pos + 1)].join("");
};

export const deepCopyData = (data: (WordBlock | ActionBlock)[][]) => {
  return data.map((el) => {
    return el.map((block) => ({ ...block }));
  });
};
