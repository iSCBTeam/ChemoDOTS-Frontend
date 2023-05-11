import { updateSelectedUndesiredSubstructure } from "./helpers";

const initialState = {
  growing_smiles: "",
  Detected_Functions: [],
  selected_Functions: {},
  reaction_rules: [],
  grouped_reaction_rules: [],
  selected_function_rules: [],
  grouped_undesired_substructure: [],
  selected_undesired_substructure: [],
  substructure_data: [],
  required_substructure: "",
  structureImage: { image: "", smiles_code: "" },
  iframe_script_loaded: false,
};

export const initialSuperState = {
  firstInstance: initialState,
  secondInstance: initialState,
  thirdInstance: initialState,
  error_modal: { isOpen: false, message: "" },
  info_modal: { isOpen: false, message: "" },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "save_smiles": {
      return {
        ...initialState,
        growing_smiles: action.data,
        iframe_script_loaded: state.iframe_script_loaded,
      };
    }
    case "iframe_script": {
      return {
        ...state,
        iframe_script_loaded: action.data,
      };
    }
    case "error_modal": {
      return {
        ...state,
        error_modal: { ...state.error_modal, ...action.data },
      };
    }
    case "info_modal": {
      return {
        ...state,
        info_modal: { ...state.info_modal, ...action.data },
      };
    }
    case "save_detected_function": {
      return {
        ...state,
        Detected_Functions: action.data,
      };
    }
    case "selected_detected_function": {
      return {
        ...state,
        selected_Functions: action.data,
      };
    }
    case "save_reactionRules": {
      return {
        ...state,
        reaction_rules: action.data,
      };
    }
    case "grouping_reactionRules": {
      return {
        ...state,
        grouped_reaction_rules: action.data,
      };
    }
    case "on_select_reaction_rules": {
      return {
        ...state,
        selected_function_rules: updateSelectedUndesiredSubstructure(
          action,
          state.selected_function_rules,
          "Id"
        ),
      };
    }
    case "empty_select_reaction_rules": {
      return {
        ...state,
        selected_function_rules: [],
      };
    }
    case "grouped_undesired_sub_reaction": {
      return {
        ...state,
        grouped_undesired_substructure: action.data,
      };
    }
    case "on_select_undesired_substructure": {
      return {
        ...state,
        selected_undesired_substructure: updateSelectedUndesiredSubstructure(
          action,
          state.selected_undesired_substructure,
          "Name"
        ),
      };
    }
    case "empty_undesired_substructure": {
      return {
        ...state,
        selected_undesired_substructure: [],
      };
    }
    case "substructure_data": {
      return {
        ...state,
        substructure_data: action.data,
      };
    }
    case "required_substructure": {
      return {
        ...state,
        required_substructure: action.data,
      };
    }
    case "save_structure_image": {
      return {
        ...state,
        structureImage: action.data,
      };
    }
  }
  throw Error("Unknown action: " + action.type);
};

const wrapperReducer = (state, action) => {
  if (action.instance) {
    const updatedState = reducer(state[action.instance], action);
    return { ...state, [action.instance]: updatedState };
  }
  const updatedState = reducer(state, action);
  return updatedState;
};

export default wrapperReducer;
