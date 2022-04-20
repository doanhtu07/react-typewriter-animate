# React Typewriter Animate

![banner](https://user-images.githubusercontent.com/55064969/163668440-8aead1df-3774-4de6-b208-94c6396b5e46.gif)

## Useful Links

- [NPM Repo](https://www.npmjs.com/package/react-typewriter-animate)
- [CodeSandbox Demo](https://codesandbox.io/s/test-react-typewriter-animate-zkxyjt)

**Note: Examples are written far below.**

## Installation

`npm install react-typewriter-animate`

or

`yarn add react-typewriter-animate`

## Usage in React

```typescript

import Typewriter from 'react-typewriter-animate';

...

class Demo extends React.Components {
  render() {
    return (
      <div>
        <Typewriter
          defaultCursorColor="black"
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

| Name                         | Type                                         | Required / Default             | Purpose                                                                                                                                     |
| ---------------------------- | -------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| dataToRotate                 | Array of arrays of (WordBlock / ActionBlock) | Required                       | This is the array of all data (i.e banners) to type out. Each banner is a small array of WordBlock's and ActionBlock's                      |
| defaultCursorColor           | string                                       | Required                       | Set default color for cursor of Typewriter. A CSS string for color. E.g: red, #ffffff, rgb(0,0,0), var(--color-variable)                    |
| timeBeforeDelete             | number                                       | 1000ms                         | Wait time before deleting a banner after finish typing the whole banner                                                                     |
| timeBeforeWriteNewRotateData | number                                       | 500ms                          | Wait time before typing next banner                                                                                                         |
| maxTypeSpeed                 | number                                       | 200ms                          | Maximum typing speed                                                                                                                        |
| typeVariance                 | number                                       | 100ms                          | Type speed range = maxTypespeed - typeVariance -> maxTypespeed. Type speed of each character can vary randomly within this range.           |
| maxDeleteSpeed               | number                                       | 100ms                          | Maximum deleting speed                                                                                                                      |
| deleteVariance               | number                                       | 50ms                           | Delete speed range = maxDeleteSpeed - deleteVariance -> maxDeleteSpeed. Delete speed of each character can vary randomly within this range. |
| loop                         | boolean                                      | false                          | Determine whether Typewriter should loop these banners or stop after the last banner.                                                       |
| containerClass               | string                                       | Default styles from Typewriter | Overwrite default styles of Typewriter-container                                                                                            |
| contentClass                 | string                                       | Default styles from Typewriter | Overwrite default styles of Typewriter-content                                                                                              |

**Note: You can access the class name keywords safely through TypewriterClassNames exported from the package.**

## Options for WordBlock

| Name        | Type               | Required / Optional | Purpose                                                                                        |
| ----------- | ------------------ | ------------------- | ---------------------------------------------------------------------------------------------- |
| type        | "word"             | Required            | Declare this is a WordBlock                                                                    |
| text        | string             | Required            | Text to type out                                                                               |
| spanClass   | string             | Optional            | Class name for this WordBlock. Typewriter will wrap text inside a <span> for you.              |
| cursorColor | string             | Optional            | A CSS string for color. E.g: red, #ffffff, rgb(0,0,0), var(--color-variable)                   |
| override    | Object shown below | Optional            | To override some props passed in initially for Typewriter and apply only for current WordBlock |

**Object for Override**

```typescript
override?: {
  maxTypespeed?: number;
  typeVariance?: number;

  maxDeleteSpeed?: number;
  deleteVariance?: number;
}
```

## Options for ActionBlock

| Name   | Type     | Required / Default | Purpose                                            |
| ------ | -------- | ------------------ | -------------------------------------------------- |
| type   | "action" | Required           | Declare this is an ActionBlock                     |
| action | "delete" | Required           | Declare action name                                |
| amount | number   | Required           | Amount of characters to delete                     |
| wait   | number   | 1000ms             | Wait time before starting to execute delete action |

## Examples

### Basic Example

```typescript
import Typewriter from "react-typewriter-animate";

class BasicExample extends React.Components {
  render() {
    return (
      <div className="root">
        <Typewriter
          defaultCursorColor="black"
          dataToRotate={[
            // Banner 1
            [{ type: "word", text: "Hello!" }],
            // Banner 2
            [{ type: "word", text: "I'm Anh Tu." }],
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

class Example_Styled_WordBlock extends React.Components {
  render() {
    return (
      <div className="root">
        <Typewriter
          defaultCursorColor="black"
          dataToRotate={[
            // Banner 1
            [
              { type: "word", text: "Hello", spanClass: "css-class-name", cursorColor: "blue" },
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

### Example with delete

```typescript
import Typewriter from "react-typewriter-animate";

class Example_Delete extends React.Components {
  render() {
    return (
      <div className="root">
        <Typewriter
          defaultCursorColor="black"
          dataToRotate={[
            // Banner 1
            [
              {
                type: "word",
                text: "What's up?",
                spanClass: "css-class-name",
                cursorColor: "blue",
              },
              { type: "action", action: "delete", amount: "up?".length },
              { type: "word", text: "going on, guys?" },
            ],
            // Banner 2
            [{ type: "word", text: "I'm Anh Tu." }],
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

class Example_Override_WordBlock extends React.Components {
  render() {
    return (
      <div className="root">
        <Typewriter
          defaultCursorColor="black"
          dataToRotate={[
            // Banner 1
            [
              { type: "word", text: "I'm typing fast until here" },
              { type: "word", text: "...", override: { maxTypespeed: 600 } },
            ],
            // Banner 2
            [{ type: "word", text: "I'm Anh Tu." }],
          ]}
        />
      </div>
    );
  }
}
```

### Example with overwrite style object: classes

```typescript
import Typewriter from "react-typewriter-animate";
import "./overwrite.css";

/**
 *  Default styles:
 *
 *  .Typewriter-container {
 *     --cursor-color: black;
 *     border-right: 0.15em solid var(--cursor-color);
 *     transition: border-right 0.2s;
 *  }
 *
 *  .Typewriter-blink {
 *    animation: Typewriter-blink-caret 0.9s step-end infinite;
 *  },
 *
 *  @keyframes Typewriter-blink-caret {
 *    0%: {
 *      border-color: transparent;
 *    }
 *    50%: {
 *      border-color: var(--cursor-color);
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
          defaultCursorColor="black"
          dataToRotate={[
            // Banner 1
            [
              { type: "word", text: "I'm typing fast until here" },
              { type: "word", text: "...", override: { maxTypespeed: 600 } },
            ],
            // Banner 2
            [{ type: "word", text: "I'm Anh Tu." }],
          ]}
        />
      </div>
    );
  }
}
```
