// /hooks/useFormatAlign.tsx

import { useCallback, Dispatch, SetStateAction } from "react";

// Define the types for the arguments the hook will need
interface FormatAlignProps {
  execCommand: (command: string, value?: string | boolean) => void;
  setSelectedAlign: Dispatch<SetStateAction<string>>;
  setShowAlignDropdown: Dispatch<SetStateAction<boolean>>;
}

export const useFormatAlign = ({
  execCommand,
  setSelectedAlign,
  setShowAlignDropdown
}: FormatAlignProps) => {
  const formatAlign = useCallback(
    (align: string) => {
      // Set the state in the main component
      setSelectedAlign(align);
      setShowAlignDropdown(false);

      // Execute the correct command based on the align value
      const alignValue = align.toLowerCase();
      if (alignValue === "left") {
        execCommand("justifyLeft");
      } else if (alignValue === "center") {
        execCommand("justifyCenter");
      } else if (alignValue === "right") {
        execCommand("justifyRight");
      }
    },
    [execCommand, setSelectedAlign, setShowAlignDropdown]
  );

  // Return the function so the main component can use it
  return { formatAlign };
};
