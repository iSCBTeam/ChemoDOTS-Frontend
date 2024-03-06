export const validValue = (value) => {
  return (
    (typeof value !== undefined && value !== null) || StrictValidNumber(value)
  );
};
export const strictValidString = (str) => {
  return typeof str === "string";
};
export const strictValidStringWithLength = (str) => {
  return typeof str === "string" && str.length > 1;
};

export const StrictValidNumber = (num) => {
  return !isNaN(num);
};

export const strictValidObject = (obj) => {
  return !!obj && typeof obj === "object" && !strictValidArray(obj);
};
export const strictValidArray = (arr) => {
  return !!arr && Array.isArray(arr);
};
export const strictValidArrayWithLength = (arr, length = 1) => {
  return !!arr && Array.isArray(arr) && arr.length >= length;
};

export const validObjectWithKeys = (obj, keys) => {
  if (!!obj && typeof obj === "object" && Array.isArray(keys)) {
    const objKeys = Object.keys(obj);
    return keys.every((key) => {
      return objKeys.findIndex((objKey) => objKey === key) > -1;
    });
  }
};
export const strictValidObjectWIthKey = (obj) => {
  if (
    !!obj &&
    typeof obj === "object" &&
    Array.isArray(Object.keys(obj)) &&
    strictValidArrayWithLength(Object.keys(obj))
  ) {
    return true;
  }
  return false;
};
export const validFunction = (fnc) => {
  if (!!fnc && typeof fnc === "function") {
    return true;
  }
  return false;
};
export const showError = (dispatch, message) => {
  const data = {
    isOpen: true,
    message,
  };
  dispatch({ type: "error_modal", data });
};

export const getPercentage = (upLimit, lwLimit, value) => {
  let percentage =
    (100 / (parseFloat(upLimit) - parseFloat(lwLimit))) * parseFloat(value);
  if (percentage < 0) percentage * -1;
  return percentage;
};
