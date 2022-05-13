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

  blue: {
    color: "blue"
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
            loop
            dataToRotate={[
              [
                { type: "word", text: "Here we go!" },
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
