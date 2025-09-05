import React, { FC } from "react";

import Header from "../../components/Header/Header";
import ProfileTemplate from "../../components/ProfileTemplate/ProfileTemplate";

import "./NewProfileTemplate.less";

interface NewProfileTemplateProps {
  // Add your props here if needed
}

const NewProfileTemplate: FC<NewProfileTemplateProps> = () => {
  return (
    <div className="NewProfileTemplate">
      <Header label="New profile template" />

      <ProfileTemplate />
    </div>
  );
};

export default NewProfileTemplate;
