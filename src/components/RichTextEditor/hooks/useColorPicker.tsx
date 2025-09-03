import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  FC,
  ComponentType
} from "react";

// (The TooltipProps, ColorPickerDropdownProps, and ColorPickerDropdown component remain the same)

interface TooltipProps {
  direction: "top" | "bottom" | "left" | "right";
  content: string;
  children: React.ReactNode;
}

interface ColorPickerDropdownProps {
  show: boolean;
  colors: { title: string; code: string }[];
  formatColor: (color: string) => void;
  TooltipComponent: ComponentType<TooltipProps>;
}

const ColorPickerDropdown: FC<ColorPickerDropdownProps> = ({
  show,
  colors,
  formatColor,
  TooltipComponent
}) => {
  if (!show) {
    return null;
  }
  return (
    <div className="RichTextEditor-colorGrid">
      {colors.map(color => (
        <TooltipComponent
          key={color.code}
          direction="bottom"
          content={color.title}
        >
          <button
            className="RichTextEditor-colorSwatch"
            style={{ backgroundColor: color.code }}
            onClick={() => formatColor(color.code)}
          />
        </TooltipComponent>
      ))}
    </div>
  );
};

// --- Custom Hook (Corrected Version) ---
interface UseColorPickerProps {
  execCommand: (command: string, value?: string | boolean) => void;
  colors: { title: string; code: string }[];
  TooltipComponent: ComponentType<TooltipProps>;
}

export const useColorPicker = ({
  execCommand,
  colors,
  TooltipComponent
}: UseColorPickerProps) => {
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

  // ✅ ADD THIS EFFECT TO READ THE CURRENT COLOR FROM THE EDITOR
  // This effect listens for cursor/selection changes inside the document.
  useEffect(() => {
    const handleSelectionChange = () => {
      // 'queryCommandValue' gets the style of the currently selected text.
      const currentColor = document.queryCommandValue("foreColor");
      if (currentColor) {
        setSelectedColor(currentColor);
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("selectionchange", handleSelectionChange);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []); // The empty dependency array ensures this runs only once.

  const formatColor = useCallback(
    (color: string) => {
      setSelectedColor(color);
      execCommand("foreColor", color);
      setShowColorPicker(false);
    },
    [execCommand]
  );

  const ColorPicker = useCallback(
    () => (
      <ColorPickerDropdown
        show={showColorPicker}
        colors={colors}
        formatColor={formatColor}
        TooltipComponent={TooltipComponent}
      />
    ),
    [showColorPicker, colors, formatColor, TooltipComponent]
  );

  return {
    colorPickerRef,
    selectedColor,
    setSelectedColor,
    showColorPicker,
    setShowColorPicker,
    formatColor,
    ColorPicker
  };
};
