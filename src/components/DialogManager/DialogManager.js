import React, { lazy, Suspense } from "react";

import FullScreenLoader from "../FullscreenLoader/FullscreenLoader";

const DialogManager = lazy(
  () => import("./components/DialogManager/DialogManager")
);

const WelcomeDialogTest = lazy(() => import("../SuccessDialog/SuccessDialog"));
const CreateTemplateModal = lazy(
  () => import("../CreateTemplateModal/CreateTemplateModal")
);

const dialogComponents = {
  SUCCESS_DIALOG: WelcomeDialogTest,
  CREATE_TEMPLATE: CreateTemplateModal
};

const dManager = (...props) => (
  <Suspense fallback={<FullScreenLoader />}>
    <DialogManager dialogComponents={dialogComponents} {...props} />
  </Suspense>
);

dManager.displayName = "dManager";

export default dManager;
