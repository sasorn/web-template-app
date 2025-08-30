// Place any fallbacks for the tests here

if (typeof matchMedia === "undefined") {
  window.matchMedia = () => ({
    matches: true
  });
}
