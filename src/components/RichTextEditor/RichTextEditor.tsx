import React, {
  FC,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo
} from "react";

import { getToolbarConfig, ToolbarActions } from "./config/toolbarConfig";

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

import { Toolbar } from "./components/Toolbar";
import Tooltip from "../Tooltip/Tooltip";

import { ASSETS } from "./config/assetsConfig";

import "./RichTextEditor.less";
import classNames from "classnames";

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  height?: string | number;
  onMediaStaged: (mediaId: string, file: File, blobUrl: string) => void;
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

  const [selectedHeading, setSelectedHeading] = useState("Normal text");

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

  const colors = ASSETS.data.colors;

  const handleContentChange = useCallback(() => {
    if (!editorRef.current || !onChange) return;

    const content = editorRef.current.innerHTML;
    const textContent = editorRef.current.textContent || "";

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

    onChange(content);
  }, [onChange]);

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
    const handleClickOutside = (event: MouseEvent) => {};

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

  const {
    headingDropdownRef,
    showHeadingDropdown,
    setShowHeadingDropdown,
    HeadingDropdown
  } = useFormatHeading({
    execCommand,
    headingOptions,
    selectedHeading,
    setSelectedHeading
  });

  const {
    alignDropdownRef,
    setSelectedAlign,
    showAlignDropdown,
    setShowAlignDropdown,
    AlignDropdown
  } = useFormatAlign({
    execCommand,
    alignOptions
  });

  const {
    colorPickerRef,
    selectedColor,
    setSelectedColor,
    showColorPicker,
    setShowColorPicker,
    ColorPicker
  } = useColorPicker({
    execCommand,
    colors,
    TooltipComponent: Tooltip
  });

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

  const toolbarConfig = useMemo(() => {
    const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) =>
      ref.current?.click();

    const actions: ToolbarActions = {
      toggleFormat,
      toggleList,
      clearFormat,
      insertHorizontalRule,
      openLinkDialog,
      insertCode,
      insertCodeBlock,
      insertQuote,
      triggerFileInput: ref => ref.current?.click()
    };

    const refs = { fileInputRef, imageInputRef, videoInputRef };

    return getToolbarConfig(actions, refs);
  }, [
    toggleFormat,
    toggleList,
    clearFormat,
    insertHorizontalRule,
    openLinkDialog,
    insertCode,
    insertCodeBlock,
    insertQuote
  ]);

  return (
    <div className="RichTextEditor-container">
      <div className="RichTextEditor-toolbar">
        <div className="RichTextEditor-dropdown" ref={headingDropdownRef}>
          <Tooltip direction="bottom" content="Text format">
            <button
              className="RichTextEditor-dropdownButton pr text"
              onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
            >
              {selectedHeading}
              <span
                className={classNames("RichTextEditor-dropdownArrow", {
                  open: showHeadingDropdown
                })}
              >
                <img src={ASSETS.icons.chevronDown} alt="Select heading" />
              </span>
            </button>
          </Tooltip>

          <HeadingDropdown />
        </div>

        <div className="RichTextEditor-dropdown" ref={alignDropdownRef}>
          <Tooltip direction="bottom" content="Text alignment">
            <button
              className="RichTextEditor-dropdownButton pr align"
              onClick={() => setShowAlignDropdown(!showAlignDropdown)}
            >
              <img src={ASSETS.icons.left} alt="Text alignment" />
              <span
                className={classNames("RichTextEditor-dropdownArrow", {
                  open: showAlignDropdown
                })}
              >
                <img src={ASSETS.icons.chevronDown} alt="Text alignment" />
              </span>
            </button>
          </Tooltip>

          <AlignDropdown />
        </div>

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
                className={classNames("RichTextEditor-dropdownArrow", {
                  open: showColorPicker
                })}
              >
                <img src={ASSETS.icons.chevronDown} alt="Select color" />
              </span>
            </button>
          </Tooltip>

          <ColorPicker />
        </div>

        <Toolbar config={toolbarConfig} TooltipComponent={Tooltip} />
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
