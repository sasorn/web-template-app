import React, { FC, useState, useEffect } from "react";
import { connect } from "react-redux";

import { openDialog } from "../../store/actions";

import Pagination from "../Pagination/Pagination";
import InputCheckbox from "../InputCheckbox/InputCheckbox";
import Button from "../Button/Button";

import mock from "./mock.json";

import dk from "./assets/dk.svg";
import en from "./assets/en.svg";
import check from "./assets/check.svg";
import folder from "./assets/folder.svg";
import chevronDown from "./assets/chevronDown.svg";

import "./Template.less";

interface TemplateProps {
  openCreateTemplateAction: Function;
}

const data: Array<any> = mock;

const Template: FC<TemplateProps> = ({ openCreateTemplateAction }) => {
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    Array(data.length).fill(false)
  );

  // Keep "checkedAll" in sync with individual items
  useEffect(() => {
    const allChecked = checkedItems.every(Boolean);
    const noneChecked = checkedItems.every(val => !val);
    if (allChecked && !checkedAll) setCheckedAll(true);
    if (!allChecked && checkedAll) setCheckedAll(false);
    if (noneChecked && checkedAll) setCheckedAll(false);
  }, [checkedItems, checkedAll]);

  const handlePageChange = (page: number) => {
    console.log("clicked page", page);
  };

  const handleFolderAction = (el: any) => {
    console.log("clicked page", el);
  };

  const handleTemplateAction = () => {
    openCreateTemplateAction();
  };

  const handleSelectAll = () => {
    const newValue = !checkedAll;
    setCheckedAll(newValue);
    setCheckedItems(Array(data.length).fill(newValue));
  };

  const handleOnChange = (index: number) => {
    setCheckedItems(prev => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  return (
    <div className="Template">
      <div className="Template-container">
        <Button variant="ghost" onClick={handleTemplateAction}>
          New template
        </Button>
        <Button variant="ghost" onClick={() => handleFolderAction("newFolder")}>
          New folder
        </Button>
      </div>

      <Pagination
        pages={12}
        current={2}
        total={118}
        onPageChange={handlePageChange}
      >
        <div className="Template-lists">
          <div className="Template-header">
            <div className="Template-header-checkbox">
              <InputCheckbox
                checked={checkedAll}
                setChecked={handleSelectAll}
                id="checkAll"
              />
            </div>

            <div className="folder">Template/Folder</div>
            <div className="dk">
              <img src={dk} alt="DK" />
            </div>
            <div className="en">
              <img src={en} alt="EN" />
            </div>
            <div className="access">Access</div>
            <div className="created">Created</div>
          </div>

          {data.map((item, index) => (
            <div key={index} className="Template-list">
              <div className="Template-list-checkbox">
                <InputCheckbox
                  checked={checkedItems[index]}
                  setChecked={() => handleOnChange(index)}
                  id={`check${index}`}
                />
              </div>

              <div className="folder">
                <img src={folder} alt={item.template} />
                {item.template}
                <span>
                  <img src={chevronDown} alt={item.template} />
                </span>
              </div>

              <div className="check dk">
                {item.region.includes("DA") && <img src={check} alt="DK" />}
              </div>
              <div className="check en">
                {item.region.includes("EN") && <img src={check} alt="EN" />}
              </div>
              <div className="access">
                <span>{item.access}</span>
              </div>
              <div className="created">
                <span>{item.created}</span>
              </div>
            </div>
          ))}
        </div>
      </Pagination>
    </div>
  );
};

export default connect(null, {
  openCreateTemplateAction: () => openDialog({ dialogName: "CREATE_TEMPLATE" })
})(Template);
