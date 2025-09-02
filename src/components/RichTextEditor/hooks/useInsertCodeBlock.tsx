import { useCallback, RefObject } from "react";

interface UseInsertCodeBlockProps {
  editorRef: RefObject<HTMLDivElement | null>;
  handleContentChange: () => void;
}

export const useInsertCodeBlock = ({
  editorRef,
  handleContentChange
}: UseInsertCodeBlockProps) => {
  const insertCodeBlock = useCallback(() => {
    // Ensure the editor is focused before we begin
    if (editorRef.current) editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const existingPreElement =
      range.startContainer.parentElement?.closest("pre");

    if (existingPreElement) {
      // --- UNWRAP LOGIC ---
      // If the selection is already inside a <pre>, convert it back to a normal paragraph.
      const parent = existingPreElement.parentNode;
      if (parent) {
        const fragment = document.createDocumentFragment();
        while (existingPreElement.firstChild) {
          fragment.appendChild(existingPreElement.firstChild);
        }
        parent.replaceChild(fragment, existingPreElement);

        // Clean up the leftover <div> wrapper if it's empty
        if (parent.nodeType === Node.ELEMENT_NODE) {
          const parentElement = parent as Element;
          if (
            parentElement.tagName === "DIV" &&
            !parentElement.textContent?.trim()
          ) {
            parentElement.remove();
          }
        }
      }
    } else {
      // --- WRAP LOGIC ---
      // If it's not a code block, wrap the selection in a new <pre> block.
      const selectedText = selection.toString().trim();
      range.deleteContents(); // Clear the original selected text

      const containerDiv = document.createElement("div");
      const preNode = document.createElement("pre");
      preNode.setAttribute("data-placeholder", "// Enter your code here");
      preNode.textContent = selectedText || ""; // Use selected text or start empty

      containerDiv.appendChild(preNode);
      range.insertNode(containerDiv);

      // Programmatically move the cursor inside the new <pre> block
      const newRange = document.createRange();
      // Place cursor at the start of the <pre> tag's content
      newRange.setStart(preNode.firstChild || preNode, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    // Notify the parent component of the change
    handleContentChange();
  }, [editorRef, handleContentChange]);

  return { insertCodeBlock };
};
