import React, {
  useState,
  useCallback,
  RefObject,
  FC,
  Dispatch,
  SetStateAction
} from "react";

// Assuming these paths are correct relative to this hook file
import InputText from "../../InputText/InputText";
import Button from "../../Button/Button";

import close from "../assets/close.svg";

// --- Helper Component ---
// This interface defines the props that the UI component accepts.
export interface LinkDialogComponentProps {
  show: boolean;
  linkText: string;
  linkUrl: string;
  onTextChange: Dispatch<SetStateAction<string>>;
  onUrlChange: Dispatch<SetStateAction<string>>;
  onCancel: () => void;
  onSave: () => void;
}

export const LinkDialogComponent: FC<LinkDialogComponentProps> = ({
  show,
  linkText,
  linkUrl,
  onTextChange,
  onUrlChange,
  onCancel,
  onSave
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="RichTextEditor-linkDialog">
      <div className="RichTextEditor-linkDialog-container">
        <div>
          <div className="RichTextEditor-linkDialog-close" onClick={onCancel}>
            <img src={close} alt="Close" />
          </div>
          <div className="RichTextEditor-linkDialog-wrapper">
            <div>
              <InputText
                label={"Text"}
                setValue={onTextChange}
                validate={() => true}
                value={linkText}
                valid={true}
                id={"link-text"}
              />
            </div>
            <div>
              <InputText
                label={"URL"}
                setValue={onUrlChange}
                validate={() => true}
                value={linkUrl}
                valid={true}
                id={"link-url"}
              />
            </div>
            <div className="RichTextEditor-linkDialog-buttons">
              <Button className="cancel" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="submit" onClick={onSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Custom Hook ---
interface UseInsertLinkProps {
  editorRef: RefObject<HTMLDivElement | null>;
  execCommand: (command: string, value?: string | boolean) => void;
}

export const useInsertLink = ({
  editorRef,
  execCommand
}: UseInsertLinkProps) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  const openLinkDialog = useCallback(() => {
    if (editorRef.current) editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    setSavedSelection(range);

    const parentElement = range.startContainer.parentElement;
    const linkElement = parentElement?.closest("a");

    setLinkText(linkElement?.textContent ?? selection.toString());
    setLinkUrl(linkElement?.getAttribute("href") ?? "");
    setShowLinkDialog(true);
  }, [editorRef]);

  const handleSaveLink = useCallback(() => {
    if (savedSelection && editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelection);

      const text = linkText.trim() || linkUrl;
      const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      execCommand("insertHTML", linkHTML);
    }
    setShowLinkDialog(false);
  }, [linkUrl, linkText, savedSelection, execCommand, editorRef]);

  const handleCancelLink = () => {
    setShowLinkDialog(false);
  };

  return {
    openLinkDialog,
    showLinkDialog,
    linkText,
    linkUrl,
    setLinkText,
    setLinkUrl,
    handleSaveLink,
    handleCancelLink
  };
};
