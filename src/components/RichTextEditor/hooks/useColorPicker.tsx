import { useState, useCallback, useRef, useEffect } from "react";

interface UseColorPickerProps {
  execCommand: (command: string, value?: string | boolean) => void;
}

export const useColorPicker = ({ execCommand }: UseColorPickerProps) => {
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // This effect handles closing the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatColor = useCallback(
    (color: string) => {
      setSelectedColor(color);
      execCommand("foreColor", color);
      setShowColorPicker(false); // Close picker after selection
    },
    [execCommand]
  );

  return {
    colorPickerRef,
    selectedColor,
    setSelectedColor, // Expose setter for clearFormat
    showColorPicker,
    setShowColorPicker,
    formatColor
  };
};
