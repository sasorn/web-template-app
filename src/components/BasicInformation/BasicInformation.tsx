import React, { FC, useState } from "react";

import Tags from "../Tags/Tags";
import InputText from "../InputText/InputText";
import InputDropdown from "../InputDropdown/InputDropdown";

import "./BasicInformation.less";

const dropdownOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];

interface BasicInformationProps {
  setBasicInfo: (info: any) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  onMoveTag: (tag: string, originId: string, destId: string) => void;
}

const initialValidationState = {
  name: true,
  title: true,
  process: true,
  template: true,
  locations: true,
  department: true,
  role: true,
  tags: true
};

const BasicInformation: FC<BasicInformationProps> = ({
  setBasicInfo,
  tags,
  setTags,
  onMoveTag
}) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [process, setProcess] = useState("");
  const [template, setTemplate] = useState("");
  const [locations, setLocations] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");

  const [validationState, setValidationState] = useState(
    initialValidationState
  );

  const isFormValid = () => Object.values(validationState).every(v => v);

  const onChangeValidate = () => {
    if (!isFormValid()) setValidationState(initialValidationState);
    setBasicInfo({
      name,
      title,
      process,
      template,
      locations,
      department,
      role
    });
  };

  return (
    <div className="BasicInformation">
      <h4>Basic information</h4>

      <div className="BasicInformation-form">
        <div className="BasicInformation-two">
          <InputText
            label={"Name or profile type"}
            setValue={setName}
            validate={onChangeValidate}
            value={name}
            valid={validationState.name}
            id={"name"}
          />

          <InputText
            label={"Job Title"}
            setValue={setTitle}
            validate={onChangeValidate}
            value={title}
            valid={validationState.title}
            id={"title"}
          />
        </div>

        <div className="BasicInformation-two">
          <InputDropdown
            label={"Process"}
            options={dropdownOptions}
            setValue={setProcess}
            validate={onChangeValidate}
            value={process}
            valid={validationState.process}
            id={"process"}
          />

          <InputDropdown
            label={"Profile template"}
            options={dropdownOptions}
            setValue={setTemplate}
            validate={onChangeValidate}
            value={template}
            valid={validationState.template}
            id={"template"}
          />
        </div>

        <div className="BasicInformation-two">
          <InputDropdown
            label={"Locations"}
            options={dropdownOptions}
            setValue={setLocations}
            validate={onChangeValidate}
            value={locations}
            valid={validationState.locations}
            id={"locations"}
          />

          <InputDropdown
            label={"Departments"}
            options={dropdownOptions}
            setValue={setDepartment}
            validate={onChangeValidate}
            value={department}
            valid={validationState.department}
            id={"department"}
          />
        </div>

        <div className="BasicInformation-short">
          <InputDropdown
            label={"Roles"}
            options={dropdownOptions}
            setValue={setRole}
            validate={onChangeValidate}
            value={role}
            valid={validationState.role}
            id={"role"}
          />
        </div>

        <div className="BasicInformation-full">
          <Tags
            tags={tags}
            setTags={setTags}
            buttonText="Add tags"
            onMoveTag={onMoveTag}
            containerId="basic"
            showPlaceholder={false}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
