import React, { FC } from "react";

import Header from "../../components/Header/Header";
import Template from "../../components/Template/Template";

import "./Templates.less";

const Templates: FC = () => {
  return (
    <div className="Templates">
      <Header label="Templates" />

      <Template />
    </div>
  );
};

export default Templates;
