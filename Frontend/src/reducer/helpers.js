export const updateSelectedRules = (selected, allValues) => {
  const { Id: selectedId } = selected;
  const index = allValues.findIndex(({ Id }) => selectedId === Id);

  let updated = [];
  if (index > -1) {
    updated = allValues.filter(({ Id }) => selectedId !== Id);
  } else {
    updated = [...allValues, selected];
  }
  return updated;
};

export const updateSelectedUndesiredSubstructure = (action, allValues) => {
  const selected = action.data;
  if (action.bulkAdd) {
    return bulkUpdateSelectedUndesiredSubstructureBulk(action, allValues);
  }

  const { Name: selectedName } = selected;
  const index = allValues.findIndex(({ Name }) => selectedName === Name);

  let updated = [];
  if (index > -1) {
    updated = allValues.filter(({ Name }) => selectedName !== Name);
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

const bulkUpdateSelectedUndesiredSubstructureBulk = (action, allValues) => {
  const selected = action.data;
  let updatedValue = [];

  if (action.isChecked) {
    updatedValue = selected.reduce(getUpdatedValue, allValues);
  } else {
    updatedValue = allValues.filter(
      ({ Name }) =>
        !selected.some(({ Name: selected_name }) => selected_name === Name)
    );
  }

  return updatedValue;
};
