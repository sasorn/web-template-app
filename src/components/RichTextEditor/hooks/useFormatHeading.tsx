import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  FC,
  Dispatch,
  SetStateAction
} from "react";
import classNames from "classnames";

// --- Helper UI Component for the Dropdown Menu ---
interface HeadingDropdownComponentProps {
  show: boolean;
  headingOptions: { value: string; label: string }[];
  selectedHeading: string;
  formatHeading: (heading: string) => void;
}

const HeadingDropdownComponent: FC<HeadingDropdownComponentProps> = ({
  show,
  headingOptions,
  selectedHeading,
  formatHeading
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="RichTextEditor-dropdownMenu">
      {headingOptions.map(option => (
        <button
          key={option.value}
          className={classNames("RichTextEditor-dropdownItem", {
            selected: selectedHeading === option.value
          })}
          onClick={() => formatHeading(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// --- Custom Hook ---
interface UseFormatHeadingProps {
  execCommand: (command: string, value?: string | boolean) => void;
  headingOptions: { value: string; label: string }[];
  selectedHeading: string;
  setSelectedHeading: Dispatch<SetStateAction<string>>;
}

export const useFormatHeading = ({
  execCommand,
  headingOptions,
  selectedHeading,
  setSelectedHeading
}: UseFormatHeadingProps) => {
  const headingDropdownRef = useRef<HTMLDivElement>(null);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headingDropdownRef.current &&
        !headingDropdownRef.current.contains(event.target as Node)
      ) {
        setShowHeadingDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatHeading = useCallback(
    (heading: string) => {
      setSelectedHeading(heading);
      setShowHeadingDropdown(false);

      if (heading === "Normal text") {
        execCommand("formatBlock", "p");
      } else {
        const level = heading.replace("Heading ", "");
        execCommand("formatBlock", `h${level}`);
      }
    },
    [execCommand, setSelectedHeading]
  );

  const HeadingDropdown = useCallback(
    () => (
      <HeadingDropdownComponent
        show={showHeadingDropdown}
        headingOptions={headingOptions}
        selectedHeading={selectedHeading}
        formatHeading={formatHeading}
      />
    ),
    [showHeadingDropdown, headingOptions, selectedHeading, formatHeading]
  );

  return {
    headingDropdownRef,
    showHeadingDropdown,
    setShowHeadingDropdown,
    formatHeading,
    HeadingDropdown // The component to be rendered
  };
};
