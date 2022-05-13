export const DefaultSetting = {
  defaultCursorColor: "black",
  cursorBlinkRate: "900ms",
  timeBeforeBlinkCursor: 500,

  timeBeforeDelete: 1000,
  timeBeforeWriteNewRotateData: 500,

  maxTypeSpeed: 200,
  typeVariance: 100,

  maxDeleteSpeed: 100,
  deleteVariance: 50,

  start: true,
  loop: false,

  ActionBlock: {
    delete: {
      wait: 1000
    },
    function: {
      wait: 0
    }
  }
};
