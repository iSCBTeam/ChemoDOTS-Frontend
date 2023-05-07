import { useReducer } from "react";
import router from "../../routes";
import { createContext, useContext, useState } from "react";
import reducer, { initialSuperState } from "../../reducer";
import DangerModal from "../../components/modal/danger";
import InfoModal from "../../components/modal/info";

export const stateContext = createContext(initialSuperState);
export const dispatchContext = createContext(() => {});

import { RouterProvider } from "react-router-dom";

function App() {
  const [state, dispatch] = useReducer(reducer, initialSuperState);
  console.log("state", state);
  return (
    <stateContext.Provider value={state}>
      <dispatchContext.Provider value={dispatch}>
        <DangerModal />
        <InfoModal />
        <RouterProvider router={router()} />
      </dispatchContext.Provider>
    </stateContext.Provider>
  );
}

export default App;
