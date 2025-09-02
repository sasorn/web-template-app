import React, {
  useState,
  useCallback,
  FC,
  Dispatch,
  SetStateAction
} from "react";

// --- Helper UI Component for the Toolbar ---
interface MediaToolbarComponentProps {
  onAlign: (alignment: "left" | "center" | "right") => void;
  onResize: (size: "small" | "medium" | "large" | "full" | "original") => void;
  onDelete: () => void;
}

export const MediaToolbarComponent: FC<MediaToolbarComponentProps> = ({
  onAlign,
  onResize,
  onDelete
}) => {
  return (
    <div className="RichTextEditor-mediaToolbar">
      <div>
        <label>Size:</label>
        <button
          className="RichTextEditor-mediaToolbarButton"
          onClick={() => onResize("small")}
        >
          Small
        </button>
        <button
          className="RichTextEditor-mediaToolbarButton"
          onClick={() => onResize("medium")}
        >
          Medium
        </button>
        <button
          className="RichTextEditor-mediaToolbarButton"
          onClick={() => onResize("large")}
        >
          Large
        </button>
        <button
          className="RichTextEditor-mediaToolbarButton"
          onClick={() => onResize("full")}
        >
          Full width
        </button>
        <button
          className="RichTextEditor-mediaToolbarButton"
          onClick={() => onResize("original")}
        >
          Original
        </button>
      </div>
      <div>
        <label>Align:</label>
        <button
          className="RichTextEditor-mediaToolbarButton"
          onClick={() => onAlign("left")}
        >
          Left
        </button>
        <button
          className="RichTextEditor-mediaToolbarButton"
          onClick={() => onAlign("center")}
        >
          Center
        </button>
        <button
          className="RichTextEditor-mediaToolbarButton"
          onClick={() => onAlign("right")}
        >
          Right
        </button>
      </div>
      <div>
        <button
          className="RichTextEditor-mediaToolbarButton"
          onClick={onDelete}
          style={{ color: "#ef4444" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// --- The Custom Hook ---
interface UseMediaControlProps {
  handleContentChange: () => void;
}

export const useMediaControl = ({
  handleContentChange
}: UseMediaControlProps) => {
  const [selectedMedia, setSelectedMedia] = useState<HTMLElement | null>(null);

  const alignMedia = useCallback(
    (alignment: "left" | "center" | "right") => {
      if (!selectedMedia) return;
      selectedMedia.style.display = "block";
      selectedMedia.style.margin =
        alignment === "left"
          ? "0 0 1em"
          : alignment === "center"
            ? "0 auto 1em"
            : "0 0 1em auto";
      handleContentChange();
    },
    [selectedMedia, handleContentChange]
  );

  const resizeMedia = useCallback(
    (size: "small" | "medium" | "large" | "full" | "original") => {
      if (!selectedMedia) return;
      const sizeMap = {
        small: "200px",
        medium: "400px",
        large: "600px",
        full: "100%",
        original: "auto"
      };
      selectedMedia.style.width = sizeMap[size];
      selectedMedia.style.maxWidth =
        sizeMap[size] === "auto" ? "100%" : sizeMap[size];
      handleContentChange();
    },
    [selectedMedia, handleContentChange]
  );

  const deleteMedia = useCallback(() => {
    if (selectedMedia) {
      selectedMedia.remove();
      setSelectedMedia(null);
      handleContentChange();
    }
  }, [selectedMedia, handleContentChange]);

  const handleEditorClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (selectedMedia && e.target !== selectedMedia) {
        selectedMedia.style.outline = "";
        setSelectedMedia(null);
      }
    },
    [selectedMedia]
  );

  const MediaToolbar = useCallback(() => {
    if (!selectedMedia) return null;
    return (
      <MediaToolbarComponent
        onAlign={alignMedia}
        onResize={resizeMedia}
        onDelete={deleteMedia}
      />
    );
  }, [selectedMedia, alignMedia, resizeMedia, deleteMedia]);

  return {
    selectedMedia,
    setSelectedMedia,
    handleEditorClick,
    MediaToolbar
  };
};
