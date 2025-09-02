import React, { FC, useState, useEffect } from "react";
import classNames from "classnames";

import { getStorage, setStorage } from "../../lib/utils";
import { validateText } from "../../lib/validation";

import InputText from "../InputText/InputText";
import InputDropdown from "../InputDropdown/InputDropdown";
import InputToggle from "../InputToggle/InputToggle";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import Button from "../Button/Button";

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

const dropdownOptions = ["Layout 1", "Layout 2", "Layout 3", "Layout 4"];

const placeholderText =
  "Imagine onboarding a new customer and helping them change whole recruitment process of how they hire - not based on a CV or gut feeling, but on potential, skills, and fairness. That's what you'll do at Openrecruit.";

const initialValidationState = {
  title: true,
  email: true,
  phone: true,
  subject: true,
  layout: true
};

async function uploadFileToServer(file: File): Promise<{ url: string }> {
  console.log(`Uploading: ${file.name}`);
  // In a real app, this would use fetch() to post the file to your backend/S3/etc.
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  const permanentUrl = `https://cdn.your-service.com/media/${Date.now()}-${file.name}`;
  console.log(`Upload complete for ${file.name}, URL: ${permanentUrl}`);
  return { url: permanentUrl };
}

type StagedMedia = {
  file: File;
  blobUrl: string;
};

const MailTemplate: FC<MailTemplateProps> = () => {
  const savedLang = getStorage("locale")?.active || "da";
  const [activeLanguage, setActiveLanguage] = useState(savedLang);

  const [title, setTitle] = useState("");
  const [email, setEmail] = useState<boolean>(false);
  const [phone, setPhone] = useState<boolean>(false);
  const [subject, setSubject] = useState("");
  const [layout, setLayout] = useState("");
  const [content, setContent] = useState<any>(null);

  // A single state to hold ALL staged media (files, images, videos)
  const [stagedMedia, setStagedMedia] = useState<Map<string, StagedMedia>>(
    new Map()
  );

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

  // A single callback to handle staging any type of media
  const handleMediaStaged = (mediaId: string, file: File, blobUrl: string) => {
    setStagedMedia(prev => new Map(prev).set(mediaId, { file, blobUrl }));
    console.log("Media staged:", { mediaId, name: file.name, blobUrl });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Flag that will show a loading indicator
    setIsSubmitting(true);

    // --- Start File Upload Logic ---
    // 1. Parse the final HTML to find all media with a data-media-id
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const mediaElements = tempDiv.querySelectorAll("[data-media-id]");

    // 2. Identify which staged files are still active in the editor
    const activeMediaIds = new Set<string>();
    mediaElements.forEach(el => {
      const mediaId = el.getAttribute("data-media-id");
      if (mediaId) {
        activeMediaIds.add(mediaId);
      }
    });

    // 3. Filter the staged media map to get only the active files
    const mediaToUpload: { mediaId: string; data: StagedMedia }[] = [];
    for (const [mediaId, data] of stagedMedia.entries()) {
      if (activeMediaIds.has(mediaId)) {
        mediaToUpload.push({ mediaId, data });
      }
    }

    let finalContent = content;

    // 4. Upload active files and get their permanent URLs
    if (mediaToUpload.length > 0) {
      console.log(`Starting upload for ${mediaToUpload.length} media items...`);
      const uploadPromises = mediaToUpload.map(item =>
        uploadFileToServer(item.data.file).then(response => ({
          blobUrl: item.data.blobUrl,
          permanentUrl: response.url
        }))
      );

      const uploadResults = await Promise.all(uploadPromises);

      // 5. Replace all temporary blob URLs in the content with permanent URLs
      let updatedContent = finalContent;
      uploadResults.forEach(result => {
        console.log(
          `Replacing temporary URL ${result.blobUrl} with permanent URL ${result.permanentUrl}`
        );
        updatedContent = updatedContent.replaceAll(
          result.blobUrl,
          result.permanentUrl
        );
      });
      finalContent = updatedContent;
    }
    // --- End File Upload Logic ---

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

    const data = {
      ...userData,
      attachedFile: finalContent
    };

    console.log("submit data", data);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    console.log("cancel");
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

          <div className="MailTemplate-form-two">
            <div>
              <InputToggle
                checked={email}
                setChecked={setEmail}
                id="toggleCheck"
              />
              <p>Email</p>
            </div>

            <div>
              <InputToggle
                checked={phone}
                setChecked={setPhone}
                id="toggleCheck"
              />
              <p>Phone</p>
            </div>
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
            <InputDropdown
              label={"Layout"}
              options={dropdownOptions}
              setValue={setLayout}
              validate={onChangeValidate}
              value={layout}
              valid={validationState.layout}
              id={"layout"}
            />
          </div>

          <div className="editor">
            <RichTextEditor
              placeholder={placeholderText}
              onChange={setContent}
              onMediaStaged={handleMediaStaged}
            />
          </div>

          <div className="buttons">
            <Button className="cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="submit" onClick={() => handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="MailTemplate-preview">
        <h4>Preview</h4>

        <div className="MailTemplate-preview-container">
          <p>Title: {title}</p>
          <p>Email: {email ? "checked" : "unchecked"}</p>
          <p>Phone: {phone ? "checked" : "unchecked"}</p>
          <p>Subject: {subject}</p>
          <p>Layout: {layout}</p>
          <div dangerouslySetInnerHTML={{ __html: content || "" }}></div>
        </div>
      </div>
    </div>
  );
};

export default MailTemplate;
