import React, { FC } from "react";

import Header from "../../components/Header/Header";

import "./Profile.less";

const Profile: FC = () => {
  return (
    <div className="Profile">
      <Header label="Profile type" />
    </div>
  );
};

export default Profile;
