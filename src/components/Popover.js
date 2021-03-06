import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import MuiPopover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grow from '@material-ui/core/Grow';
import Draggable from 'react-draggable'

const DraggableWrapper = ({ children, ...other }) => {
  return (
    <Draggable handle=".handle">
      {React.cloneElement(children, { ...other })}
    </Draggable>
  );
};

const DraggableGrow = ({ children, ...other }) => {
  return (
    <Grow {...other} timeout={0}>
      <DraggableWrapper>{children}</DraggableWrapper>
    </Grow>
  );
};

const Popover = ({ className, trigger, refExit, hide, content, ...providedProps }) => {
  const [isOpen, open] = useState(false);
  const anchorEl = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const shouldHide = typeof hide === 'boolean' ? hide : false;
      if (shouldHide) {
        open(false);
      }
    }
  }, [hide, isOpen, open]);

  const handleClick = event => {
    anchorEl.current = event.currentTarget;
    open(true);
  };

  const handleRequestClose = () => {
    open(false);
  };

  const closeIconClass = providedProps.classes.closeIcon;
  delete providedProps.classes.closeIcon; // remove non-standard class from being passed to the popover component

  const transformOriginSpecs = {
    vertical: 'top',
    horizontal: 'center',
  };

  const anchorOriginSpecs = {
    vertical: 'bottom',
    horizontal: 'center',
  };

  const handleOnExit = () => {
    if (refExit) {
      refExit();
    }
  };

  const triggerProps = {
    key: 'content',
    onClick: event => {
      if (trigger.props.onClick) trigger.props.onClick();
      handleClick(event);
    },
  };

  return (
    <>
      <span {...triggerProps}>{trigger}</span>
      <MuiPopover
        elevation={2}
        open={isOpen}
        onClose={handleRequestClose}
        onExited={handleOnExit}
        anchorEl={anchorEl.current}
        anchorOrigin={anchorOriginSpecs}
        transformOrigin={transformOriginSpecs}
        TransitionComponent={DraggableGrow}
        {...providedProps}>
        <IconButton
          aria-label="Close"
          onClick={handleRequestClose}
          className={closeIconClass}
          style={{ position: 'absolute', right: '4px', top: '4px', zIndex: '1000', border: '1px solid white' }}>
          <CloseIcon />
        </IconButton>
        {content}
      </MuiPopover>
    </>
  );
};

Popover.propTypes = {
  refExit: PropTypes.func,
  trigger: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  hide: PropTypes.bool,
};

export default Popover;
