import React, { useState, useCallback, useRef, useEffect, FC } from "react";
import classNames from "classnames";

interface AlignDropdownComponentProps {
  show: boolean;
  alignOptions: { value: string; label: string }[];
  selectedAlign: string;
  formatAlign: (align: string) => void;
}

const AlignDropdownComponent: FC<AlignDropdownComponentProps> = ({
  show,
  alignOptions,
  selectedAlign,
  formatAlign
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="RichTextEditor-dropdownMenu">
      {alignOptions.map(option => (
        <button
          key={option.value}
          className={classNames("RichTextEditor-dropdownItem", {
            selected: selectedAlign === option.value
          })}
          onClick={() => formatAlign(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// --- Custom Hook ---
interface UseFormatAlignProps {
  execCommand: (command: string, value?: string | boolean) => void;
  alignOptions: { value: string; label: string }[];
}

export const useFormatAlign = ({
  execCommand,
  alignOptions
}: UseFormatAlignProps) => {
  const alignDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedAlign, setSelectedAlign] = useState("Left");
  const [showAlignDropdown, setShowAlignDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        alignDropdownRef.current &&
        !alignDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAlignDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatAlign = useCallback(
    (align: string) => {
      setSelectedAlign(align);
      setShowAlignDropdown(false);

      const alignValue = align.toLowerCase();
      if (alignValue === "left") {
        execCommand("justifyLeft");
      } else if (alignValue === "center") {
        execCommand("justifyCenter");
      } else if (alignValue === "right") {
        execCommand("justifyRight");
      }
    },
    [execCommand]
  );

  const AlignDropdown = useCallback(
    () => (
      <AlignDropdownComponent
        show={showAlignDropdown}
        alignOptions={alignOptions}
        selectedAlign={selectedAlign}
        formatAlign={formatAlign}
      />
    ),
    [showAlignDropdown, alignOptions, selectedAlign, formatAlign]
  );

  return {
    alignDropdownRef,
    selectedAlign,
    setSelectedAlign, // Expose for useSimpleFormats (clearFormat)
    showAlignDropdown,
    setShowAlignDropdown,
    formatAlign,
    AlignDropdown // The component to be rendered
  };
};
