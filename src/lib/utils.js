export const setStorage = (key, value, time) => {
  const now = new Date();
  // Calculate expiry, in hours) only if time is provided
  const expiry = time ? now.getTime() + time * 60 * 60 * 1000 : null;

  return localStorage.setItem(key, JSON.stringify({ ...value, expiry }));
};

export const getStorage = key => {
  const savedItem = localStorage.getItem(key);
  if (!savedItem) return null;

  const parsedItem = JSON.parse(savedItem);

  if (parsedItem.expiry) {
    const now = new Date().getTime();
    if (now > parsedItem.expiry) {
      localStorage.removeItem(key); // Remove the expired item
      return null; // Indicate the item has expired
    }
  }

  return parsedItem;
};

export const clearStorage = key => {
  return localStorage.removeItem(key);
};

export const clearStorageItem = (key, property) => {
  const savedItem = localStorage.getItem(key);
  if (!savedItem) return;

  const parsedItem = JSON.parse(savedItem);

  delete parsedItem[property];

  localStorage.setItem(key, JSON.stringify(parsedItem));
};

export const setSession = (key, value, time) => {
  const now = new Date();
  // Calculate expiry only if time is provided
  const expiry = time ? now.getTime() + time * 60 * 60 * 1000 : null;

  return sessionStorage.setItem(key, JSON.stringify({ ...value, expiry }));
};

// Get an item from session storage and check if it has expired
export const getSession = key => {
  const savedItem = sessionStorage.getItem(key);
  if (!savedItem) return null;

  const parsedItem = JSON.parse(savedItem);

  if (parsedItem.expiry) {
    const now = new Date().getTime();
    if (now > parsedItem.expiry) {
      sessionStorage.removeItem(key); // Remove the expired item
      return null; // Indicate the item has expired
    }
  }

  return parsedItem;
};

// Clear an item from session storage
export const clearSession = key => {
  return sessionStorage.removeItem(key);
};

export const bodyClass = (type, className) => {
  const trueType = ["add", "remove"].includes(type);
  !trueType && console.log("'you can only use type: 'add' || 'remove'");
  const scrollY = window.scrollY;

  if (type === "add") {
    document.body.style.top = scrollY;
    document.body.classList.add(className);
  }

  if (type === "remove") {
    document.body.style.removeProperty("top");
    if (document.body.classList.contains(className)) {
      document.body.classList.remove(className);
    } else {
      console.log("body doesn't have ", +className);
    }
  }
};

export const getInitials = name => {
  return name
    .split(" ")
    .filter(Boolean)
    .map(word => word[0].toUpperCase())
    .join("");
};

export const getScrollbarWidth = () => {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
};
