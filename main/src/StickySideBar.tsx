import withStyles, { WithStylesProps } from "react-jss";
import React from "react";
import {
  BoundingClientRectNumberPropertyName,
  getRectNumberProperty,
  setCSSHTMLReference,
} from "./utils";
import { StickySideBar_ID } from ".";

const { HEIGHT, TOP, BOTTOM } = BoundingClientRectNumberPropertyName;

const styles = () => ({
  spaceDiv: {
    minHeight: 0,
  },
  stickyContainer: {
    position: "sticky",
  },
  stickyDivParent: {
    position: "relative",
    height: "100%",
    width: "100%",
    flexGrow: 1,
  },
});

type Props = WithStylesProps<typeof styles> & {
  topSpace: number;
  bottomSpace: number;

  turnOff?: boolean;
  initialSpaceDivHeight?: number;
};

class StickySideBar extends React.Component<Props> {
  mContentDivRef = React.createRef<HTMLDivElement>();
  mSpaceDivRef = React.createRef<HTMLDivElement>();
  mStickyDivParentRef = React.createRef<HTMLDivElement>();

  mMaxSpaceDivHeight = 0;
  mLastScrollPosition = 0;

  componentDidMount() {
    const { turnOff } = this.props;

    this.setupHeightForSpaceDiv();

    !turnOff &&
      document.addEventListener("scroll", this.setStyleContentDivAndSpaceDiv);
  }

