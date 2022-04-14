import React from "react";
import withStyles, { WithStylesProps } from "react-jss";
import "./App.css";
import Typewriter from "./lib";

const styles = () => ({
  root: {
    display: "flex",
    justifyContent: "center"
  },
  title: {
    margin: "0",
    marginTop: "100px",
    lineHeight: "1.15",
    fontSize: "64px",
    height: "calc(64px * 1.15 * 2)",
    display: "table",
    textAlign: "center"
  },
  anh_tu_do: {
    color: "blue"
  },
  tourGuide: {
    color: "#bb20ea",
    textDecoration: "underline"
  },
  started: {
    color: "#f6ce05",
    fontStyle: "italic"
  }
});

type Props = WithStylesProps<typeof styles>;

class App extends React.Component<Props> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <h1 className={classes.title}>
          <Typewriter
            defaultCursorColor="black"
            dataToRotate={[
              [["Welcome aboard!"]],
              [["I'm "], ["Anh Tu Do", classes.anh_tu_do, "blue"]],
              [["...your "], ["tour guide", classes.tourGuide, "#bb20ea"], [" today."]],
              [["Let get us "], ["started!", classes.started, "#f6ce05"]]
            ]}
            typeSpeed={120}
            timeBeforeDelete={1300}
          />
        </h1>
      </div>
    );
  }
}

export default withStyles(styles)(App);
