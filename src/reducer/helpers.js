export const updateSelectedUndesiredSubstructure = (
  action,
  allValues,
  keyValue
) => {
  const selected = action.data;
  if (action.bulkAdd) {
    return bulkUpdateSelectedUndesiredSubstructureBulk(
      action,
      allValues,
      keyValue
    );
  }

  const index = allValues.findIndex((v) => selected[keyValue] === v[keyValue]);

  let updated = [];
  if (index > -1) {
    updated = allValues.filter((v) => selected[keyValue] !== v[keyValue]);
  } else {
    updated = [...allValues, selected];
  }
  return updated;
};

const getUpdatedValue = (acc, current) => {
  let updated = acc;
  const index = acc.findIndex(({ Name }) => current.Name === Name);
  if (index === -1) {
    updated = [...acc, current];
  }
  return updated;
};

const bulkUpdateSelectedUndesiredSubstructureBulk = (
  action,
  allValues,
  keyValue
) => {
  const selected = action.data;
  let updatedValue = [];

  if (action.isChecked) {
    updatedValue = selected.reduce(getUpdatedValue, allValues);
  } else {
    updatedValue = allValues.filter(
      (v) => !selected.some((select) => select[keyValue] === v[keyValue])
    );
  }

  return updatedValue;
};
