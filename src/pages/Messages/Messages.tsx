import React, { FC } from "react";

import Header from "../../components/Header/Header";

import "./Messages.less";

const Messages: FC = () => {
  return (
    <div className="Messages">
      <Header label="Messages" />
    </div>
  );
};

export default Messages;
