import { useCallback, RefObject } from "react";

interface useInsertCodeInlineProps {
  editorRef: RefObject<HTMLDivElement | null>;
  handleContentChange: () => void;
}

export const useInsertCodeInline = ({
  editorRef,
  handleContentChange
}: useInsertCodeInlineProps) => {
  const insertCode = useCallback(() => {
    // Ensure the editor is focused before we attempt to get a selection
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const existingCodeElement =
      range.startContainer.parentElement?.closest("code");

    if (existingCodeElement) {
      // --- UNWRAP LOGIC ---
      // If the selection is already inside a <code> tag, unwrap it.
      const parent = existingCodeElement.parentNode;
      if (parent) {
        const fragment = document.createDocumentFragment();
        // Move all children of the <code> element to the fragment
        while (existingCodeElement.firstChild) {
          fragment.appendChild(existingCodeElement.firstChild);
        }
        // Replace the <code> element with its contents
        parent.replaceChild(fragment, existingCodeElement);
      }
    } else {
      // --- WRAP LOGIC ---
      // If it's plain text, wrap it in a <code> tag.
      const selectedText = selection.toString().trim();
      if (!selectedText) return; // Don't do anything if no text is selected

      // Delete the original selected text
      range.deleteContents();

      // Create and insert the new <code> node
      const codeNode = document.createElement("code");
      codeNode.textContent = selectedText;
      range.insertNode(codeNode);

      // Programmatically re-select the new node to keep it highlighted
      selection.removeAllRanges();
      range.selectNodeContents(codeNode);
      selection.addRange(range);
    }

    // Notify the parent component that the editor's content has changed
    handleContentChange();
  }, [editorRef, handleContentChange]);

  return { insertCode };
};
