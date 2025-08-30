export const routes = {
  home: "/",
  dashboard: "dashboard",
  account: "account",
  integration: "integration",
  templates: "templates",
  newMailTemplate: "templates/newMailTemplate",
  messages: "templates/messages",
  profile: "templates/profile",
  themes: "templates/themes",
  help: "help",
  settings: "settings",
  logout: "logout"
};

const prefix = "/";

export function buildUrlFrom({ pageName, dataQuery }) {
  if (!pageName) return false;
  if (pageName === "home") return "/";
  if (!routes[pageName]) return "404";

  let queryString = "";

  if (dataQuery && Object.keys(dataQuery).length > 0) {
    const params = new URLSearchParams(dataQuery);
    queryString = `/${params.toString()}`;
  }

  return prefix + routes[pageName] + queryString;
}

export function getPageByUrl(url) {
  const prefix = "/";

  if (url === routes.home) {
    return "home";
  }

  let bestMatchPage = null;
  let longestMatchLength = 0;

  for (const page in routes) {
    if (page === "home") {
      continue;
    }

    const routePath = prefix + routes[page];

    if (url.startsWith(routePath) && routePath.length > longestMatchLength) {
      longestMatchLength = routePath.length;
      bestMatchPage = page;
    }
  }

  return bestMatchPage;
}

export function getDataQueryFromUrl(url) {
  for (const page in routes) {
    const pageNameMayBeWithDataQuery = url.substring(
      url.indexOf(prefix) + prefix.length,
      url.length
    );

    if (pageNameMayBeWithDataQuery.indexOf(routes[page]) !== -1) {
      const dataQuery = pageNameMayBeWithDataQuery.split(routes[page])[0];
      if (dataQuery !== "") {
        return dataQuery.replace("/", "");
      }
    }
  }
  return null;
}

export function getUrlParameters(url) {
  const searchParams = new URLSearchParams(url);

  const map = {};

  for (const entry of searchParams) {
    map[entry[0]] = entry[1];
  }

  return map;
}
