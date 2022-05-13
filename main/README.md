# React Typewriter Animate

![banner](https://user-images.githubusercontent.com/55064969/163668440-8aead1df-3774-4de6-b208-94c6396b5e46.gif)

## Useful Links

- [NPM Repo](https://www.npmjs.com/package/react-typewriter-animate)
- [CodeSandbox Demo](https://codesandbox.io/s/test-react-typewriter-animate-zkxyjt)

**Note: Examples are written far below.**

### Table of content

- [Installation](#installation)
- [Usage in React](#usage-in-react)
- [Options for Typewriter](#options-for-typewriter)
- [Options for WordBlock](#options-for-wordblock)
- [Options for ActionBlock](#options-for-actionblock)
- [Examples](#examples)
  - [Basic Example](#basic-example)
  - [Example with override object in WordBlock](#example-with-override-object-in-wordblock)
  - [Example with override cursor in WordBlock](#example-with-override-cursor-in-wordblock)
  - [Example with styled WordBlock](#example-with-styled-wordblock)
  - [Example with overwrite style object: classes](#example-with-overwrite-style-object-classes)
  - [Example with delete](#example-with-delete)
  - [Example with combo: start flag and function](#example-with-combo-start-flag-and-function)

## Installation

`npm install react-typewriter-animate`

or

`yarn add react-typewriter-animate`

## Usage in React

```typescript

import Typewriter from 'react-typewriter-animate';
import "react-typewriter-animate/dist/Typewriter.css";

...

class Demo extends React.Components {
  render() {
    return (
      <div>
        <Typewriter
          dataToRotate={[
            [
              { type: "word", text: "Hello!" }
            ],
            [
              { type: "word", text: "I'm Anh Tu." }
            ]
          ]}
        />
      </div>
    )
  }
}

```

## Options for Typewriter

```typescript
type TypewriterProps = {
  dataToRotate: (WordBlock | ActionBlock)[][]; // Purpose: This is the array of all data (i.e banners) to type out. Each banner is a small array of WordBlock's and ActionBlock's

  cursor?: {
    char?: string; // Default: "│" | Purpose: Set cursor's appearance using string.
    cursorBlinkRate?: string; // Default: "900ms" | Purpose: Set blink speed of cursor.
    timeBeforeBlinkCursor?: number; // Default: 500ms | Purpose: When finish typing, set timeout before blinking cursor.
  };

  timeBeforeDelete?: number; // Default: 1000ms | Purpose: Wait time before deleting a banner after finish typing the whole banner.
  timeBeforeWriteNewRotateData?: number; // Default: 500ms | Purpose: Wait time before typing next banner.

  maxTypeSpeed?: number; // Default: 200ms | Purpose: Maximum typing speed.
  typeVariance?: number; // Default: 100ms | Purpose: Type speed range = maxTypespeed - typeVariance -> maxTypespeed. Type speed of each character can vary randomly within this range.

  maxDeleteSpeed?: number; // Default: 100ms | Purpose: Maximum deleting speed.
  deleteVariance?: number; // Default: 50ms | Purpose: Delete speed range = maxDeleteSpeed - deleteVariance -> maxDeleteSpeed. Delete speed of each character can vary randomly within this range.

  start?: boolean; // Default: true | Purpose: Determine whether Typewriter should start typing.
  loop?: boolean; // Default: false | Purpose: Determine whether Typewriter should loop these banners or stop after the last banner.

  containerClass?: string; // Purpose: Overwrite default styles of Typewriter-container.
  contentClass?: string; // Purpose: Overwrite default styles of Typewriter-content.
  cursorClass?: string; // Purpose: Overwrite default styles of Typewriter-cursor.
};
```

**Note: You can access the class name keywords safely through TypewriterClassNames exported from the package.**

```typescript
enum TypewriterClassNames {
  Container = "Typewriter-container",
  Content = "Typewriter-content",
  Cursor = "Typewriter-cursor",
  Blink = "Typewriter-blink",
  Blink_Keyframe = "Typewriter-blink-keyframe"
}
```

## Options for WordBlock

```typescript
type WordBlock = {
  type: "word";
  text: string;

  spanClass?: string; // Purpose: Class name for current word block. Typewriter will wrap text inside a <span> for you.

  // Purpose: Override cursor style and appearance.
  cursor?: {
    char?: string; // Default "│"
    cursorClass?: string;
  };

  // Purpose: Override type speed and delete speed passed from main props.
  override?: {
    maxTypespeed?: number;
    typeVariance?: number;

    maxDeleteSpeed?: number;
    deleteVariance?: number;
  };
};
```

## Options for ActionBlock

```typescript
type DeleteBlock = {
  type: "action";
  action: "delete";
  amount: number;
  wait?: number; // Default wait time before delete is 1000ms
};

type FunctionBlock = {
  type: "action";
  action: "function";
  func: () => void;
  wait?: number; // Default wait time before doing function is 0ms
};
```

## Examples

### Basic Example

```typescript
import Typewriter from "react-typewriter-animate";
import "react-typewriter-animate/dist/Typewriter.css";

class BasicExample extends React.Components {
  render() {
    return (
      <div className="root">
        <Typewriter
          dataToRotate={[
            // Banner 1
            [{ type: "word", text: "Hello!" }],
            // Banner 2
            [{ type: "word", text: "I'm Anh Tu." }]
          ]}
        />
      </div>
    );
  }
}
```

### Example with override object in WordBlock

```typescript
import Typewriter from "react-typewriter-animate";
import "react-typewriter-animate/dist/Typewriter.css";

class Example_Override_WordBlock extends React.Components {
  render() {
    return (
      <div className="root">
        <Typewriter
          dataToRotate={[
            // Banner 1
            [
              { type: "word", text: "I'm typing fast until here" },
              { type: "word", text: "...", override: { maxTypespeed: 600 } }
            ],
            // Banner 2
            [{ type: "word", text: "I'm Anh Tu." }]
          ]}
        />
      </div>
    );
  }
}
```

### Example with override cursor in WordBlock

```typescript
import Typewriter from "react-typewriter-animate";
import "react-typewriter-animate/dist/Typewriter.css";

class Example_Override_Cursor_WordBlock extends React.Components {
  render() {
    return (
      <div className="root">
        <Typewriter
          dataToRotate={[
            // Banner 1
            [
              { type: "word", text: "Changing cursor..." },
              {
                type: "word",
                text: "now!",
                cursor: { char: "😀", cursorClass: "css-class" }
              }
            ],
            // Banner 2
            [{ type: "word", text: "I'm Anh Tu." }]
          ]}
        />
      </div>
    );
  }
}
```

### Example with styled WordBlock

```typescript

import Typewriter from 'react-typewriter-animate';
import "react-typewriter-animate/dist/Typewriter.css";

class Example_Styled_WordBlock extends React.Components {
  render() {
    return (
      <div className="root">
        <Typewriter
          dataToRotate={[
            // Banner 1
            [
              { type: "word", text: "Hello", spanClass: "css-class-name" },
              { type: "word", text: " guys" }
            ],
            // Banner 2
            [
              { type: "word", text: "I'm Anh Tu." }
            ]
          ]}
        />
      </div>
    ):
  }
}

```

### Example with overwrite style object: classes

```typescript
import Typewriter from "react-typewriter-animate";
import "react-typewriter-animate/dist/Typewriter.css";
import "./overwrite.css";

/**
 *  Default styles:
 *
 *  .Typewriter-cursor {
 *     --cursor-blink-rate: 900ms;
 *
 *     color: inherit;
 *     transition: all 0.2s;
 *  }
 *
 *  .Typewriter-blink {
 *    animation: Typewriter-blink-keyframe var(--cursor-blink-rate) step-end infinite;
 *  },
 *
 *  @keyframes Typewriter-blink-keyframe {
 *    0% {
 *      opacity: 0;
 *    }
 *    50% {
 *      opacity: 1;
 *    }
 *  }
 */

/**
 *  ./overwrite.css file:
 *
 *  .typewriter-container-overwrite {
 *    color: "white";
 *    background-color: "blue";
 *  }
 */

class Example_Overwrite_Style extends React.Components {
  render() {
    return (
      <div className="root">
        <Typewriter
          containerClass="typewriter-container-overwrite"
          dataToRotate={[
            // Banner 1
            [
              { type: "word", text: "I'm typing fast until here" },
              { type: "word", text: "...", override: { maxTypespeed: 600 } }
            ],
            // Banner 2
            [{ type: "word", text: "I'm Anh Tu." }]
          ]}
        />
      </div>
    );
  }
}
```

### Example with delete

```typescript
import Typewriter from "react-typewriter-animate";
import "react-typewriter-animate/dist/Typewriter.css";

class Example_Delete extends React.Components {
  render() {
    return (
      <div className="root">
        <Typewriter
          dataToRotate={[
            // Banner 1
            [
              {
                type: "word",
                text: "What's up?",
                spanClass: "css-class-name"
              },
              { type: "action", action: "delete", amount: "up?".length },
              { type: "word", text: "going on, guys?" }
            ],
            // Banner 2
            [{ type: "word", text: "I'm Anh Tu." }]
          ]}
        />
      </div>
    );
  }
}
```

### Example with combo: start flag and function

```typescript
import Typewriter from "react-typewriter-animate";
import "react-typewriter-animate/dist/Typewriter.css";

class Example_Start_Function extends React.Components {
  state = {
    start: false
  };

  render() {
    const { start } = this.state;

    return (
      <div className="root">
        <h1 className="title">
          <Typewriter
            dataToRotate={[
              [
                { type: "word", text: "Here we go!" },
                {
                  type: "action",
                  action: "function",
                  func: () => {
                    console.log("Hello");
                    this.setState({
                      start: true
                    });
                  },
                  wait: 1000
                }
              ]
            ]}
          />
        </h1>

        <h1 className="description">
          <Typewriter
            start={start}
            dataToRotate={[
              [
                {
                  type: "word",
                  text: "Hello guys!"
                }
              ],
              [{ type: "word", text: "I'm Tu" }]
            ]}
          />
        </h1>
      </div>
    );
  }
}
```
