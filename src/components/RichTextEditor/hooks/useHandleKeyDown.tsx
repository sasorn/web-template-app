import { useCallback } from "react";
import type { KeyboardEvent } from "react";

interface UseHandleKeyDownProps {
  handleContentChange: () => void;
}

export const useHandleKeyDown = ({
  handleContentChange
}: UseHandleKeyDownProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        // Fallback to ensure content change is still triggered on simple key presses
        setTimeout(handleContentChange, 10);
        return;
      }

      const range = selection.getRangeAt(0);
      const node = range.startContainer;

      // --- Feature 1: Markdown-style inline code on space/enter ---
      if (
        (e.key === " " || e.key === "Enter") &&
        node.nodeType === Node.TEXT_NODE &&
        !node.parentElement?.closest("code, pre")
      ) {
        const textContent = node.textContent || "";
        const cursorPosition = range.startOffset;

        const textBeforeCursor = textContent.substring(0, cursorPosition);
        const match = textBeforeCursor.match(/`([^`]+)`$/);

        if (match) {
          e.preventDefault(); // Stop the default key action

          const codeText = match[1];
          const startIndex = textBeforeCursor.lastIndexOf(`\`${codeText}\``);

          // Select and replace the markdown text with a proper <code> element
          const replaceRange = document.createRange();
          replaceRange.setStart(node, startIndex);
          replaceRange.setEnd(node, cursorPosition);
          replaceRange.deleteContents();

          const codeNode = document.createElement("code");
          codeNode.textContent = codeText;
          range.insertNode(codeNode);

          // Insert a non-breaking space to move the cursor outside the new element
          const spaceNode = document.createTextNode("\u00A0");
          codeNode.parentNode?.insertBefore(spaceNode, codeNode.nextSibling);
          range.setStartAfter(spaceNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);

          setTimeout(handleContentChange, 10);
          return; // Stop further execution
        }
      }

      // --- Feature 2: Exit code blocks on "Enter" ---
      if (e.key === "Enter" && !e.shiftKey) {
        const parentPre = node.parentElement?.closest("pre");
        if (parentPre) {
          e.preventDefault(); // Stop default behavior (creating another <pre>)

          // Create a new editable line after the code block
          const newExitLine = document.createElement("div");
          newExitLine.innerHTML = "<br>";
          parentPre.insertAdjacentElement("afterend", newExitLine);

          // Move the cursor into the new line
          const newRange = document.createRange();
          newRange.setStart(newExitLine, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);

          setTimeout(handleContentChange, 10);
          return; // Stop further execution
        }
      }

      // Default case: for any other key press, just trigger a content change check
      setTimeout(handleContentChange, 10);
    },
    [handleContentChange]
  );

  return { handleKeyDown };
};
