import { useCallback, Dispatch, SetStateAction } from "react";

// Define the arguments the hook will need
interface FormatHeadingProps {
  execCommand: (command: string, value: string) => void;
  setSelectedHeading: Dispatch<SetStateAction<string>>;
  setShowHeadingDropdown: Dispatch<SetStateAction<boolean>>;
}

export const useFormatHeading = ({
  execCommand,
  setSelectedHeading,
  setShowHeadingDropdown
}: FormatHeadingProps) => {
  const formatHeading = useCallback(
    (heading: string) => {
      // Set the state in the main component
      setSelectedHeading(heading);
      setShowHeadingDropdown(false);

      // Execute the command
      if (heading === "Normal text") {
        execCommand("formatBlock", "p");
      } else {
        const level = heading.replace("Heading ", "");
        execCommand("formatBlock", `h${level}`);
      }
    },
    [execCommand, setSelectedHeading, setShowHeadingDropdown]
  );

  // Return the function so the component can use it
  return { formatHeading };
};
