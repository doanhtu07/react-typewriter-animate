import { PackInfo } from "../../types";
import { removeChar } from "../../utils";

export const deleteChar = (pack: PackInfo) => {
  /**
   *  This can happen when we are adding a span.
   *  HTML pointer is pointing to a new blank position.
   *  Then, suddenly, we switch to ActionBlock (delete).
   *  => Move HTML pointer to the last character of current HTML for deleting
   */
  if (pack.HTMLPointer >= pack.currentHTML.length) {
    pack.HTMLPointer = pack.currentHTML.length - 1;
  }

  /**
   *  Trim span: Try to move inside a closing span tag _</span> (if applicable)
   */
  trimSpan(pack, 1);

  /**
   *  - Delete character in HTML
   *  - Move HTML pointer backward
   *  - Move internal pointer backward
   */
  pack.currentHTML = removeChar(pack.currentHTML, pack.HTMLPointer);
  pack.HTMLPointer--;
  pack.internalBlockPointer--;

  /**
   *  Trim span: Try to move outside a opening span tag _<span class...> (if applicable)
   */
  trimSpan(pack, 2);
};

const trimSpan = (pack: PackInfo, id: number) => {
  /**
   *  If it's closing span and HTML pointer is at '>' of closing span
   *  => Move HTML pointer inside span
   */
  if (
    pack.currentHTML[pack.HTMLPointer] === ">" &&
    pack.currentHTML.substring(pack.HTMLPointer - "</span".length, pack.HTMLPointer + 1) === "</span>"
  ) {
    pack.HTMLPointer -= "</span>".length;
  }

  // // If it's closing span but the cursor is at the end + 1
  // else if (pack.currentHTML.substring(pack.HTMLPointer + 1 - "</span>".length, pack.HTMLPointer + 1) === "</span>") {
  //   console.log("Hi");
  //   pack.HTMLPointer -= "</span>".length;
  // }

  /**
   *  Check if we are at '>' of opening span.
   *  Even after moving inside a span, we can immediately meet opening span
   *    -> Happens when no character is in the span: <span class...></span>
   */
  if (pack.currentHTML[pack.HTMLPointer] === ">") {
    let pointer = pack.HTMLPointer - 5;
    let isOpeningSpan = false;

    /**
     *  If within 5 characters of '>' is there another '<' or '>'
     *  => Current '>' does not belong to opening span
     */
    if (
      pack.currentHTML.substring(pointer, pointer + 5).indexOf("<") === -1 &&
      pack.currentHTML.substring(pointer, pointer + 5).indexOf(">") === -1
    ) {
      /**
       *  We will look for '<' that is part of '<span'.
       */
      while (true) {
        if (pack.currentHTML.at(pointer) === ">") {
          break;
        }

        if (pack.currentHTML.at(pointer) === "<" && pack.currentHTML.substring(pointer, pointer + 5) !== "<span") {
          break;
        }

        if (pack.currentHTML.substring(pointer, pointer + 5) === "<span") {
          isOpeningSpan = true;
          break;
        }

        pointer--;
      }
    }

    /**
     *  If we are at '>' of a opening span:
     *  =>  - Remove the whole span in HTML
     *      - Move HTML pointer to behind the deleted span
     */
    if (isOpeningSpan) {
      // Remove span
      pack.currentHTML = pack.currentHTML.substring(0, pointer);
      pack.HTMLPointer = pointer - 1;
    }
  }
};
