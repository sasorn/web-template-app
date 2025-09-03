import React, { FC, useState, useEffect } from "react";
import { connect } from "react-redux";

import { goToRoute } from "../../../../store/actions";

import bell from "./assets/bell.svg";
import calendar from "./assets/calendar.svg";
import check from "./assets/check.svg";
import clock from "./assets/clock.svg";
import loader from "./assets/loader.svg";

import "./Notifications.less";

type NotificationType = "loader" | "clock" | "calendar" | "check" | "bell";

interface Notification {
  type: NotificationType;
  badge: boolean;
}

interface NotificationsProps {
  goToRouteAction: Function;
}

const iconsMap: Record<NotificationType, string> = {
  loader,
  clock,
  calendar,
  check,
  bell
};

const defaultNotifications: Notification[] = [
  { type: "loader", badge: false }, //FIXME: add pageName to each
  { type: "clock", badge: false }, //FIXME: add pageName to each
  { type: "calendar", badge: false }, //FIXME: add pageName to each
  { type: "check", badge: false }, //FIXME: add pageName to each
  { type: "bell", badge: true } //FIXME: add pageName to each
];

const Notifications: FC<NotificationsProps> = ({ goToRouteAction }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(defaultNotifications);
  }, []);

  const handleClick = (type: string) => {
    //FIXME: add pagename to defaultNotifications to use here
    //FIXME: goTORouteAction({pageName: type})
    console.log(type);
  };

  return (
    <div className="Notifications">
      <div className="Notifications-icons">
        {notifications.map(info => (
          <div
            onClick={() => handleClick(info.type)} //FIXME: replace info.type with info.pageName
            key={info.type}
            className="Notifications-icon"
          >
            <div className="liquid-glass">
              <img src={iconsMap[info.type]} alt={info.type} />
            </div>
            {info.badge && <span className="badge"></span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default connect(null, {
  goToRouteAction: goToRoute
})(Notifications);
