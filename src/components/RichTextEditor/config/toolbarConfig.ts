import { RefObject } from "react";

// Import all icon ASSETS here, keeping them organized.
import { ASSETS } from "./assetsConfig";

// A strong type definition for a single toolbar button.
// The `action` is a simple, type-safe function.
export interface ToolbarButtonConfig {
  id: string;
  tooltip: string;
  icon: string;
  action: () => void;
  className?: string;
}

// A well-typed collection of all possible actions the toolbar can perform.
// This acts as a contract between the RichTextEditor and the config.
export interface ToolbarActions {
  toggleFormat: (format: string) => void;
  openLinkDialog: () => void;
  insertCode: () => void;
  clearFormat: () => void;
  toggleList: (type: "ul" | "ol") => void;
  triggerFileInput: (ref: RefObject<HTMLInputElement | null>) => void;
  insertCodeBlock: () => void;
  insertQuote: () => void;
  insertHorizontalRule: () => void;
}

// A function that generates the configuration array.
// It receives the functions and refs from the main component and wires them up.
export const getToolbarConfig = (
  actions: ToolbarActions,
  refs: {
    fileInputRef: RefObject<HTMLInputElement | null>;
    imageInputRef: RefObject<HTMLInputElement | null>;
    videoInputRef: RefObject<HTMLInputElement | null>;
  }
): ToolbarButtonConfig[][] => [
  // Each inner array represents a group of buttons, separated by a divider.
  [
    {
      id: "bold",
      tooltip: "Bold",
      icon: ASSETS.icons.bold,
      action: () => actions.toggleFormat("bold")
    },
    {
      id: "italic",
      tooltip: "Italic",
      icon: ASSETS.icons.italic,
      action: () => actions.toggleFormat("italic")
    },
    {
      id: "underline",
      tooltip: "Underline",
      icon: ASSETS.icons.underline,
      action: () => actions.toggleFormat("underline")
    },
    {
      id: "strikethrough",
      tooltip: "Strikethrough",
      icon: ASSETS.icons.strikethrough,
      action: () => actions.toggleFormat("strikeThrough")
    },
    {
      id: "link",
      tooltip: "Insert link",
      icon: ASSETS.icons.link,
      action: actions.openLinkDialog
    },
    {
      id: "inlineCode",
      tooltip: "Inline code",
      icon: ASSETS.icons.inlineCode,
      action: actions.insertCode
    },
    {
      id: "clear",
      tooltip: "Clear format",
      icon: ASSETS.icons.clearFormatting,
      action: actions.clearFormat,
      className: "pr"
    }
  ],
  [
    {
      id: "bulletList",
      tooltip: "Bullet list",
      icon: ASSETS.icons.bullet,
      action: () => actions.toggleList("ul")
    },
    {
      id: "numberList",
      tooltip: "Numbered list",
      icon: ASSETS.icons.number,
      action: () => actions.toggleList("ol"),
      className: "pr"
    }
  ],
  [
    {
      id: "file",
      tooltip: "Attach file",
      icon: ASSETS.icons.attach,
      action: () => actions.triggerFileInput(refs.fileInputRef)
    },
    {
      id: "image",
      tooltip: "Insert image",
      icon: ASSETS.icons.image,
      action: () => actions.triggerFileInput(refs.imageInputRef)
    },
    {
      id: "video",
      tooltip: "Insert video",
      icon: ASSETS.icons.video,
      action: () => actions.triggerFileInput(refs.videoInputRef)
    },
    {
      id: "codeBlock",
      tooltip: "Code block",
      icon: ASSETS.icons.blockCode,
      action: actions.insertCodeBlock
    },
    {
      id: "quote",
      tooltip: "Quote",
      icon: ASSETS.icons.quote,
      action: actions.insertQuote
    },
    {
      id: "hr",
      tooltip: "Horizontal rule",
      icon: ASSETS.icons.line,
      action: actions.insertHorizontalRule
    }
  ]
];
