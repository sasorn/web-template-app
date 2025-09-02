import { useCallback, RefObject } from "react";

interface UseInsertFileProps {
  editorRef: RefObject<HTMLDivElement | null>;
  onMediaStaged: (mediaId: string, file: File, blobUrl: string) => void;
  handleContentChange: () => void;
}

export const useInsertFile = ({
  editorRef,
  onMediaStaged,
  handleContentChange
}: UseInsertFileProps) => {
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editorRef.current) return;

      editorRef.current.focus();
      const selection = window.getSelection();
      if (!selection) return;

      if (selection.rangeCount === 0) {
        const newRange = document.createRange();
        newRange.selectNodeContents(editorRef.current);
        newRange.collapse(false);
        selection.addRange(newRange);
      }

      const mediaId = `file-${Date.now()}-${file.name}`;
      const blobUrl = URL.createObjectURL(file);
      onMediaStaged(mediaId, file, blobUrl);

      // --- Direct DOM Manipulation ---
      const range = selection.getRangeAt(0);
      range.deleteContents();

      const linkNode = document.createElement("a");
      linkNode.href = blobUrl;
      linkNode.target = "_blank";
      linkNode.setAttribute("data-media-id", mediaId);
      linkNode.style.color = "#3b82f6";
      linkNode.style.textDecoration = "underline";
      linkNode.textContent = `📎 ${file.name}`;

      // Insert a space after the link to allow typing
      const spaceNode = document.createTextNode("\u00A0"); // Non-breaking space

      range.insertNode(spaceNode);
      range.insertNode(linkNode);

      // Move the cursor to after the space
      range.setStartAfter(spaceNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      handleContentChange();
      if (e.target) e.target.value = "";
    },
    [editorRef, onMediaStaged, handleContentChange]
  );

  return { handleFileUpload };
};
