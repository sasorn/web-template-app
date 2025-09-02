import React, { FC, useState, ReactNode, useRef, useLayoutEffect } from "react";
import classNames from "classnames";
import "./Tooltip.less";

type TooltipDirection = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  content: string;
  children: ReactNode;
  show?: boolean;
  direction?: TooltipDirection;
}

const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  show = true,
  direction = "top"
}) => {
  const [visible, setVisible] = useState(false);
  const [currentDirection, setCurrentDirection] =
    useState<TooltipDirection>(direction);
  const [ready, setReady] = useState(false); // tooltip is positioned
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setVisible(true);
  const handleMouseLeave = () => {
    setVisible(false);
    setCurrentDirection(direction);
    setReady(false);
  };

  useLayoutEffect(() => {
    if (!visible || !tooltipRef.current || !containerRef.current) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newDirection = direction;

    if (direction === "top" && containerRect.top - tooltipRect.height < 0)
      newDirection = "bottom";
    else if (
      direction === "bottom" &&
      containerRect.bottom + tooltipRect.height > viewportHeight
    )
      newDirection = "top";
    else if (direction === "left" && containerRect.left - tooltipRect.width < 0)
      newDirection = "right";
    else if (
      direction === "right" &&
      containerRect.right + tooltipRect.width > viewportWidth
    )
      newDirection = "left";

    setCurrentDirection(newDirection);
    setReady(true);
  }, [visible, direction]);

  if (!show) return <>{children}</>;

  return (
    <div
      className="Tooltip"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div
          ref={tooltipRef}
          className={classNames("Tooltip-tip", `Tooltip-${currentDirection}`, {
            "Tooltip-hidden": !ready
          })}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
