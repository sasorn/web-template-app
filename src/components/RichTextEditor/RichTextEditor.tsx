import React, { FC, useRef, useState, useCallback, useEffect } from "react";

import Tooltip from "../Tooltip/Tooltip";

import { useFormatHeading } from "./hooks/useFormatHeading";
import { useFormatAlign } from "./hooks/useFormatAlign";
import { useInsertLink, LinkDialogComponent } from "./hooks/useInsertLink";
import { useMediaControl } from "./hooks/useMediaControl";
import { useInsertFile } from "./hooks/useInsertFile";
import { useInsertImage } from "./hooks/useInsertImage";
import { useInsertVideo } from "./hooks/useInsertVideo";
import { useInsertCodeInline } from "./hooks/useInsertCodeInline";
import { useInsertCodeBlock } from "./hooks/useInsertCodeBlock";
import { useInsertQuote } from "./hooks/useInsertQuote";
import { useHandleKeyDown } from "./hooks/useHandleKeyDown";
import { useSimpleFormats } from "./hooks/useSimpleFormats";
import { useColorPicker } from "./hooks/useColorPicker";

import chevronDown from "./assets/chevronDown.svg";
import left from "./assets/left.svg";
import bold from "./assets/bold.svg";
import italic from "./assets/italic.svg";
import underline from "./assets/underline.svg";
import strikethrough from "./assets/strikethrough.svg";
import inlineCode from "./assets/inlineCode.svg";
import clearFormatting from "./assets/clearFormatting.svg";
import bullet from "./assets/bullet.svg";
import number from "./assets/number.svg";
import attach from "./assets/attach.svg";
import image from "./assets/image.svg";
import video from "./assets/video.svg";
import blockCode from "./assets/blockCode.svg";
import quote from "./assets/quote.svg";
import line from "./assets/line.svg";
import link from "./assets/link.svg";

import colors from "./assets/colors.json";

import "./RichTextEditor.less";
import classNames from "classnames";

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  height?: string | number;
  onMediaStaged: (mediaId: string, file: File, blobUrl: string) => void; // to upload image and video files
}

