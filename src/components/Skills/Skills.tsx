import React, { FC, useState } from "react";

import Tags from "../Tags/Tags";
import Button from "../Button/Button";

import "./Skills.less";

interface SkillsProps {
  header?: string;
  tags: string[];
  setTags: (tags: string[]) => void; // Added setTags prop
  buttonText: string;
  onMoveTag: (tag: string, originId: string, destId: string) => void;
  containerId: string;
}

const Skills: FC<SkillsProps> = ({
  header,
  tags,
  setTags, // Now properly using setTags
  buttonText,
  onMoveTag,
  containerId
}) => {
  const [showAddInput, setShowAddInput] = useState(false);

  const handleShowInput = () => {
    setShowAddInput(true);
  };

  const handleHideInput = () => {
    setShowAddInput(false);
  };

  return (
    <div className="Skills">
      {header && <h4>{header}</h4>}

      <div className="Skills-sub">
        Recommendation for skills used by others x
      </div>

      <Tags
        tags={tags}
        setTags={setTags} // Now properly passes setTags function
        buttonText={buttonText}
        onMoveTag={onMoveTag}
        containerId={containerId}
        showContainer={showAddInput}
      />

      <div className="Skills-buttons">
        {showAddInput ? (
          <Button variant="cancel" size="small" onClick={handleHideInput}>
            Cancel
          </Button>
        ) : (
          <Button variant="light" size="small" onClick={handleShowInput}>
            Add new skill
          </Button>
        )}
      </div>
    </div>
  );
};

export default Skills;
