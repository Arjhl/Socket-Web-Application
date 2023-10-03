import { createContext } from "react";

const defaultValue = {
  username: "",
  age: "",
  image: "",
  mobile: "",
  user_id: "",
};

const accountContext = createContext(defaultValue);

const AccountContextProvider = (props: any) => {
  return (
    <accountContext.Provider value={defaultValue}>
      {props.children}
    </accountContext.Provider>
  );
};

export { AccountContextProvider, accountContext };
