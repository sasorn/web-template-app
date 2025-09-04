import React, { FC, useState, useCallback } from "react";
import BasicInformation from "../BasicInformation/BasicInformation";
import Skills from "../Skills/Skills";
import "./ProfileTemplate.less";

const ProfileTemplate: FC = () => {
  const [basicInfo, setBasicInfo] = useState({});
  const [basicTags, setBasicTags] = useState<string[]>([]);
  const [personal, setPersonal] = useState<string[]>([]);
  const [professional, setProfessional] = useState<string[]>([]);
  const [other, setOther] = useState<string[]>([]);

  // Memoized helper to get state and setter functions
  const getTagsAndSetter = useCallback(
    (containerId: string) => {
      switch (containerId) {
        case "basic":
          return { tags: basicTags, setTags: setBasicTags };
        case "personal":
          return { tags: personal, setTags: setPersonal };
        case "professional":
          return { tags: professional, setTags: setProfessional };
        case "other":
          return { tags: other, setTags: setOther };
        default:
          return { tags: [], setTags: () => {} };
      }
    },
    [basicTags, personal, professional, other]
  );

  // Improved atomic move handler
  const handleMoveTag = useCallback(
    (tag: string, originId: string, destId: string) => {
      if (originId === destId) return;

      const { tags: originTags, setTags: setOriginTags } =
        getTagsAndSetter(originId);
      const { tags: destTags, setTags: setDestTags } = getTagsAndSetter(destId);

      // Check if tag exists in origin and doesn't exist in destination
      if (!originTags.includes(tag) || destTags.includes(tag)) {
        return;
      }

      // Atomic update - update both states in the same render cycle
      setOriginTags(prev => prev.filter(t => t !== tag));
      setDestTags(prev => [...prev, tag]);
    },
    [getTagsAndSetter]
  );

  return (
    <div className="ProfileTemplate">
      <BasicInformation
        setBasicInfo={setBasicInfo}
        tags={basicTags}
        setTags={setBasicTags}
        onMoveTag={handleMoveTag}
      />

      <div className="ProfileTemplate-header">
        <h4>Skills and competencies</h4>
      </div>

      <Skills
        header="Personal"
        tags={personal}
        setTags={setPersonal} // Now properly passing setTags
        onMoveTag={handleMoveTag}
        containerId="personal"
        buttonText={"Add skill"}
      />

      <Skills
        header="Professional"
        tags={professional}
        setTags={setProfessional} // Now properly passing setTags
        onMoveTag={handleMoveTag}
        containerId="professional"
        buttonText={"Add skill"}
      />

      <Skills
        header="Other"
        tags={other}
        setTags={setOther} // Now properly passing setTags
        onMoveTag={handleMoveTag}
        containerId="other"
        buttonText={"Add skill"}
      />
    </div>
  );
};

export default ProfileTemplate;
