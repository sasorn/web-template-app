import { useCallback, useEffect, useMemo, useRef } from "react";

export const useOutsideClick = ({
  onTriggered,
  disableClick,
  disableTouch,
  disableKeys,
  allowAnyKey,
  triggerKeys
}) => {
  const ref = useRef(null);

  const keyListener = useCallback(
    e => {
      if (allowAnyKey) {
        onTriggered(e);
      } else if (triggerKeys) {
        if (triggerKeys.includes(e.key)) {
          onTriggered(e);
        }
      } else {
        if (e.key === "Escape") {
          onTriggered(e);
        }
      }
    },
    [allowAnyKey, triggerKeys, onTriggered]
  );

  const clickOrTouchListener = useCallback(
    e => {
      if (ref && ref.current) {
        if (!ref.current.contains(e.target)) {
          onTriggered?.(e);
        }
      }
    },
    [ref.current, onTriggered]
  );

  const eventsConfig = useMemo(
    () => [
      [disableClick, "click", clickOrTouchListener],
      [disableTouch, "touchstart", clickOrTouchListener],
      [disableKeys, "keyup", keyListener]
    ],
    [disableClick, disableTouch, disableKeys, clickOrTouchListener, keyListener]
  );

  useEffect(() => {
    eventsConfig.map(eventConfigItem => {
      const [isDisabled, eventName, listener] = eventConfigItem;

      if (!isDisabled) {
        document.addEventListener(eventName, listener);
      }
    });

    return () => {
      eventsConfig.map(eventConfigItem => {
        const [isDisabled, eventName, listener] = eventConfigItem;

        if (!isDisabled) {
          document.removeEventListener(eventName, listener);
        }
      });
    };
  }, [eventsConfig]);

  // Cleanup function to reset the ref when the component is unmounted
  useEffect(() => {
    return () => {
      ref.current = null;
    };
  }, []);

  return ref;
};
