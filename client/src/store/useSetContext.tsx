import { accountContext } from "./accountContext";
import { useContext } from "react";

export const useSetCtx = () => {
  const ctx = useContext(accountContext);

  return (data: {
    age: string;
    username: string;
    mobile: string;
    user_id: string;
    image: string;
  }) => {
    ctx.age = data.age;
    ctx.username = data.username;
    ctx.mobile = data.mobile;
    ctx.user_id = data.user_id;
    ctx.image = data.image;
  };
};
