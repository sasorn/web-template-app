import { useCallback, RefObject, Dispatch, SetStateAction } from "react";

interface UseInsertImageProps {
  editorRef: RefObject<HTMLDivElement | null>;
  onMediaStaged: (mediaId: string, file: File, blobUrl: string) => void;
  setSelectedMedia: Dispatch<SetStateAction<HTMLElement | null>>;
  handleContentChange: () => void;
}

export const useInsertImage = ({
  editorRef,
  onMediaStaged,
  setSelectedMedia,
  handleContentChange
}: UseInsertImageProps) => {
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/") || !editorRef.current) {
        return;
      }

      // Re-focus the editor to get a valid selection
      editorRef.current.focus();
      const selection = window.getSelection();
      if (!selection) return;

      // If no cursor exists, create one at the end of the editor
      if (selection.rangeCount === 0) {
        const newRange = document.createRange();
        newRange.selectNodeContents(editorRef.current);
        newRange.collapse(false); // Go to the end
        selection.addRange(newRange);
      }

      const mediaId = `image-${Date.now()}-${file.name}`;
      const blobUrl = URL.createObjectURL(file);
      onMediaStaged(mediaId, file, blobUrl);

      // --- Direct DOM Manipulation ---
      const range = selection.getRangeAt(0);
      range.deleteContents();

      const imgNode = document.createElement("img");
      imgNode.src = blobUrl;
      imgNode.alt = file.name;
      imgNode.setAttribute("data-media-id", mediaId);
      imgNode.style.maxWidth = "100%";
      imgNode.style.display = "block";
      imgNode.style.margin = "1em 0";
      imgNode.style.cursor = "pointer";

      const afterNode = document.createElement("div");
      afterNode.innerHTML = "<br>";

      range.insertNode(afterNode);
      range.insertNode(imgNode);

      // Add the click handler for selection
      imgNode.onclick = event => {
        event.preventDefault();
        event.stopPropagation();
        const prevSelected =
          editorRef.current?.querySelector('[style*="outline"]');
        if (prevSelected) (prevSelected as HTMLElement).style.outline = "";
        imgNode.style.outline = "2px solid #3b82f6";
        setSelectedMedia(imgNode);
      };

      // Move the cursor into the new line after the image
      const cursorRange = document.createRange();
      cursorRange.setStart(afterNode, 0);
      cursorRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(cursorRange);

      handleContentChange();
      if (e.target) e.target.value = "";
    },
    [editorRef, onMediaStaged, setSelectedMedia, handleContentChange]
  );

  return { handleImageUpload };
};
