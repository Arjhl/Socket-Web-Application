import { createContext } from "react";

const defaultValue = {
  username: "",
  age: "",
  image: "",
  mobile: "",
  id: "",
};

const accountContext = createContext(defaultValue);

const accountContextProvider = (props: any) => {
  return (
    <accountContext.Provider value={defaultValue}>
      {props.children}
    </accountContext.Provider>
  );
};

export { accountContextProvider, accountContext };
