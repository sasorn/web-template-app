import React, { FC, useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import close from "./assets/close.svg";
import classNames from "classnames";

import "./Tags.less";

interface TagsProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  buttonText: string;
  containerId: string;
  className?: string;
  onMoveTag?: (tag: string, originId: string, destId: string) => void;
  showContainer?: boolean;
  showPlaceholder?: boolean;
  placeholder: string;
}

const Tags: FC<TagsProps> = ({
  tags = [],
  setTags,
  buttonText,
  className,
  onMoveTag,
  containerId,
  showContainer = true,
  showPlaceholder = true,
  placeholder
}) => {
  const inputRef = useRef<HTMLSpanElement | null>(null);
  const wasFocusedRef = useRef<boolean>(false);
  const [dragOver, setDragOver] = useState(false);

  const placeCaretAtEnd = (el: Node | null) => {
    if (!el) return;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (!t || tags.includes(t)) return false;
    setTags([...tags, t]);
    return true;
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddInput = () => {
    const text = inputRef.current?.innerText || "";
    if (addTag(text)) {
      if (inputRef.current) {
        inputRef.current.innerText = "";
        // Only focus if container is shown
        if (showContainer) {
          inputRef.current.focus();
        }
      }
    }
  };

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, t: string) => {
    e.dataTransfer.setData("text/plain", t);
    e.dataTransfer.setData("originId", containerId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only clear dragOver if we're actually leaving this element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const tag = e.dataTransfer.getData("text/plain");
    const originId = e.dataTransfer.getData("originId");

    // Robustness checks
    if (!tag || !originId || originId === containerId || tags.includes(tag)) {
      return;
    }

    // Use the move handler if available
    if (onMoveTag) {
      onMoveTag(tag, originId, containerId);
    }
  };

  // --- Input Handlers ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleAddInput();
      return;
    }

    if (e.key === "Backspace") {
      const curText = (inputRef.current?.innerText || "").trim();
      if (!curText && tags.length > 0) {
        e.preventDefault();
        const lastTag = tags[tags.length - 1];
        removeTag(lastTag);

        // Put the removed tag text into the input for editing
        if (inputRef.current) {
          inputRef.current.innerText = lastTag + " ";
          inputRef.current.focus();
          placeCaretAtEnd(inputRef.current);
        }
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    if (el.innerText.includes("\n")) {
      el.innerText = el.innerText.replace(/\n/g, "");
      placeCaretAtEnd(el);
    }
  };

  // Focus management - only for container mode
  useEffect(() => {
    if (!showContainer) return;

    const el = inputRef.current;
    if (!el) return;

    const onFocus = () => (wasFocusedRef.current = true);
    const onBlur = () => (wasFocusedRef.current = false);

    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);

    return () => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    };
  }, [showContainer]);

  useEffect(() => {
    if (showContainer && wasFocusedRef.current && inputRef.current) {
      inputRef.current.focus();
      placeCaretAtEnd(inputRef.current);
    }
    wasFocusedRef.current = false;
  }, [tags.length, showContainer]);

  const renderTag = (t: string) => (
    <div
      key={t}
      className="tag"
      contentEditable={false}
      draggable
      onDragStart={e => handleDragStart(e, t)}
    >
      <div className="tag-text">{t}</div>
      <div className="delete" onClick={() => removeTag(t)}>
        <img src={close} alt="Delete tag" />
      </div>
    </div>
  );

  return (
    <div className="Tags">
      {/* Placeholder Container */}
      {showPlaceholder && (
        <div
          className={classNames("Tags-placeholder", { dragOver })}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {tags.length === 0 && (
            <div className="Tags-placeholder-text">
              Add new skill or drop skill tags here...
            </div>
          )}
          {tags.map(renderTag)}
        </div>
      )}

      {/* Input + Button Container */}
      {showContainer && (
        <div className="Tags-tags">
          <div
            className={classNames("Tags-container", { dragOver }, className)}
            onClick={() => inputRef.current?.focus()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {!showPlaceholder && tags.map(renderTag)}
            <span
              ref={inputRef}
              className="tag-input"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              data-placeholder={placeholder}
              role="textbox"
              style={{ outline: "none", minWidth: "1ch" }}
            />
          </div>
          <Button variant="light" onClick={handleAddInput}>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tags;
