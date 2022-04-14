import $ from "jquery";

const defaultRect = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};

export enum BoundingClientRectNumberPropertyName {
  HEIGHT = "height",
  WIDTH = "width",
  X_VALUE = "x",
  Y_VALUE = "y",
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
}

export const getBoundingClientRect = (
  ref: React.RefObject<HTMLElement>
): DOMRect | undefined => {
  return ref.current?.getBoundingClientRect();
};

export const getRectNumberProperty = (
  ref: React.RefObject<HTMLElement>,
  propertyName: BoundingClientRectNumberPropertyName
): number => {
  const boundingClientRect: DOMRect | Record<string, number> =
    getBoundingClientRect(ref) || defaultRect;
  return boundingClientRect[propertyName];
};

export const setCSSHTMLReference = (
  ref: React.RefObject<HTMLElement> | null,
  styleObj: Record<string, string | number>
): void => {
  if (ref?.current) {
    $(ref.current).css(styleObj);
  }
};
