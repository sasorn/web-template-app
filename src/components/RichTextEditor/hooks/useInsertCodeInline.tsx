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
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    // Determine the node to start the search from
    const searchNode =
      commonAncestor.nodeType === Node.ELEMENT_NODE
        ? commonAncestor
        : commonAncestor.parentElement;

    const existingCodeElement = (searchNode as HTMLElement)?.closest("code");

    if (existingCodeElement) {
      // --- UNWRAP LOGIC ---
      const parent = existingCodeElement.parentNode;
      if (parent) {
        const fragment = document.createDocumentFragment();
        while (existingCodeElement.firstChild) {
          fragment.appendChild(existingCodeElement.firstChild);
        }
        parent.replaceChild(fragment, existingCodeElement);
      }
    } else {
      // --- WRAP LOGIC ---
      const selectedText = selection.toString().trim();
      if (!selectedText) return;

      range.deleteContents();
      const codeNode = document.createElement("code");
      codeNode.textContent = selectedText;
      range.insertNode(codeNode);

      selection.removeAllRanges();
      range.selectNodeContents(codeNode);
      selection.addRange(range);
    }

    handleContentChange();
  }, [editorRef, handleContentChange]);

  return { insertCode };
};
