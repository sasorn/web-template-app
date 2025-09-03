import React from "react";
import { connect } from "react-redux";

import { goToRoute } from "../../store/actions";
import { getPageName } from "../../store/selectors";

import Notifications from "./components/Notifications/Notifications";
import Menu from "./components/Menu/Menu";

import "./Header.less";

interface HeaderProps {
  label: String;
  pageName: string;
  goToRouteAction: Function;
}

const items = [
  { name: "Overview", page: "templates" },
  { name: "Messages", count: "8", page: "messages" },
  { name: "Profile type", count: "8", page: "profile" },
  { name: "Themes", page: "themes" }
];

const Header: React.FC<HeaderProps> = ({
  label,
  pageName,
  goToRouteAction
}) => {
  return (
    <div className="Header">
      <Notifications />

      <div className="Header-container">
        <h1>{label}</h1>
      </div>

      <Menu
        pageName={pageName}
        data={items}
        goToRouteAction={goToRouteAction}
      />
    </div>
  );
};

export default connect(
  state => ({
    pageName: getPageName(state)
  }),
  {
    goToRouteAction: goToRoute
  }
)(Header);