  componentDidUpdate(prevProps: Props) {
    const { turnOff, initialSpaceDivHeight } = this.props;
    const {
      turnOff: prevTurnOff,
      initialSpaceDivHeight: prevInitialSpaceDivHeight,
    } = prevProps;

    if (initialSpaceDivHeight !== prevInitialSpaceDivHeight) {
      this.setupHeightForSpaceDiv();
    }

    if (turnOff !== prevTurnOff) {
      if (turnOff) {
        document.removeEventListener(
          "scroll",
          this.setStyleContentDivAndSpaceDiv
        );
      } else {
        document.addEventListener("scroll", this.setStyleContentDivAndSpaceDiv);
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.setStyleContentDivAndSpaceDiv);
  }

  // Check if content hitting top or bottom limit
  isContentHittingTopLimit = (): boolean => {
    const { mContentDivRef } = this;
    const { topSpace } = this.props;
    return getRectNumberProperty(mContentDivRef, TOP) - topSpace <= 0;
  };
  isContentHittingBottomLimit = (): boolean => {
    const { mContentDivRef } = this;
    const { bottomSpace } = this.props;
    return (
      window.innerHeight -
        (getRectNumberProperty(mContentDivRef, BOTTOM) + bottomSpace) >=
      0
    );
  };

  // Check if content hits the top of parent
  isContentAtTopOfStickyParent = (): boolean => {
    const { mContentDivRef, mSpaceDivRef } = this;
    return (
      getRectNumberProperty(mContentDivRef, TOP) -
        getRectNumberProperty(mSpaceDivRef, TOP) <
      1
    );
  };

  calculateMaxSpaceDivHeight = (): number => {
    const { mContentDivRef, mStickyDivParentRef } = this;
    return (
      getRectNumberProperty(mStickyDivParentRef, HEIGHT) -
      getRectNumberProperty(mContentDivRef, HEIGHT)
    );
  };

  setHeightSpaceDiv = () => {
    const { mContentDivRef, mSpaceDivRef } = this;

    setCSSHTMLReference(mSpaceDivRef, {
      height: `${Math.abs(
        getRectNumberProperty(mContentDivRef, TOP) -
          getRectNumberProperty(mSpaceDivRef, TOP)
      )}px`,
      maxHeight: `${this.calculateMaxSpaceDivHeight()}px`,
    });
  };

  handleScrollingDown = () => {
    const { mContentDivRef, mSpaceDivRef } = this;
    const { bottomSpace, topSpace, initialSpaceDivHeight } = this.props;

    // When we set initial space div height and start scrolling, remember to set height back to zero.
    const isContentDivSmallerThanViewport =
      getRectNumberProperty(mContentDivRef, HEIGHT) <
      window.innerHeight - (topSpace + bottomSpace);

    if (isContentDivSmallerThanViewport && initialSpaceDivHeight) {
      setCSSHTMLReference(mSpaceDivRef, { height: 0 });
      return;
    }

    if (this.isContentHittingTopLimit()) {
      this.setHeightSpaceDiv();
    }

    const extraBottomSpaceAddingToTop =
      window.innerHeight -
      (getRectNumberProperty(mContentDivRef, BOTTOM) + bottomSpace);

    const newTop =
      getRectNumberProperty(mContentDivRef, TOP) + extraBottomSpaceAddingToTop;

    setCSSHTMLReference(mContentDivRef, {
      top: `${newTop}px`,
      bottom: "unset",
    });
  };

  handleScrollingUp = () => {
    const { mContentDivRef, mSpaceDivRef } = this;
    const { bottomSpace, topSpace, initialSpaceDivHeight } = this.props;

    // When we set initial space div height and start scrolling, remember to set height back to zero.
    const isContentDivSmallerThanViewport =
      getRectNumberProperty(mContentDivRef, HEIGHT) <
      window.innerHeight - (topSpace + bottomSpace);

    if (isContentDivSmallerThanViewport && initialSpaceDivHeight) {
      setCSSHTMLReference(mSpaceDivRef, { height: 0 });
      return;
    }

    if (this.isContentAtTopOfStickyParent()) {
      setCSSHTMLReference(mSpaceDivRef, { height: 0 });
      setCSSHTMLReference(mContentDivRef, { bottom: "unset", top: "unset" });
      return;
    }

    if (this.isContentHittingBottomLimit()) {
      this.setHeightSpaceDiv();
    }

    const extraTopSpaceAddingToBottom =
      getRectNumberProperty(mContentDivRef, TOP) - topSpace;

    const newBottom =
      window.innerHeight -
      getRectNumberProperty(mContentDivRef, BOTTOM) +
      extraTopSpaceAddingToBottom;

    setCSSHTMLReference(mContentDivRef, {
      bottom: `${newBottom}px`,
      top: "unset",
    });
  };

  setStyleContentDivAndSpaceDiv = () => {
    const { mContentDivRef } = this;
    const { topSpace, bottomSpace, initialSpaceDivHeight } = this.props;

    // https://stackoverflow.com/questions/31223341/detecting-scroll-direction
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const isScrollingDown = scrollTop > this.mLastScrollPosition;
    const isScrollingUp = scrollTop < this.mLastScrollPosition;

    const isContentDivSmallerThanViewport =
      getRectNumberProperty(mContentDivRef, HEIGHT) <
      window.innerHeight - (topSpace + bottomSpace);

    if (isContentDivSmallerThanViewport) {
      setCSSHTMLReference(mContentDivRef, {
        position: "sticky",
        top: topSpace,
      });
    }

    if (!isContentDivSmallerThanViewport || initialSpaceDivHeight) {
      if (isScrollingDown) {
        this.handleScrollingDown();
      }

      if (isScrollingUp) {
        this.handleScrollingUp();
      }
    }

    // Store last scroll
    this.mLastScrollPosition = scrollTop <= 0 ? 0 : scrollTop;
  };

  setupHeightForSpaceDiv = () => {
    const { initialSpaceDivHeight } = this.props;
    const { mSpaceDivRef } = this;

    setCSSHTMLReference(mSpaceDivRef, {
      height: initialSpaceDivHeight ?? 0,
      maxHeight: `${
        initialSpaceDivHeight ?? this.calculateMaxSpaceDivHeight()
      }px`,
    });
  };

  render(): JSX.Element {
    const { classes } = this.props;
    const { mContentDivRef, mSpaceDivRef, mStickyDivParentRef } = this;

    return (
      <div
        id={StickySideBar_ID.PARENT}
        ref={mStickyDivParentRef}
        className={classes.stickyDivParent}
      >
        <div
          id={StickySideBar_ID.SPACE}
          ref={mSpaceDivRef}
          className={classes.spaceDiv}
        />

        <div
          id={StickySideBar_ID.CONTENT}
          ref={mContentDivRef}
          className={classes.stickyContainer}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(StickySideBar);
