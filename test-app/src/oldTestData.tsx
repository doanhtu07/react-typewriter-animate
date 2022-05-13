import { TypewriterProps } from "../../main/dist/@types/types";

export const typeSpeed: TypewriterProps = {
  loop: true,
  dataToRotate: [
    [
      { type: "word", text: "A simple" },
      {
        type: "action",
        action: "delete",
        amount: "simple".length
      },
      {
        type: "word",
        text: "easy-to-use "
        // spanClass: classes.blue,
        // cursor: {
        //   cursorClass: classes.blue
        // }
      },
      {
        type: "word",
        text: "React Typewriter"
      }
    ],
    [
      { type: "word", text: "Try it now" },
      {
        type: "word",
        text: "...!",
        override: {
          maxTypespeed: 600
        }
      }
    ]
  ],
  maxTypeSpeed: 150,
  maxDeleteSpeed: 100,
  timeBeforeDelete: 1300
};
