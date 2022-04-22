import React from "react";
import withStyles, { WithStylesProps } from "react-jss";
import Typewriter from "react-typewriter-animate";
import "react-typewriter-animate/dist/Typewriter.css";
import "./App.css";

const styles = {
  root: {
    display: "flex",
    justifyContent: "center"
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
  blue: {
    color: "blue"
  }
};

type Props = WithStylesProps<typeof styles>;

class App extends React.Component<Props> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <h1 className={classes.title}>
          <Typewriter
            loop
            dataToRotate={[
              [
                { type: "word", text: "A simple" },
                {
                  type: "action",
                  action: "delete",
                  amount: "simple".length
                },
                {
                  type: "word",
                  text: "easy-to-use ",
                  spanClass: classes.blue,
                  cursorColor: "blue"
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
            ]}
            maxTypeSpeed={150}
            maxDeleteSpeed={100}
            timeBeforeDelete={1300}
          />
        </h1>
      </div>
    );
  }
}

export default withStyles(styles)(App);
