export const callbackByLocale = {
  "en-GB": callback =>
    require.ensure([], require => {
      callback();
    })
};

export default function loadIntlPolyfill(activeLocale, callback) {
  return callback();
}
