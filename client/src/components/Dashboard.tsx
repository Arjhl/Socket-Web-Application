import { useContext, useEffect, useState } from "react";
import { accountContext } from "../store/accountContext";
import Msgs from "./Msgs";
import styles from "./Dashboard.module.css";
import { useSetCtx } from "@/store/useSetContext";
import Contact from "./Contact";
import Input from "./Input";
import { useParams } from "react-router-dom";
import socket from "@/conn/webSocket";
import Protected from "@/Protected";
import AddContact from "./AddContact";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const ctx = useContext(accountContext);
  const [isCtxUpdated, setIsCtxUpdated] = useState(false);
  const [isContactUpdated, setIsContactUpdated] = useState(false);
  const params = useParams();
  // const [allUsers, setAllUsers] = useState([]);
  const setCtx = useSetCtx();
  const nav = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user_id = localStorage.getItem("id");
        const res = await fetch(import.meta.env.VITE_SERVER_URL + "userData", {
          method: "post",
          body: JSON.stringify({
            user_id,
          }),
          headers: {
            "content-type": "application/json",
            Authorization: String(localStorage.getItem("token")),
          },
        });
        const userData = await res.json();

        console.log("userData to update context", userData);
        setCtx(userData);
        setIsCtxUpdated(true);
        console.log(ctx);
      } catch (err) {
        alert("Token is invalid , Try logging out and logging in again");
      }
    };
    if (localStorage.getItem("token")) {
      getUserData();
    }
    socket.emit("register", localStorage.getItem("id"));
  }, []);

  const submitHandler = async (input, e) => {
    e.preventDefault();
    // console.log(input);
    const newMsg = {
      senderId: ctx.user_id,
      receiverId: params.id,
      text: input,
    };

    //add msg to DB and invoke the server
    socket.emit("private_msg", newMsg);
  };

  const logoutHandler = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    nav("/");
  };

  return (
    <Protected>
      <div className={styles.container}>
        <div className={styles.userDetails}>
          <img
            src={import.meta.env.VITE_SERVER_URL + "images/" + ctx.image}
            alt={ctx.image}
          />
          <h1>{ctx.username}</h1>

          <button className={styles.logoutButton} onClick={logoutHandler}>
            Logout
          </button>
        </div>

        <div className={styles.flexBox}>
          <div className={styles.contactList}>
            <div className={styles.contacts}>
              <Contact />
            </div>
            <AddContact
              contactUpdate={setIsContactUpdated}
              contactValue={isContactUpdated}
            />
          </div>
          <div className={styles.msgContainer}>
            <Msgs id={params.id} />
            <Input submitHandler={submitHandler} />
          </div>
        </div>
      </div>
    </Protected>
  );
};

export default Dashboard;
