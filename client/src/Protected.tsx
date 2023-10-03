import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Protected = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("id")) {
      console.log("not logged in");
      navigate("/");
    }
  }, []);

  return children;
};
export default Protected;
