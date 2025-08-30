import loadIntlPolyFill from "./loadIntlPolyfill";

export var callbackByLocale = {
  "en-GB": function (callback) {
    require.ensure([], function (require) {
      callback({
        messages: require("../locales/en-GB.json")
      });
    });
  }
};

export default function loadMessagesForLocale(locale, callback) {
  loadIntlPolyFill(locale, () => {
    if (Object.keys(callbackByLocale).indexOf(locale) !== -1) {
      return callbackByLocale[locale](({ messages }) => {
        return callback(null, { messages });
      });
    } else {
      return callback(new Error('Unsupported locale "' + locale + '".'));
    }
  });
}
