const fakeIntl = {
  now: () => 0,
  formatMessage: ({ defaultMessage }) => defaultMessage,
  formatHTMLMessage: ({ defaultMessage }) => defaultMessage,
  formatNumber: number => "formatNumber:" + number,
  formatPlural: number => "formatPlural:" + number,
  formatDate: date => "formatDate:" + date,
  formatTime: date => "formatTime:" + date,
  formatRelative: date => "formatRelative:" + date
};

export default fakeIntl;
