import React, { FC, useRef, useState, useCallback, useEffect } from "react";

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

  // Initialize editor with proper paragraph structure
  const initializeEditor = useCallback(() => {
    if (!editorRef.current) return;

    if (initialValue) {
      editorRef.current.innerHTML = initialValue;
      setIsEmpty(false);
    } else {
      // Start with an empty paragraph for consistent structure
      editorRef.current.innerHTML = "<p><br></p>";
      setIsEmpty(true);
    }

    // Set focus to the paragraph if empty
    if (!initialValue) {
      const firstP = editorRef.current.querySelector("p");
      if (firstP) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(firstP, 0);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [initialValue]);

  useEffect(() => {
    initializeEditor();
  }, [initializeEditor]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close color picker
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }

      // Close heading dropdown
      if (
        headingDropdownRef.current &&
        !headingDropdownRef.current.contains(event.target as Node)
      ) {
        setShowHeadingDropdown(false);
      }

      // Close align dropdown
      if (
        alignDropdownRef.current &&
        !alignDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAlignDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Enhanced content cleaning function
  const cleanEmptyElements = useCallback((html: string) => {
    // Remove empty elements with just <br> or whitespace
    let cleaned = html
      // Remove empty divs with just <br>
      .replace(/<div[^>]*>\s*<br[^>]*>\s*<\/div>/gi, "")
      // Remove empty paragraphs with just <br>
      .replace(/<p[^>]*>\s*<br[^>]*>\s*<\/p>/gi, "")
      // Remove empty headings with just <br>
      .replace(/<h[1-6][^>]*>\s*<br[^>]*>\s*<\/h[1-6]>/gi, "")
      // Remove empty divs
      .replace(/<div[^>]*>\s*<\/div>/gi, "")
      // Remove empty paragraphs
      .replace(/<p[^>]*>\s*<\/p>/gi, "")
      // Remove empty headings
      .replace(/<h[1-6][^>]*>\s*<\/h[1-6]>/gi, "")
      // Remove empty spans
      .replace(/<span[^>]*>\s*<\/span>/gi, "")
      // Remove empty strong/b tags
      .replace(/<(strong|b)[^>]*>\s*<\/(strong|b)>/gi, "")
      // Remove empty em/i tags
      .replace(/<(em|i)[^>]*>\s*<\/(em|i)>/gi, "")
      // Remove empty u tags
      .replace(/<u[^>]*>\s*<\/u>/gi, "")
      // Clean up multiple consecutive <br> tags (more than 2)
      .replace(/(<br[^>]*>\s*){3,}/gi, "<br><br>")
      // Remove leading/trailing <br> tags
      .replace(/^(\s*<br[^>]*>\s*)+/gi, "")
      .replace(/(\s*<br[^>]*>\s*)+$/gi, "");

    // If the content is completely empty or just whitespace/br tags, return empty string
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleaned;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    // Check if there's any meaningful content (text or images)
    const hasImages = cleaned.match(/<img[^>]*>/i);
    const hasOtherContent = cleaned.match(/<(?!br\s*\/?>)[^>]+>/i); // Any tag except <br>

    if (!textContent.trim() && !hasImages && !hasOtherContent) {
      return "";
    }

    return cleaned;
  }, []);

  // Enhanced content change handler with paragraph enforcement
  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return;

    // Ensure content is wrapped in paragraphs
    const ensureParagraphStructure = () => {
      const editor = editorRef.current!;
      const childNodes = Array.from(editor.childNodes);

      childNodes.forEach(node => {
        // If we have a text node or inline element at the root level, wrap it in a paragraph
        if (
          node.nodeType === Node.TEXT_NODE ||
          (node.nodeType === Node.ELEMENT_NODE &&
            ![
              "P",
              "H1",
              "H2",
              "H3",
              "H4",
              "H5",
              "H6",
              "BLOCKQUOTE",
              "PRE",
              "UL",
              "OL",
              "HR",
              "DIV"
            ].includes((node as Element).tagName))
        ) {
          const p = document.createElement("p");
          node.parentNode?.insertBefore(p, node);
          p.appendChild(node);
        }
      });

      // If editor is completely empty, add an empty paragraph
      if (
        editor.childNodes.length === 0 ||
        (editor.childNodes.length === 1 && editor.textContent?.trim() === "")
      ) {
        editor.innerHTML = "<p><br></p>";
      }
    };

    ensureParagraphStructure();

    // Check if editor is empty and update state
    const content = editorRef.current.innerHTML;
    const textContent = editorRef.current.textContent || "";
    const hasImages = content.includes("<img");
    const hasOtherContent = content.match(/<(?!br\s*\/?>|p[^>]*>|\/p>)[^>]+>/i);
    const isCurrentlyEmpty =
      !textContent.trim() && !hasImages && !hasOtherContent;

    setIsEmpty(isCurrentlyEmpty);

    if (onChange) {
      const rawHtml = editorRef.current.innerHTML;
      const cleanedHtml = cleanEmptyElements(rawHtml);

      // Only update if the cleaned content is different
      if (cleanedHtml !== rawHtml) {
        editorRef.current.innerHTML = cleanedHtml;
        // If content is completely empty after cleaning, reinitialize
        if (!cleanedHtml) {
          editorRef.current.innerHTML = "<p><br></p>";
          setIsEmpty(true);
        }
      }

      onChange(cleanedHtml);
    }
  }, [onChange, cleanEmptyElements]);

  // Handle key events for better paragraph management
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle Enter key to ensure new paragraphs are created properly
      if (e.key === "Enter" && !e.shiftKey) {
        // Let the browser handle the enter, but ensure it creates <p> tags
        setTimeout(() => {
          if (editorRef.current) {
            // Convert any <div> elements to <p> elements
            const divs = editorRef.current.querySelectorAll("div");
            divs.forEach(div => {
              if (
                !div.querySelector(
                  "p, h1, h2, h3, h4, h5, h6, blockquote, pre, ul, ol"
                )
              ) {
                const p = document.createElement("p");
                p.innerHTML = div.innerHTML || "<br>";
                div.parentNode?.replaceChild(p, div);
              }
            });
            handleContentChange();
          }
        }, 0);
      }

      // Handle backspace/delete for better empty element cleanup
      if (e.key === "Backspace" || e.key === "Delete") {
        setTimeout(() => {
          handleContentChange();
        }, 0);
      }
    },
    [handleContentChange]
  );

  const getSelectedText = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    return { selection, range, selectedText };
  }, []);

  const execCommand = useCallback(
    (command: string, value: string | boolean = false) => {
      document.execCommand(command, false, value as string);
      editorRef.current?.focus();
      // Use setTimeout to allow DOM to update before cleaning
      setTimeout(() => {
        handleContentChange();
      }, 0);
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

  const insertCode = useCallback(() => {
    const selectionData = getSelectedText();
    if (!selectionData) return;

    const { selection, range, selectedText } = selectionData;

    // Check if the parent is already a code element
    const parentElement =
      range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentElement
        : (range.commonAncestorContainer as HTMLElement);

    if (parentElement?.tagName === "CODE") {
      // Remove code formatting
      const textNode = document.createTextNode(
        selectedText || parentElement.textContent || ""
      );
      parentElement.parentNode?.replaceChild(textNode, parentElement);
    } else {
      // Apply code formatting
      const code = document.createElement("code");
      code.style.backgroundColor = "#f3f4f6";
      code.style.padding = "2px 4px";
      code.style.borderRadius = "3px";
      code.style.fontFamily = "monospace";
      code.style.fontSize = "0.9em";

      if (!range.collapsed) {
        const contents = range.extractContents();
        code.appendChild(contents);
        range.insertNode(code);
      } else {
        code.textContent = "code";
        range.insertNode(code);
      }

      // Move cursor to end of code element
      range.selectNodeContents(code);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    editorRef.current?.focus();
    handleContentChange();
  }, [getSelectedText, handleContentChange]);

  const clearFormat = useCallback(() => {
    execCommand("removeFormat");
    execCommand("formatBlock", "p");
    setSelectedHeading("Normal text");
    setSelectedAlign("Left");
    setSelectedColor("#000000");
  }, [execCommand]);

  const insertCodeBlock = useCallback(() => {
    const selectionData = getSelectedText();
    if (!selectionData) return;

    const { selection, range, selectedText } = selectionData;

    // Check if we're inside a pre/code block
    let currentNode: Node | null = range.commonAncestorContainer;
    let isInCodeBlock = false;

    while (currentNode && currentNode !== editorRef.current) {
      if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const element = currentNode as HTMLElement;
        if (
          element.tagName === "PRE" ||
          (element.tagName === "CODE" &&
            element.parentElement?.tagName === "PRE")
        ) {
          isInCodeBlock = true;
          break;
        }
      }
      currentNode = currentNode.parentNode;
    }

    if (isInCodeBlock && currentNode) {
      // Remove code block formatting
      const pre =
        currentNode.nodeType === Node.ELEMENT_NODE &&
        (currentNode as HTMLElement).tagName === "PRE"
          ? (currentNode as HTMLElement)
          : (currentNode as HTMLElement).parentElement;

      if (pre) {
        const p = document.createElement("p");
        p.textContent = pre.textContent || "";
        pre.parentNode?.replaceChild(p, pre);
      }
    } else {
      // Apply code block formatting
      const pre = document.createElement("pre");
      pre.style.backgroundColor = "#1f2937";
      pre.style.color = "#f3f4f6";
      pre.style.padding = "16px";
      pre.style.borderRadius = "6px";
      pre.style.overflowX = "auto";
      pre.style.fontFamily = "monospace";
      pre.style.margin = "10px 0";

      const code = document.createElement("code");

      if (!range.collapsed && selectedText) {
        const contents = range.extractContents();
        code.appendChild(contents);
      } else {
        code.textContent = "// Enter your code here";
      }

      pre.appendChild(code);
      range.insertNode(pre);

      // Place cursor at the end of the code block
      const newRange = document.createRange();
      newRange.selectNodeContents(code);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    editorRef.current?.focus();
    handleContentChange();
  }, [getSelectedText, handleContentChange]);

  const insertQuote = useCallback(() => {
    const selectionData = getSelectedText();
    if (!selectionData) return;

    const { selection, range, selectedText } = selectionData;

    // Check if we're inside a blockquote
    let currentNode: Node | null = range.commonAncestorContainer;
    let isInQuote = false;

    while (currentNode && currentNode !== editorRef.current) {
      if (
        currentNode.nodeType === Node.ELEMENT_NODE &&
        (currentNode as HTMLElement).tagName === "BLOCKQUOTE"
      ) {
        isInQuote = true;
        break;
      }
      currentNode = currentNode.parentNode;
    }

    if (isInQuote && currentNode) {
      // Remove quote formatting and wrap in paragraph
      const blockquote = currentNode as HTMLElement;
      const p = document.createElement("p");
      p.textContent = blockquote.textContent || "";
      blockquote.parentNode?.replaceChild(p, blockquote);
    } else {
      // Apply quote formatting
      const blockquote = document.createElement("blockquote");
      blockquote.style.borderLeft = "4px solid #d1d5db";
      blockquote.style.paddingLeft = "16px";
      blockquote.style.margin = "10px 0";
      blockquote.style.color = "#6b7280";
      blockquote.style.fontStyle = "italic";

      if (!range.collapsed && selectedText) {
        const contents = range.extractContents();
        blockquote.appendChild(contents);
      } else {
        blockquote.textContent = "Quote text here";
      }

      range.insertNode(blockquote);

      // Place cursor at the end of the quote
      const newRange = document.createRange();
      newRange.selectNodeContents(blockquote);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    editorRef.current?.focus();
    handleContentChange();
  }, [getSelectedText, handleContentChange]);

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

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const fileName = file.name;
        const fileLink = `<a href="#" style="color: #3b82f6; text-decoration: underline;" data-file="${fileName}">📎 ${fileName}</a>`;
        execCommand("insertHTML", fileLink);
      }
      e.target.value = "";
    },
    [execCommand]
  );

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = event => {
          const img = `<img src="${event.target?.result}" style="max-width: 100%; height: auto; border-radius: 6px; margin: 10px 0;" alt="${file.name}" />`;
          execCommand("insertHTML", img);
        };
        reader.readAsDataURL(file);
      }
      e.target.value = "";
    },
    [execCommand]
  );

  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="RichTextEditor-container">
      <div className="RichTextEditor-toolbar">
        {/* Custom Heading Dropdown */}
        <div className="RichTextEditor-dropdown" ref={headingDropdownRef}>
          <button
            className="RichTextEditor-dropdownButton"
            onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
            title="Text format"
          >
            {selectedHeading}
            <span
              className={`RichTextEditor-dropdownArrow ${showHeadingDropdown ? "open" : ""}`}
            >
              ▼
            </span>
          </button>
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

        {/* Custom Align Dropdown */}
        <div className="RichTextEditor-dropdown" ref={alignDropdownRef}>
          <button
            className="RichTextEditor-dropdownButton"
            onClick={() => setShowAlignDropdown(!showAlignDropdown)}
            title="Text alignment"
          >
            {selectedAlign}
            <span
              className={`RichTextEditor-dropdownArrow ${showAlignDropdown ? "open" : ""}`}
            >
              ▼
            </span>
          </button>

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
          <button
            className="RichTextEditor-colorButton"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Text Color"
            style={{ color: selectedColor }}
          >
            A
          </button>
          {showColorPicker && (
            <div className="RichTextEditor-colorGrid">
              {colors.map(color => (
                <button
                  key={color}
                  className="RichTextEditor-colorSwatch"
                  style={{ backgroundColor: color }}
                  onClick={() => formatColor(color)}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("bold")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => toggleFormat("bold")}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("italic")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => toggleFormat("italic")}
          title="Italic"
        >
          <em>I</em>
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("underline")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => toggleFormat("underline")}
          title="Underline"
        >
          <u>U</u>
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("strike")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => toggleFormat("strikeThrough")}
          title="Strikethrough"
        >
          <s>S</s>
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("code")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={insertCode}
          title="Inline code"
        >
          {"< >"}
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("clear")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={clearFormat}
          title="Clear format"
        >
          clear format
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("bullet")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => toggleList("ul")}
          title="Bullet list"
        >
          bullet
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("numbered")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => toggleList("ol")}
          title="Numbered list"
        >
          numbered
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("attach")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => fileInputRef.current?.click()}
          title="Attach file"
        >
          attach
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("image")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => imageInputRef.current?.click()}
          title="Insert image"
        >
          image
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("codeblock")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={insertCodeBlock}
          title="Code block"
        >
          {"<code/>"}
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("quote")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={insertQuote}
          title="Quote"
        >
          quote
        </button>

        <button
          className="RichTextEditor-button"
          onMouseEnter={() => setHoveredButton("hr")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => execCommand("insertHorizontalRule")}
          title="Horizontal rule"
        >
          —
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className={`RichTextEditor-editor ${isEmpty ? "empty" : ""}`}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
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
    </div>
  );
};

export default RichTextEditor;
