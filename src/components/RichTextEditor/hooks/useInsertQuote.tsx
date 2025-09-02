import { useCallback, RefObject } from "react";

interface UseInsertQuoteProps {
  editorRef: RefObject<HTMLDivElement | null>;
  execCommand: (command: string, value?: string | boolean) => void;
}

export const useInsertQuote = ({
  editorRef,
  execCommand
}: UseInsertQuoteProps) => {
  const insertQuote = useCallback(() => {
    // Ensure the editor is focused before executing a command
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Check if the selection is already inside a <blockquote>
    const isAlreadyQuote =
      range.startContainer.parentElement?.closest("blockquote");

    if (isAlreadyQuote) {
      // If it is, format the block back to a normal paragraph to "unwrap" it
      execCommand("formatBlock", "p");
    } else {
      // If it's not, apply the blockquote format
      execCommand("formatBlock", "blockquote");
    }
  }, [editorRef, execCommand]);

  return { insertQuote };
};
