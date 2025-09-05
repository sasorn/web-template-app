import React, { FC, useState, useCallback } from "react";

import BasicInformation from "../BasicInformation/BasicInformation";
import Skills from "../Skills/Skills";
import InputRadio from "../InputRadio/InputRadio";
import InputText from "../InputText/InputText";
import InputDropdown from "../InputDropdown/InputDropdown";
import SortList from "../SortList/SortList";
import Button from "../Button/Button";

import "./ProfileTemplate.less";

const requirementsOptions = [
  { label: "Drivers licence required", radio: ["Yes", "No"] },
  { label: "Security clearance required", radio: ["Yes", "No"] },
  { label: "Physical requirements", radio: ["Yes", "No"] },
  { label: "Pension", radio: ["Yes", "No"] },
  { label: "Company car", radio: ["Yes", "No"] }
];

const bonusOptions = [
  { label: "Bonus", radio: ["Yes", "No"] },
  { label: "Commision fee", radio: ["Yes", "No"] },
  { label: "Equity or stock options", radio: ["Yes", "No"] },
  { label: "Employee shares", radio: ["Yes", "No"] }
];

const currencyOptions = ["DKK", "GBP", "USD", "EUR"];

const durationOptions = ["Monthly", "Annually"];

interface RadioProps {
  [key: string]: string;
}

const initialValidationState = {
  minSalary: true,
  maxSalary: true,
  currency: true,
  duration: true
};

const ProfileTemplate: FC = () => {
  const [basicInfo, setBasicInfo] = useState({});
  const [basicTags, setBasicTags] = useState<string[]>([]);
  const [personal, setPersonal] = useState<string[]>([]);
  const [professional, setProfessional] = useState<string[]>([]);
  const [other, setOther] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<RadioProps>({});
  const [bonus, setBonus] = useState<RadioProps>({});
  const [minSalary, setMinSalary] = useState<string>("");
  const [maxSalary, setMaxSalary] = useState<string>("");
  const [currency, setCurrency] = useState<string>("DKK");
  const [duration, setDuration] = useState<string>("Monthly");
  const [skills, setSkills] = useState<string[]>([]);

  const [validationState, setValidationState] = useState(
    initialValidationState
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const isFormValid = () => {
    // is there any validation that failed?
    for (const entry in validationState) {
      const key = entry as keyof typeof validationState;

      if (!validationState[key]) {
        return false;
      }
    }
    return true;
  };

  const onChangeValidate = () => {
    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
    if (!isFormValid()) {
      setValidationState(initialValidationState);
    }
  };

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

  const handleRequirementsChange = (label: string, value: string) => {
    setRequirements(prevRequirements => ({
      ...prevRequirements,
      [label]: value
    }));
  };

  const handleBonusChange = (label: string, value: string) => {
    setBonus(prevRequirements => ({
      ...prevRequirements,
      [label]: value
    }));
  };

  const handleSkillsChange = (updatedSkills: string[]) => {
    setSkills(updatedSkills);
    // console.log("Skills updated in parent:", updatedSkills);
  };

  const handleSubmit = () => {
    console.log(
      basicInfo,
      "Skills:",
      { personal, professional, other },
      requirements,
      bonus,
      skills
    );
  };

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
        setTags={setPersonal}
        onMoveTag={handleMoveTag}
        containerId="personal"
        buttonText={"Add skill"}
      />

      <Skills
        header="Professional"
        tags={professional}
        setTags={setProfessional}
        onMoveTag={handleMoveTag}
        containerId="professional"
        buttonText={"Add skill"}
      />

      <Skills
        header="Other"
        tags={other}
        setTags={setOther}
        onMoveTag={handleMoveTag}
        containerId="other"
        buttonText={"Add skill"}
      />

      <div className="ProfileTemplate-radio">
        {requirementsOptions.map((option, index) => (
          <InputRadio
            key={index}
            id={`requirement-${index}`}
            label={option.label}
            options={option.radio}
            selectedValue={requirements[option.label]}
            onChange={(value: string) =>
              handleRequirementsChange(option.label, value)
            }
            valid={!!requirements[option.label]}
          />
        ))}
      </div>

      <div className="ProfileTemplate-header">
        <h4>Compensation</h4>
      </div>

      <div className="ProfileTemplate-Compensation">
        <p>Expected salary range</p>

        <div>
          <InputText
            label={"Minimum"}
            setValue={setMinSalary}
            validate={onChangeValidate}
            value={minSalary}
            valid={validationState.minSalary}
            id={"minSalary"}
            size="small"
          />

          <InputText
            label={"Maximum"}
            setValue={setMaxSalary}
            validate={onChangeValidate}
            value={maxSalary}
            valid={validationState.maxSalary}
            id={"maxSalary"}
            size="small"
          />

          <InputDropdown
            options={currencyOptions}
            setValue={setCurrency}
            validate={onChangeValidate}
            value={currency}
            valid={validationState.currency}
            id={"currency"}
            size="small"
          />

          <InputDropdown
            options={durationOptions}
            setValue={setDuration}
            validate={onChangeValidate}
            value={duration}
            valid={validationState.duration}
            id={"duration"}
            size="small"
          />
        </div>
      </div>

      <div className="ProfileTemplate-radio">
        {bonusOptions.map((option, index) => (
          <InputRadio
            key={index}
            id={`bonus-${index}`}
            label={option.label}
            options={option.radio}
            selectedValue={bonus[option.label]}
            onChange={(value: string) => handleBonusChange(option.label, value)}
            valid={!!bonus[option.label]}
          />
        ))}
      </div>

      <div className="ProfileTemplate-header">
        <h4>Other benefits</h4>
      </div>

      <SortList
        onSkillsChange={handleSkillsChange}
        placeholder={"Start by adding new benefit"}
        buttonText={"Add benefit"}
        label={"Add new benefit"}
      />

      <div className="buttons">
        <Button variant="cancel" size="small" onClick={() => {}}>
          Cancel
        </Button>
        <Button variant="light" size="small" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ProfileTemplate;
