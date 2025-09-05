import React, { FC, useState, useRef, useEffect, Fragment } from "react";
import classNames from "classnames";

import Button from "../Button/Button";

import menu from "./assets/menu.svg";
import trash from "./assets/trash.svg";

import "./SortSkills.less";

interface SortSkillsProps {
  onSkillsChange: (skills: string[]) => void;
  buttonText: string;
  placeholder: string;
  label: string;
}

const DRAG_THRESHOLD = 5; // Pixels to move before drag starts

const SortSkills: FC<SortSkillsProps> = ({
  onSkillsChange,
  buttonText,
  placeholder,
  label
}) => {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [showAddInput, setShowAddInput] = useState(false);

  // Refs for DOM elements
  const listContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // State for Drag-and-Drop
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // use a ref for drag state that needs to be accessed inside
  // event listeners without causing the listeners to be re-added.
  const dragState = useRef<{
    ghostElement: HTMLDivElement | null;
    initialMouseY: number;
    initialTop: number;
  }>({ ghostElement: null, initialMouseY: 0, initialTop: 0 });

  // Notify parent component on skills change
  useEffect(() => {
    onSkillsChange(skills);
  }, [skills, onSkillsChange]);

  // --- Skill Creation Handlers ---
  const handleShowInput = () => setShowAddInput(true);

  const handleHideInput = () => {
    setShowAddInput(false);
    setNewSkill("");
    if (inputRef.current) inputRef.current.textContent = "";
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill) {
      setSkills(prev => [...prev, trimmedSkill]);
      setNewSkill("");
      if (inputRef.current) inputRef.current.textContent = "";
      inputRef.current?.focus();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();

    // get the list container height
    if (listContainerRef.current) {
      const height = listContainerRef.current.offsetHeight;
      listContainerRef.current.style.height = `${height}px`;
    }

    // Store initial mouse position and a ref to the ghost element
    const startY = e.clientY;
    let ghostElement: HTMLDivElement | null = null;

    // Use local variables for drag state to avoid async issues
    let localDraggedIndex: number | null = null;
    let localDragOverIndex: number | null = null;
    let dragPointOffsetY = 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // If drag hasn't started, check the threshold
      if (localDraggedIndex === null) {
        const deltaY = Math.abs(moveEvent.clientY - startY);

        if (deltaY > DRAG_THRESHOLD) {
          // --- DRAG STARTS NOW ---
          localDraggedIndex = index;
          setDraggedItemIndex(index); // Update state to apply .is-dragging class

          const originalElement = listContainerRef.current?.children[
            index
          ] as HTMLDivElement;
          if (!originalElement) return;

          const rect = originalElement.getBoundingClientRect();

          dragPointOffsetY = moveEvent.clientY - rect.top;

          ghostElement = originalElement.cloneNode(true) as HTMLDivElement;
          ghostElement.classList.add("SortSkills-ghost");
          Object.assign(ghostElement.style, {
            position: "fixed",
            top: `${rect.top}px`,
            left: `${rect.left + 40}px`,
            width: `${rect.width - 34}px`
          });
          document.body.appendChild(ghostElement);
        }
        return;
      }

      // If drag has started, move the ghost
      if (ghostElement) {
        // const top = moveEvent.clientY - (startY - ghostElement.offsetTop);
        const top = moveEvent.clientY - dragPointOffsetY;
        ghostElement.style.top = `${top}px`;
      }

      // Determine placeholder position
      if (!listContainerRef.current) return;
      const listItems = Array.from(listContainerRef.current.children).filter(
        child => child.classList.contains("SortSkills-skill")
      );

      let newDragOverIndex = skills.length;
      for (let i = 0; i < listItems.length; i++) {
        const item = listItems[i] as HTMLDivElement;
        const rect = item.getBoundingClientRect();
        if (moveEvent.clientY < rect.top + rect.height / 2) {
          newDragOverIndex = i;
          break;
        }
      }

      if (newDragOverIndex !== localDragOverIndex) {
        localDragOverIndex = newDragOverIndex;
        setDragOverIndex(newDragOverIndex);
      }
    };

    const handleMouseUp = () => {
      // --- Cleanup ---
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      ghostElement?.remove();

      // Reorder the array IF a drag actually happened
      if (localDraggedIndex !== null && localDragOverIndex !== null) {
        setSkills(currentSkills => {
          const newSkills = [...currentSkills];
          const [draggedItem] = newSkills.splice(localDraggedIndex!, 1);
          const finalIndex =
            localDragOverIndex! > localDraggedIndex!
              ? localDragOverIndex! - 1
              : localDragOverIndex!;
          newSkills.splice(finalIndex, 0, draggedItem);
          return newSkills;
        });
      }

      // Reset all state
      setDraggedItemIndex(null);
      setDragOverIndex(null);

      // Release the LIST container's height
      if (listContainerRef.current) {
        listContainerRef.current.style.height = "";
      }
    };

    // Attach the listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleDeleteSkill = (
    event: React.MouseEvent,
    indexToDelete: number
  ) => {
    // Prevent the mousedown event from starting a drag operation
    event.stopPropagation();

    // Update the skills state by filtering out the item at the specified index
    setSkills(currentSkills =>
      currentSkills.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    <div className="SortSkills">
      <div className="SortSkills-container" ref={listContainerRef}>
        {skills.map((skill, index) => (
          // Use a stable key
          <Fragment key={skill}>
            {dragOverIndex === index && draggedItemIndex !== index && (
              <div className="SortSkills-placeholder" />
            )}
            <div
              className={classNames("SortSkills-skill", {
                "is-dragging": draggedItemIndex === index
              })}
            >
              <div className="skill noselect">{skill}</div>
              <div
                className="handle noselect"
                onMouseDown={e => handleMouseDown(e, index)}
              >
                <img src={menu} alt="drag-handle" />
              </div>
              <div
                className="trash noselect"
                onClick={e => handleDeleteSkill(e, index)}
              >
                <img src={trash} alt="delete skill" />
              </div>
            </div>
          </Fragment>
        ))}

        {skills.length < 1 && (
          <div className="SortSkills-skill-empty">{placeholder}</div>
        )}

        {/* Placeholder for dropping at the very end of the list */}
        {dragOverIndex === skills.length && (
          <div className="SortSkills-placeholder" />
        )}
      </div>

      {showAddInput && (
        <div className="SortSkills-inputs">
          <div
            ref={inputRef}
            className="SortSkills-input"
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleInputKeyDown}
            onInput={e => setNewSkill(e.currentTarget.textContent || "")}
            data-placeholder={placeholder}
            role="textbox"
          />
          <Button variant="light" onClick={handleAddSkill}>
            {buttonText}
          </Button>
        </div>
      )}

      <div className="SortSkills-buttons">
        {showAddInput ? (
          <Button variant="cancel" size="small" onClick={handleHideInput}>
            Close
          </Button>
        ) : (
          <Button variant="light" size="small" onClick={handleShowInput}>
            {label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SortSkills;