const RichTextEditor: FC<RichTextEditorProps> = ({
  initialValue = "",
  onChange,
  placeholder = "Type or paste your content here!",
  onMediaStaged
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const headingDropdownRef = useRef<HTMLDivElement>(null);
  const alignDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedHeading, setSelectedHeading] = useState("Normal text");
  const [selectedAlign, setSelectedAlign] = useState("Left");

  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showAlignDropdown, setShowAlignDropdown] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const headingOptions = [
    { value: "Normal text", label: "Normal text" },
    { value: "Heading 1", label: "Heading 1" },
    { value: "Heading 2", label: "Heading 2" },
    { value: "Heading 3", label: "Heading 3" },
    { value: "Heading 4", label: "Heading 4" },
    { value: "Heading 5", label: "Heading 5" },
    { value: "Heading 6", label: "Heading 6" }
  ];

  const alignOptions = [
    { value: "Left", label: "Left" },
    { value: "Center", label: "Center" },
    { value: "Right", label: "Right" }
  ];

  // Simplified content change handler
  const handleContentChange = useCallback(() => {
    if (!editorRef.current || !onChange) return;

    const content = editorRef.current.innerHTML;
    const textContent = editorRef.current.textContent || "";

    // Simple empty check
    const hasImages = content.includes("<img");
    const hasVideos = content.includes("<video");
    const hasCode = content.includes("<code");
    const hasCodeBlock = content.includes("<pre");
    const hasQuote = content.includes("<blockquote");

    const isCurrentlyEmpty =
      !textContent.trim() &&
      !hasImages &&
      !hasVideos &&
      !hasCode &&
      !hasCodeBlock &&
      !hasQuote;
    setIsEmpty(isCurrentlyEmpty);

    // Send content without aggressive cleaning
    onChange(content);
  }, [onChange]);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    if (initialValue) {
      editorRef.current.innerHTML = initialValue;
      setIsEmpty(false);
    } else {
      editorRef.current.innerHTML = "<div><br></div>";
      setIsEmpty(true);
    }
  }, [initialValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headingDropdownRef.current &&
        !headingDropdownRef.current.contains(event.target as Node)
      ) {
        setShowHeadingDropdown(false);
      }
      if (
        alignDropdownRef.current &&
        !alignDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAlignDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const execCommand = useCallback(
    (command: string, value: string | boolean = false) => {
      document.execCommand(command, false, value as string);
      editorRef.current?.focus();
      handleContentChange();
    },
    [handleContentChange]
  );

  const { handleKeyDown } = useHandleKeyDown({
    handleContentChange
  });

  const { formatHeading } = useFormatHeading({
    execCommand,
    setSelectedHeading,
    setShowHeadingDropdown
  });

  const { formatAlign } = useFormatAlign({
    execCommand,
    setSelectedAlign,
    setShowAlignDropdown
  });

  const {
    colorPickerRef,
    selectedColor,
    setSelectedColor,
    showColorPicker,
    setShowColorPicker,
    formatColor
  } = useColorPicker({ execCommand });

  const { toggleFormat, toggleList, clearFormat, insertHorizontalRule } =
    useSimpleFormats({
      execCommand,
      setSelectedHeading,
      setSelectedAlign,
      setSelectedColor
    });

  const {
    openLinkDialog,
    showLinkDialog,
    linkText,
    linkUrl,
    setLinkText,
    setLinkUrl,
    handleSaveLink,
    handleCancelLink
  } = useInsertLink({
    editorRef,
    execCommand
  });

  const { setSelectedMedia, MediaToolbar, handleEditorClick } = useMediaControl(
    { handleContentChange }
  );

  const { handleImageUpload } = useInsertImage({
    editorRef,
    onMediaStaged,
    setSelectedMedia,
    handleContentChange
  });

  const { handleVideoUpload } = useInsertVideo({
    editorRef,
    onMediaStaged,
    setSelectedMedia,
    execCommand
  });

  const { handleFileUpload } = useInsertFile({
    editorRef,
    onMediaStaged,
    handleContentChange
  });

  const { insertCode } = useInsertCodeInline({
    editorRef,
    handleContentChange
  });

  const { insertCodeBlock } = useInsertCodeBlock({
    editorRef,
    handleContentChange
  });

  const { insertQuote } = useInsertQuote({
    editorRef,
    execCommand
  });

  return (
    <div className="RichTextEditor-container">
      <div className="RichTextEditor-toolbar">
        {/* Heading Dropdown */}
        <div className="RichTextEditor-dropdown" ref={headingDropdownRef}>
          <Tooltip direction="bottom" content="Text format">
            <button
              className="RichTextEditor-dropdownButton pr text"
              onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
            >
              {selectedHeading}
              <span
                className={`RichTextEditor-dropdownArrow ${showHeadingDropdown ? "open" : ""}`}
              >
                <img src={chevronDown} alt="Select heading" />
              </span>
            </button>
          </Tooltip>

          {showHeadingDropdown && (
            <div className="RichTextEditor-dropdownMenu">
              {headingOptions.map(option => (
                <button
                  key={option.value}
                  className={`RichTextEditor-dropdownItem ${selectedHeading === option.value ? "selected" : ""}`}
                  onClick={() => formatHeading(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Align Dropdown */}
        <div className="RichTextEditor-dropdown" ref={alignDropdownRef}>
          <Tooltip direction="bottom" content="Text alignment">
            <button
              className="RichTextEditor-dropdownButton pr align"
              onClick={() => setShowAlignDropdown(!showAlignDropdown)}
            >
              <img src={left} alt="Text alignment" />
              <span
                className={`RichTextEditor-dropdownArrow ${showAlignDropdown ? "open" : ""}`}
              >
                <img src={chevronDown} alt="Text alignment" />
              </span>
            </button>
          </Tooltip>

          {showAlignDropdown && (
            <div className="RichTextEditor-dropdownMenu">
              {alignOptions.map(option => (
                <button
                  key={option.value}
                  className={classNames("RichTextEditor-dropdownItem", {
                    selected: selectedAlign === option.value
                  })}
                  onClick={() => formatAlign(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Picker */}
        <div className="RichTextEditor-colorPicker" ref={colorPickerRef}>
          <Tooltip direction="bottom" content="Text Color">
            <button
              className="RichTextEditor-dropdownButton pr"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <div
                className="picker"
                style={{ backgroundColor: selectedColor }}
              ></div>

              <span
                className={`RichTextEditor-dropdownArrow ${showColorPicker ? "open" : ""}`}
              >
                <img src={chevronDown} alt="Select color" />
              </span>
            </button>
          </Tooltip>

          {showColorPicker && (
            <div className="RichTextEditor-colorGrid">
              {colors.map(color => (
                <Tooltip
                  key={color.code}
                  direction="bottom"
                  content={color.title}
                >
                  <button
                    className="RichTextEditor-colorSwatch"
                    style={{ backgroundColor: color.code }}
                    onClick={() => formatColor(color.code)}
                  />
                </Tooltip>
              ))}
            </div>
          )}
        </div>

        {/* Format Buttons */}
        <Tooltip direction="bottom" content="Bold">
          <button
            className="RichTextEditor-button"
            onClick={() => toggleFormat("bold")}
          >
            <img src={bold} alt="Bold" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Italic">
          <button
            className="RichTextEditor-button"
            onClick={() => toggleFormat("italic")}
          >
            <img src={italic} alt="Italic" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Underline">
          <button
            className="RichTextEditor-button"
            onClick={() => toggleFormat("underline")}
          >
            <img src={underline} alt="Underline" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Strikethrough">
          <button
            className="RichTextEditor-button"
            onClick={() => toggleFormat("strikeThrough")}
          >
            <img src={strikethrough} alt="Strikethrough" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Insert link">
          <button className="RichTextEditor-button" onClick={openLinkDialog}>
            <img src={link} alt="Insert link" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Inline code">
          <button className="RichTextEditor-button" onClick={insertCode}>
            <img src={inlineCode} alt="Inline code" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Clear format">
          <button className="RichTextEditor-button pr" onClick={clearFormat}>
            <img src={clearFormatting} alt="Clear format" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Bullet list">
          <button
            className="RichTextEditor-button"
            onClick={() => toggleList("ul")}
          >
            <img src={bullet} alt="Bullet list" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Numbered list">
          <button
            className="RichTextEditor-button pr"
            onClick={() => toggleList("ol")}
          >
            <img src={number} alt="Numbered list" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Attach file">
          <button
            className="RichTextEditor-button"
            onClick={() => fileInputRef.current?.click()}
          >
            <img src={attach} alt="Attach file" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Insert image">
          <button
            className="RichTextEditor-button"
            onClick={() => imageInputRef.current?.click()}
          >
            <img src={image} alt="Insert image" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Insert video">
          <button
            className="RichTextEditor-button"
            onClick={() => videoInputRef.current?.click()}
          >
            <img src={video} alt="Insert video" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Code block">
          <button className="RichTextEditor-button" onClick={insertCodeBlock}>
            <img src={blockCode} alt="Code block" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Quote">
          <button className="RichTextEditor-button" onClick={insertQuote}>
            <img src={quote} alt="Quote" />
          </button>
        </Tooltip>

        <Tooltip direction="bottom" content="Horizontal rule">
          <button
            className="RichTextEditor-button"
            onClick={() => execCommand("insertHorizontalRule")}
          >
            <img src={line} alt="Horizontal rule" />
          </button>
        </Tooltip>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className={`RichTextEditor-editor ${isEmpty ? "empty" : ""}`}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        onClick={handleEditorClick}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <input
        ref={fileInputRef}
        type="file"
        className="RichTextEditor-hiddenInput"
        onChange={handleFileUpload}
      />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="RichTextEditor-hiddenInput"
        onChange={handleImageUpload}
      />

      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="RichTextEditor-hiddenInput"
        onChange={handleVideoUpload}
      />

      <MediaToolbar />

      <LinkDialogComponent
        show={showLinkDialog}
        linkText={linkText}
        linkUrl={linkUrl}
        onTextChange={setLinkText}
        onUrlChange={setLinkUrl}
        onCancel={handleCancelLink}
        onSave={handleSaveLink}
      />
    </div>
  );
};

export default RichTextEditor;
