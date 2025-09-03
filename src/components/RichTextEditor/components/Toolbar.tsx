import React, { FC, Fragment, ComponentType } from "react";
import { ToolbarButtonConfig } from "../config/toolbarConfig";

interface TooltipProps {
  direction: "top" | "bottom" | "left" | "right";
  content: string;
  children: React.ReactNode;
}

interface ToolbarProps {
  config: ToolbarButtonConfig[][];
  TooltipComponent: ComponentType<TooltipProps>;
}

export const Toolbar: FC<ToolbarProps> = ({ config, TooltipComponent }) => {
  return config.map((group, groupIndex) => (
    <Fragment key={`group-${groupIndex}`}>
      {group.map(button => (
        <TooltipComponent
          key={button.id}
          direction="bottom"
          content={button.tooltip}
        >
          <button
            className={`RichTextEditor-button ${button.className || ""}`}
            onClick={button.action}
          >
            <img src={button.icon} alt={button.tooltip} />
          </button>
        </TooltipComponent>
      ))}
    </Fragment>
  ));
};
