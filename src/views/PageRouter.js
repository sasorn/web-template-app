import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getRouterParams } from "../store/selectors";

import DialogManager from "../components/DialogManager/DialogManager";

import Loading from "../pages/Loading/Loading";
import LoadError from "../pages/LoadError/LoadError";

import "./base.less";

const Menu = lazy(() => import("../components/Menu/Menu"));
const Home = lazy(() => import("../pages/Home/Home"));
const Templates = lazy(() => import("../pages/Templates/Templates"));
const NewMailTemplate = lazy(
  () => import("../pages/NewMailTemplate/NewMailTemplate")
);
const Messages = lazy(() => import("../pages/Messages/Messages"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Themes = lazy(() => import("../pages/Themes/Themes"));

export function PageRouter({ routerParams = {} }) {
  const pages = {
    home: (
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    ),
    templates: (
      <Suspense fallback={<Loading />}>
        <Templates />
      </Suspense>
    ),
    newMailTemplate: (
      <Suspense fallback={<Loading />}>
        <NewMailTemplate />
      </Suspense>
    ),
    messages: (
      <Suspense fallback={<Loading />}>
        <Messages />
      </Suspense>
    ),
    profile: (
      <Suspense fallback={<Loading />}>
        <Profile />
      </Suspense>
    ),
    themes: (
      <Suspense fallback={<Loading />}>
        <Themes />
      </Suspense>
    ),
    loading: <Loading />,
    loadError: <LoadError />
  };
  const pageName = routerParams.pageName;

  if (pages[pageName]) {
    return (
      <Suspense fallback={<Loading />}>
        <DialogManager />
        <section className="cp-openrecruit">
          <Menu pageName={pageName} />
          {pages[pageName]}
        </section>
      </Suspense>
    );
  }
  return null;
}

PageRouter.propTypes = {
  routerParams: PropTypes.object
};

export default connect(state => ({
  routerParams: getRouterParams(state)
}))(PageRouter);
