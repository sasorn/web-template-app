import { useCallback, RefObject, Dispatch, SetStateAction } from "react";

interface UseInsertVideoProps {
  editorRef: RefObject<HTMLDivElement | null>;
  onMediaStaged: (mediaId: string, file: File, blobUrl: string) => void;
  setSelectedMedia: Dispatch<SetStateAction<HTMLElement | null>>;
  execCommand: (command: string, value?: string | boolean) => void;
}

export const useInsertVideo = ({
  editorRef,
  onMediaStaged,
  setSelectedMedia,
  execCommand
}: UseInsertVideoProps) => {
  const handleVideoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("video/") || !editorRef.current) {
        return;
      }

      editorRef.current.focus();

      const mediaId = `video-${Date.now()}-${file.name}`;
      const blobUrl = URL.createObjectURL(file);

      // Notify the parent component to stage this video for the final upload
      onMediaStaged(mediaId, file, blobUrl);

      // Create the HTML string with surrounding divs for spacing
      const videoHTML = `
        <div><br></div>
        <video controls src="${blobUrl}" data-media-id="${mediaId}" style="max-width: 100%; display: block; margin: 1em 0; cursor: pointer;">
          Your browser does not support the video tag.
        </video>
        <div><br></div>`;

      execCommand("insertHTML", videoHTML);

      // Logic to make the newly inserted video selectable
      setTimeout(() => {
        const insertedVideo = editorRef.current?.querySelector(
          `[data-media-id="${mediaId}"]`
        ) as HTMLVideoElement;
        if (insertedVideo) {
          insertedVideo.onclick = event => {
            // Only handle selection clicks, not clicks on the video controls
            if ((event.target as HTMLElement).tagName === "VIDEO") {
              event.preventDefault();
              event.stopPropagation();

              // Deselect any previously selected media
              const prevSelected =
                editorRef.current?.querySelector('[style*="outline"]');
              if (prevSelected) {
                (prevSelected as HTMLElement).style.outline = "";
              }

              // Select this video and update the central state via the passed-in setter
              insertedVideo.style.outline = "2px solid #3b82f6";
              setSelectedMedia(insertedVideo);
            }
          };
        }
      }, 100); // A small delay to ensure the element is in the DOM

      if (e.target) e.target.value = "";
    },
    [editorRef, onMediaStaged, setSelectedMedia, execCommand]
  );

  return { handleVideoUpload };
};
