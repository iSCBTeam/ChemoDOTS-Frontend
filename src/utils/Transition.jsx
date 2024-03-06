import React, { useRef, useEffect, useContext } from "react";
import { CSSTransition as ReactCSSTransition } from "react-transition-group";

const TransitionContext = React.createContext({
  parent: {},
});

function useIsInitialRender() {
  const isInitialRender = useRef(true);
  useEffect(() => {
    isInitialRender.current = false;
  }, []);
  return isInitialRender.current;
}

function CSSTransition({
  show,
  enter = "",
  enterStart = "",
  enterEnd = "",
  leave = "",
  leaveStart = "",
  leaveEnd = "",
  appear,
  unmountOnExit,
  tag = "div",
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  children,
  ...rest
}) {
  const enterClasses = enter.split(" ").filter((s) => s.length);
  const enterStartClasses = enterStart.split(" ").filter((s) => s.length);
  const enterEndClasses = enterEnd.split(" ").filter((s) => s.length);
  const leaveClasses = leave.split(" ").filter((s) => s.length);
  const leaveStartClasses = leaveStart.split(" ").filter((s) => s.length);
  const leaveEndClasses = leaveEnd.split(" ").filter((s) => s.length);
  const removeFromDom = unmountOnExit;

  function addClasses(node, classes) {
    classes.length && node.classList.add(...classes);
  }

  function removeClasses(node, classes) {
    classes.length && node.classList.remove(...classes);
  }

  const nodeRef = React.useRef(null);
  const Component = tag;

  return (
    <ReactCSSTransition
      appear={appear}
      nodeRef={nodeRef}
      unmountOnExit={removeFromDom}
      in={show}
      addEndListener={(done) => {
        nodeRef.current.addEventListener("transitionend", done, false);
      }}
      onEnter={(...rest) => {
        if (!removeFromDom) nodeRef.current.style.display = null;
        addClasses(nodeRef.current, [...enterClasses, ...enterStartClasses]);
        if (onEnter) onEnter(...rest);
      }}
      onEntering={(...rest) => {
        removeClasses(nodeRef.current, enterStartClasses);
        addClasses(nodeRef.current, enterEndClasses);
        if (onEntering) onEntering(...rest);
      }}
      onEntered={(...rest) => {
        removeClasses(nodeRef.current, [...enterEndClasses, ...enterClasses]);
        if (onEntered) onEntered(...rest);
      }}
      onExit={(...rest) => {
        addClasses(nodeRef.current, [...leaveClasses, ...leaveStartClasses]);
        if (onExit) onExit(...rest);
      }}
      onExiting={(...rest) => {
        removeClasses(nodeRef.current, leaveStartClasses);
        addClasses(nodeRef.current, leaveEndClasses);
        if (onExiting) onExiting(...rest);
      }}
      onExited={(...rest) => {
        removeClasses(nodeRef.current, [...leaveEndClasses, ...leaveClasses]);
        if (!removeFromDom) nodeRef.current.style.display = "none";
        if (onExited) onExited(...rest);
      }}
    >
      <Component
        ref={nodeRef}
        {...rest}
        style={{ display: !removeFromDom ? "none" : null }}
      >
        {children}
      </Component>
    </ReactCSSTransition>
  );
}

function Transition({ show, appear, ...rest }) {
  1;
  const { parent } = useContext(TransitionContext);
  const isInitialRender = useIsInitialRender();
  const isChild = show === undefined;

  if (isChild) {
    return (
      <CSSTransition
        appear={parent.appear || !parent.isInitialRender}
        show={parent.show}
        {...rest}
      />
    );
  }

  return (
    <TransitionContext.Provider
      value={{
        parent: {
          show,
          isInitialRender,
          appear,
        },
      }}
    >
      <CSSTransition appear={appear} show={show} {...rest} />
    </TransitionContext.Provider>
  );
}

export default Transition;
