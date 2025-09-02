import { useCallback, Dispatch, SetStateAction } from "react";

interface UseSimpleFormatsProps {
  execCommand: (command: string, value?: string | boolean) => void;
  setSelectedHeading: Dispatch<SetStateAction<string>>;
  setSelectedAlign: Dispatch<SetStateAction<string>>;
  setSelectedColor: Dispatch<SetStateAction<string>>;
}

export const useSimpleFormats = ({
  execCommand,
  setSelectedHeading,
  setSelectedAlign,
  setSelectedColor
}: UseSimpleFormatsProps) => {
  const toggleFormat = useCallback(
    (command: string) => {
      execCommand(command);
    },
    [execCommand]
  );

  const toggleList = useCallback(
    (listType: "ul" | "ol") => {
      const command =
        listType === "ul" ? "insertUnorderedList" : "insertOrderedList";
      execCommand(command);
    },
    [execCommand]
  );

  const clearFormat = useCallback(() => {
    execCommand("removeFormat");
    execCommand("formatBlock", "p");
    // This hook now also handles resetting the state of other hooks
    setSelectedHeading("Normal text");
    setSelectedAlign("Left");
    setSelectedColor("#000000");
  }, [execCommand, setSelectedHeading, setSelectedAlign, setSelectedColor]);

  const insertHorizontalRule = useCallback(() => {
    execCommand("insertHorizontalRule");
  }, [execCommand]);

  return { toggleFormat, toggleList, clearFormat, insertHorizontalRule };
};
