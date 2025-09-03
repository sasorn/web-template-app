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
    if (editorRef.current) editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    const searchNode =
      commonAncestor.nodeType === Node.ELEMENT_NODE
        ? commonAncestor
        : commonAncestor.parentElement;

    const existingPreElement = (searchNode as HTMLElement)?.closest("pre");

    if (existingPreElement) {
      // --- UNWRAP LOGIC ---
      const parent = existingPreElement.parentNode;
      if (parent) {
        const fragment = document.createDocumentFragment();
        while (existingPreElement.firstChild) {
          fragment.appendChild(existingPreElement.firstChild);
        }
        parent.replaceChild(fragment, existingPreElement);

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
      const selectedText = selection.toString().trim();
      range.deleteContents();

      const containerDiv = document.createElement("div");
      const preNode = document.createElement("pre");
      preNode.setAttribute("data-placeholder", "// Enter your code here");
      preNode.textContent = selectedText || "";

      containerDiv.appendChild(preNode);
      range.insertNode(containerDiv);

      const newRange = document.createRange();
      newRange.setStart(preNode.firstChild || preNode, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    handleContentChange();
  }, [editorRef, handleContentChange]);

  return { insertCodeBlock };
};
