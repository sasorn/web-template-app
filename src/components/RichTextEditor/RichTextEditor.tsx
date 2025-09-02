import React, { FC, useRef, useState, useCallback, useEffect } from "react";

import Tooltip from "../Tooltip/Tooltip";

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
import video from "./assets/image.svg"; // Add video icon
import blockCode from "./assets/blockCode.svg";
import quote from "./assets/quote.svg";
import line from "./assets/line.svg";

import colors from "./assets/colors.json";

import "./RichTextEditor.less";

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  height?: string | number;
}

const RichTextEditor: FC<RichTextEditorProps> = ({
  initialValue = "",
  onChange,
  placeholder = "Type or paste your content here!"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const headingDropdownRef = useRef<HTMLDivElement>(null);
  const alignDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedHeading, setSelectedHeading] = useState("Normal text");
  const [selectedAlign, setSelectedAlign] = useState("Left");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showAlignDropdown, setShowAlignDropdown] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(
    null
  );
  const [selectedMedia, setSelectedMedia] = useState<HTMLElement | null>(null);

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
    const isCurrentlyEmpty = !textContent.trim() && !hasImages && !hasVideos;
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
      editorRef.current.innerHTML = "<p><br></p>";
      setIsEmpty(true);
    }
  }, [initialValue]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
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

  // Simple key handler - removed problematic DOM manipulation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Let browser handle Enter naturally - no DOM manipulation
      if (e.key === "Enter") {
        // Just trigger content change after browser handles it
        setTimeout(handleContentChange, 10);
      }
    },
    [handleContentChange]
  );

  const execCommand = useCallback(
    (command: string, value: string | boolean = false) => {
      document.execCommand(command, false, value as string);
      editorRef.current?.focus();
      handleContentChange();
    },
    [handleContentChange]
  );

  const formatHeading = useCallback(
    (heading: string) => {
      setSelectedHeading(heading);
      setShowHeadingDropdown(false);
      if (heading === "Normal text") {
        execCommand("formatBlock", "p");
      } else {
        const level = heading.replace("Heading ", "");
        execCommand("formatBlock", `h${level}`);
      }
    },
    [execCommand]
  );

  const formatAlign = useCallback(
    (align: string) => {
      setSelectedAlign(align);
      setShowAlignDropdown(false);
      const alignValue = align.toLowerCase();
      if (alignValue === "left") {
        execCommand("justifyLeft");
      } else if (alignValue === "center") {
        execCommand("justifyCenter");
      } else if (alignValue === "right") {
        execCommand("justifyRight");
      }
    },
    [execCommand]
  );

  const formatColor = useCallback(
    (color: string) => {
      setSelectedColor(color);
      execCommand("foreColor", color);
      setShowColorPicker(false);
    },
    [execCommand]
  );

  // Image upload with selection capability
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = event => {
        const result = event.target?.result;
        if (result && editorRef.current) {
          editorRef.current.focus();

          // Create unique ID for the image
          const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const img = `<img id="${imageId}" src="${result}" alt="${file.name}" style="max-width: 100%; height: auto; display: block; margin: 1em 0; cursor: pointer;" data-media-type="image" />`;
          execCommand("insertHTML", img);

          // Add click handler after insertion
          setTimeout(() => {
            const insertedImg = editorRef.current?.querySelector(
              `#${imageId}`
            ) as HTMLImageElement;
            if (insertedImg) {
              insertedImg.onclick = event => {
                event.preventDefault();
                event.stopPropagation();

                // Deselect previously selected media
                const prevSelected = editorRef.current?.querySelector(
                  '[style*="outline: 2px solid #3b82f6"]'
                );
                if (prevSelected) {
                  (prevSelected as HTMLElement).style.outline = "";
                }

                // Select this image
                insertedImg.style.outline = "2px solid #3b82f6";
                setSelectedImage(insertedImg);
                setSelectedMedia(insertedImg);
                editorRef.current?.focus();
              };
            }
          }, 100);
        }
      };

      reader.onerror = () => {
        alert("Failed to read the image file. Please try again.");
      };

      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [execCommand]
  );

  // Video upload with selection capability
  const handleVideoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("video/")) {
        alert("Please select a valid video file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = event => {
        const result = event.target?.result;
        if (result && editorRef.current) {
          editorRef.current.focus();

          // Create unique ID for the video
          const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const video = `<p><br></p><video id="${videoId}" controls style="max-width: 100%; height: auto; display: block; margin: 1em 0; cursor: pointer;" data-media-type="video">
          <source src="${result}" type="${file.type}">
          Your browser does not support the video tag.
        </video><p><br></p>`;
          execCommand("insertHTML", video);

          // Add click handler after insertion
          setTimeout(() => {
            const insertedVideo = editorRef.current?.querySelector(
              `#${videoId}`
            ) as HTMLVideoElement;
            if (insertedVideo) {
              insertedVideo.onclick = event => {
                // Only handle selection clicks, not video control clicks
                if ((event.target as HTMLElement).tagName === "VIDEO") {
                  event.preventDefault();
                  event.stopPropagation();

                  // Deselect previously selected media
                  const prevSelected = editorRef.current?.querySelector(
                    '[style*="outline: 2px solid #3b82f6"]'
                  );
                  if (prevSelected) {
                    (prevSelected as HTMLElement).style.outline = "";
                  }

                  // Select this video
                  insertedVideo.style.outline = "2px solid #3b82f6";
                  setSelectedImage(null);
                  setSelectedMedia(insertedVideo);
                  editorRef.current?.focus();
                }
              };
            }
          }, 100);
        }
      };

      reader.onerror = () => {
        alert("Failed to read the video file. Please try again.");
      };

      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [execCommand]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file && editorRef.current) {
        editorRef.current.focus();

        const fileName = file.name;
        const fileLink = `<a href="#" style="color: #3b82f6; text-decoration: underline;" data-file="${fileName}">📎 ${fileName}</a>`;
        execCommand("insertHTML", fileLink);
      }
      e.target.value = "";
    },
    [execCommand]
  );

  const insertCode = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();

    if (selectedText) {
      execCommand("insertHTML", `<code>${selectedText}</code>`);
    } else {
      execCommand("insertHTML", "<code>code</code>");
    }
  }, [execCommand]);

  const insertCodeBlock = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || "// Enter your code here";
    execCommand("insertHTML", `<pre><code>${selectedText}</code></pre>`);
  }, [execCommand]);

  const insertQuote = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || "Quote text here";
    execCommand("insertHTML", `<blockquote>${selectedText}</blockquote>`);
  }, [execCommand]);

  const toggleFormat = useCallback(
    (command: string) => {
      execCommand(command);
    },
    [execCommand]
  );

  const toggleList = useCallback(
    (listType: "ul" | "ol") => {
      const command =
        listType === "ul" ? "insertUnorderedList" : "insertOrderedList";
      execCommand(command);
    },
    [execCommand]
  );

  const clearFormat = useCallback(() => {
    execCommand("removeFormat");
    execCommand("formatBlock", "p");
    setSelectedHeading("Normal text");
    setSelectedAlign("Left");
    setSelectedColor("#000000");
  }, [execCommand]);

  // Media toolbar functions (works for both images and videos)
  const alignMedia = useCallback(
    (alignment: "left" | "center" | "right") => {
      if (!selectedMedia) return;

      switch (alignment) {
        case "left":
          selectedMedia.style.display = "block";
          selectedMedia.style.margin = "0 0 1em";
          break;
        case "center":
          selectedMedia.style.display = "block";
          selectedMedia.style.margin = "0 auto 1em";
          break;
        case "right":
          selectedMedia.style.display = "block";
          selectedMedia.style.margin = "0 0 1em auto";
          break;
      }
      handleContentChange();
    },
    [selectedMedia, handleContentChange]
  );

  const resizeMedia = useCallback(
    (size: "small" | "medium" | "large" | "full" | "original") => {
      if (!selectedMedia) return;

      switch (size) {
        case "small":
          selectedMedia.style.width = "200px";
          selectedMedia.style.maxWidth = "200px";
          break;
        case "medium":
          selectedMedia.style.width = "400px";
          selectedMedia.style.maxWidth = "400px";
          break;
        case "large":
          selectedMedia.style.width = "600px";
          selectedMedia.style.maxWidth = "600px";
          break;
        case "full":
          selectedMedia.style.width = "100%";
          selectedMedia.style.maxWidth = "100%";
          break;
        case "original":
          selectedMedia.style.width = "auto";
          selectedMedia.style.maxWidth = "100%";
          break;
      }
      handleContentChange();
    },
    [selectedMedia, handleContentChange]
  );

  // Handle clicks to deselect media
  const handleEditorClick = useCallback(
    (e: React.MouseEvent) => {
      if (selectedMedia && e.target !== selectedMedia) {
        selectedMedia.style.outline = "";
        setSelectedImage(null);
        setSelectedMedia(null);
      }
    },
    [selectedMedia]
  );

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
                  className={`RichTextEditor-dropdownItem ${selectedAlign === option.value ? "selected" : ""}`}
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
              className="RichTextEditor-colorButton pr"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <span style={{ backgroundColor: selectedColor }}></span>
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

      {/* Media Toolbar (for both images and videos) */}
      {selectedMedia && (
        <div className="RichTextEditor-mediaToolbar">
          <div>
            <label style={{ fontSize: "12px", marginRight: "8px" }}>
              Size:
            </label>
            <button
              className="RichTextEditor-mediaToolbarButton"
              onClick={() => resizeMedia("small")}
            >
              Small
            </button>
            <button
              className="RichTextEditor-mediaToolbarButton"
              onClick={() => resizeMedia("medium")}
            >
              Medium
            </button>
            <button
              className="RichTextEditor-mediaToolbarButton"
              onClick={() => resizeMedia("large")}
            >
              Large
            </button>
            <button
              className="RichTextEditor-mediaToolbarButton"
              onClick={() => resizeMedia("full")}
            >
              Full width
            </button>
            <button
              className="RichTextEditor-mediaToolbarButton"
              onClick={() => resizeMedia("original")}
            >
              Original
            </button>
          </div>

          <div
            style={{
              borderLeft: "1px solid #d1d5db",
              paddingLeft: "12px",
              marginLeft: "8px"
            }}
          >
            <label style={{ fontSize: "12px", marginRight: "8px" }}>
              Align:
            </label>
            <button
              className="RichTextEditor-mediaToolbarButton"
              onClick={() => alignMedia("left")}
            >
              Left
            </button>
            <button
              className="RichTextEditor-mediaToolbarButton"
              onClick={() => alignMedia("center")}
            >
              Center
            </button>
            <button
              className="RichTextEditor-mediaToolbarButton"
              onClick={() => alignMedia("right")}
            >
              Right
            </button>
          </div>

          <div
            style={{
              borderLeft: "1px solid #d1d5db",
              paddingLeft: "12px",
              marginLeft: "8px"
            }}
          >
            <button
              className="RichTextEditor-mediaToolbarButton"
              onClick={() => {
                if (selectedMedia) {
                  selectedMedia.remove();
                  setSelectedImage(null);
                  setSelectedMedia(null);
                  handleContentChange();
                }
              }}
              style={{ color: "#ef4444" }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default RichTextEditor;
