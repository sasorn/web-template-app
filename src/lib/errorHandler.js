export const errorCodes = {
  MUIP_001: {
    name: "missingFields",
    message: "All fields are required."
  }
};

export default function getErrorMessageByError(error) {
  if (error.details?.responseBody.code) {
    const MUErrorCode = error.details?.responseBody.code;

    if (MUErrorCode in errorCodes) {
      return errorCodes[MUErrorCode];
    }
  }

  return null;
}
