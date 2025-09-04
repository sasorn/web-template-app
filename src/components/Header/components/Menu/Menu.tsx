import React from "react";
import classNames from "classnames";

import "./Menu.less";

interface MenuProps {
  pageName: String;
  data: Array<any>;
  goToRouteAction: Function;
}

const Menu: React.FC<MenuProps> = ({ pageName, goToRouteAction, data }) => {
  const handleClick = (el: String) => {
    goToRouteAction({ pageName: el });
  };

  return (
    <div className="Menu">
      <div className="Menu-items">
        {data.map((item, index) => (
          <div
            key={index}
            className={classNames("Menu-item", {
              active: item.active?.includes(pageName)
            })}
            onClick={() => handleClick(item.page)}
          >
            {item.name}

            {item.count ? (
              <span className="liquid-glass">{item.count}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
