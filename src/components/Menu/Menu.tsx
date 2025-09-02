import React, { useState } from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import { goToRoute } from "../../store/actions";

import { getInitials } from "../../lib/utils";

import { setStorage, getStorage } from "../../lib/utils";

import InputToggle from "../InputToggle/InputToggle";
import Tooltip from "../Tooltip/Tooltip";

import logo from "./assets/logo.svg";
import brand from "./assets/brand.svg";
import arrow from "./assets/arrow.svg";
import account from "./assets/account.svg";
import integration from "./assets/integration.svg";
import templates from "./assets/templates.svg";
import help from "./assets/help.svg";
import settings from "./assets/settings.svg";
import logout from "./assets/logout.svg";
import user from "./assets/user.svg";
import blank from "./assets/blank.svg";
import profile from "./assets/profile.svg";

import "./Menu.less";

interface MenuProps {
  pageName: String;
  goToRouteAction: Function;
}

interface MenuItem {
  name: string;
  page: String;
  image: string;
  classname: string;
}

interface UserMenuItem {
  name: string;
  avatar: any;
}

const topMenu: MenuItem[] = [
  {
    name: "Dashboard",
    image: arrow,
    page: "dashboard",
    classname: "dashboard"
  },
  { name: "Account", image: account, page: "account", classname: "account" },
  {
    name: "Integration",
    image: integration,
    page: "integration",
    classname: "integration"
  },
  {
    name: "Templates",
    image: templates,
    page: "templates",
    classname: "templates"
  }
];

const bottomMenu: MenuItem[] = [
  { name: "Help center", image: help, page: "help", classname: "help" },
  {
    name: "Settings",
    image: settings,
    page: "settings",
    classname: "settings"
  },
  { name: "Log out", image: logout, page: "logout", classname: "logout" }
];

const userData: UserMenuItem[] = [
  {
    name: "John Doe", // if name is not available, show default image
    avatar: profile // if profile image is unavailable, show initials
  }
];

const Menu: React.FC<MenuProps> = ({ pageName, goToRouteAction }) => {
  const savedMenuState = getStorage("menuToggle");

  const [checked, setChecked] = useState<boolean>(
    savedMenuState?.checked || false
  );

  const handleClick = (name: String) => {
    goToRouteAction({ pageName: name });
  };

  const toggleMenu = () => {
    setChecked(prev => {
      const newState = !prev;
      setStorage("menuToggle", { checked: newState }, 24); // save new state for 24 hours
      return newState;
    });
  };

  return (
    <div className="MainMenu">
      <div className={classNames("MainMenu-container", { active: checked })}>
        <div className="MainMenu-items top">
          <Tooltip content={"Home"} show={!checked} direction="right">
            <div
              className={classNames("MainMenu-item logo", { show: checked })}
              onClick={() => goToRouteAction({ pageName: "home" })}
            >
              <img src={logo} alt="logo" />

              <div>
                <img src={brand} alt="openreach" />
              </div>
            </div>
          </Tooltip>

          {topMenu.map(item => (
            <Tooltip
              key={item.classname}
              content={item.name}
              show={!checked}
              direction="right"
            >
              <div
                className={classNames("MainMenu-item", item.classname, {
                  show: checked,
                  active: pageName === item.classname
                })}
                onClick={() => handleClick(item.page)}
              >
                <img src={item.image} alt={item.classname} />

                <div>{item.name}</div>
              </div>
            </Tooltip>
          ))}
        </div>

        <div className="MainMenu-items bottom">
          {bottomMenu.map(item => (
            <Tooltip
              key={item.classname}
              content={item.name}
              show={!checked}
              direction="right"
            >
              <div
                className={classNames("MainMenu-item", item.classname, {
                  show: checked
                })}
                onClick={() => handleClick(item.page)}
              >
                <img src={item.image} alt={item.classname} />

                <div>{item.name}</div>
              </div>
            </Tooltip>
          ))}

          <div
            className={classNames("MainMenu-item profile", { show: checked })}
          >
            {userData && userData[0] ? (
              userData[0]?.avatar ? (
                <img src={userData[0].avatar} alt={userData[0]?.name} />
              ) : userData[0]?.name ? (
                <span>
                  <img src={blank} alt="user" />
                  <span>
                    {userData[0]?.name ? getInitials(userData[0].name) : "User"}
                  </span>
                </span>
              ) : null
            ) : (
              <img src={user} alt="user" />
            )}

            {userData[0]?.name && <div>{userData[0].name}</div>}
          </div>

          <div className={classNames("MainMenu-toggle", { show: checked })}>
            <InputToggle
              checked={checked}
              setChecked={toggleMenu}
              id="menuCheck"
            />

            <div className="text">Pin sidebar</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, {
  goToRouteAction: goToRoute
})(Menu);
