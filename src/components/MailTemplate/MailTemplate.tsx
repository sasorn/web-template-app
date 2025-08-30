import React, { FC, useState } from "react";
import classNames from "classnames";

import { getStorage, setStorage } from "../../lib/utils";
import {
  validateText,
  validateEmail,
  validatePhoneNumber
} from "../../lib/validation";

import InputText from "../InputText/InputText";
import InputToggleText from "../InputToggleText/InputToggleText";
import RichTextEditor from "../RichTextEditor/RichTextEditor";

import "./MailTemplate.less";

import dk from "./assets/dk.svg";
import en from "./assets/en.svg";

interface MailTemplateProps {
  // [key: string]: string;
}

interface LanguageItem {
  [key: string]: string;
}

const lang: LanguageItem[] = [{ da: "Danish" }, { en: "English" }];

const flags: { [key: string]: string } = {
  da: dk,
  en: en
};

const placeholderText =
  "Imagine onboarding a new customer and helping them change whole recruitment process of how they hire - not based on a CV or gut feeling, but on potential, skills, and fairness. That's what you'll do at Openrecruit.";

const initialValidationState = {
  title: true,
  email: true,
  phone: true,
  subject: true,
  layout: true
};

const MailTemplate: FC<MailTemplateProps> = () => {
  const savedLang = getStorage("locale")?.active || "da";
  const [activeLanguage, setActiveLanguage] = useState(savedLang);

  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [layout, setLayout] = useState("");
  const [checked, setChecked] = useState<boolean>(false);

  const [validationState, setValidationState] = useState(
    initialValidationState
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const isFormValid = () => {
    // is there any validation that failed?
    for (const entry in validationState) {
      const key = entry as keyof typeof validationState;

      if (!validationState[key]) {
        return false;
      }
    }
    return true;
  };

  const onChangeValidate = () => {
    if (isButtonDisabled) {
      setIsButtonDisabled(false);
    }
    if (!isFormValid()) {
      setValidationState(initialValidationState);
    }
  };

  const toggleMenu = () => {
    setChecked(prev => {
      const newState = !prev;
      setStorage("menuToggle", { checked: newState }, 24); // save new state for 24 hours
      return newState;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Flag that will show a loading indicator
    setIsSubmitting(true);

    // Collect data from state
    const userData = {
      title,
      email,
      phone,
      subject,
      layout
    };

    // Run validation and collect responses in an object starting with the current validationState
    const state = {
      ...validationState,
      title: validateText(title),
      ...(checked
        ? { phone: validatePhoneNumber(email) }
        : { email: validateEmail(email) }),

      subject: validateText(title),
      layout: validateText(title)
    };

    setValidationState(state);

    // Empty values are not permitted on submit
    let isDataEntered = true;
    for (const entry in userData) {
      const key = entry as keyof typeof userData;

      if (userData[key] === "") {
        isDataEntered = false;
        state[key] = false;
      }
    }

    // If form is not valid, set the validationState and remove loading indicator
    if (!isDataEntered) {
      setIsSubmitting(false);
      return false;
    }

    console.log("submit data", userData);
  };

  const handleLanguageClick = (langKey: string) => {
    setActiveLanguage(langKey);
    setStorage("locale", { active: langKey });
  };

  return (
    <div className="MailTemplate">
      <div className="MailTemplate-container">
        <div className="MailTemplate-header">
          <h4>Language</h4>

          <div className="MailTemplate-header-content">
            {lang.map(item => {
              const key = Object.keys(item)[0];
              const name = item[key];

              return (
                <div
                  key={key}
                  onClick={() => handleLanguageClick(key)}
                  className={classNames("MailTemplate-language", {
                    active: activeLanguage === key
                  })}
                >
                  <img src={flags[key]} alt={name} />
                  <p>{name}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="MailTemplate-form">
          <div>
            <InputText
              label={"Title"}
              setValue={setTitle}
              validate={onChangeValidate}
              value={title}
              valid={validationState.title}
              id={"title"}
            />
          </div>

          <div>
            <InputToggleText
              label={"Email"}
              setValue={setEmail}
              validate={onChangeValidate}
              value={email}
              valid={validationState.email}
              id={"email"}
              labelNext={"Phone"}
              setValueNext={setPhone}
              validateNext={onChangeValidate}
              valueNext={phone}
              validNext={validationState.phone}
              idNext={"phone"}
              checked={checked}
              setChecked={toggleMenu}
            />
          </div>

          <div>
            <InputText
              label={"Subject"}
              setValue={setSubject}
              validate={onChangeValidate}
              value={subject}
              valid={validationState.subject}
              id={"subject"}
            />
          </div>

          <div>
            <InputText
              label={"Layout"}
              setValue={setLayout}
              validate={onChangeValidate}
              value={layout}
              valid={validationState.layout}
              id={"layout"}
            />
          </div>

          <div>
            <RichTextEditor placeholder={placeholderText} />
          </div>
        </div>
      </div>
      <div className="MailTemplate-container">
        <div className="MailTemplate">is</div>
        <div className="MailTemplate">new</div>
        <div className="MailTemplate">Mail Template</div>
      </div>
    </div>
  );
};

export default MailTemplate;
