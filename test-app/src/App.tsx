import React from "react";
import withStyles, { WithStylesProps } from "react-jss";
import Typewriter from "react-typewriter-animate";
import "react-typewriter-animate/dist/Typewriter.css";
import "./App.css";

const styles = {
  root: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column"
  },
  title: {
    position: "relative",
    margin: "0",
    marginTop: "100px",
    lineHeight: "1.15",
    fontSize: "64px",
    height: "calc(64px * 1.15 * 2)",
    display: "table",
    textAlign: "center"
  },
  description: {
    display: "flex",
    justifyContent: "center"
  },

  go: {
    color: "blue",
    fontStyle: "italic"
  },
  goCursor: {
    color: "blue",
    transform: "rotate(10deg)",
    display: "inline-block",
    padding: "0px 5px"
  },

  letsGetIt: {
    fontWeight: 900
  },
  letsGetItCursor: {
    fontWeight: 900
  }
};

type Props = WithStylesProps<typeof styles>;

type State = {
  stStart: boolean;
};

class App extends React.Component<Props, State> {
  state: State = {
    stStart: false
  };

  render() {
    const { classes } = this.props;
    const { stStart } = this.state;

    return (
      <div className={classes.root}>
        <h1 className={classes.title}>
          <Typewriter
            dataToRotate={[
              [
                { type: "word", text: "Here we " },
                {
                  type: "word",
                  text: "go!",
                  spanClass: classes.go,
                  cursor: { cursorClass: classes.goCursor }
                },
                {
                  type: "word",
                  text: " Let's get it.",
                  spanClass: classes.letsGetIt,
                  cursor: { cursorClass: classes.letsGetItCursor }
                },
                {
                  type: "action",
                  action: "function",
                  func: () => {
                    console.log("Hello");
                    this.setState({
                      stStart: true
                    });
                  },
                  wait: 1000
                }
              ]
            ]}
            loop
            timeBeforeDelete={5000}
          />
        </h1>

        <h1 className={classes.description}>
          <Typewriter
            start={stStart}
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

export default withStyles(styles)(App);
