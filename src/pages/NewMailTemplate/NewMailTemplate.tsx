import React, { FC } from "react";

import Header from "../../components/Header/Header";
import MailTemplate from "../../components/MailTemplate/MailTemplate";

import "./NewMailTemplate.less";

const NewMailTemplate: FC = () => {
  return (
    <div className="NewMailTemplate">
      <Header label="New Mail Template" />

      <MailTemplate />
    </div>
  );
};

export default NewMailTemplate;
