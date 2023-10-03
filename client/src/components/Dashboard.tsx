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

const Dashboard = () => {
  const ctx = useContext(accountContext);
  const [isCtxUpdated, setIsCtxUpdated] = useState(false);
  const [isContactUpdated, setIsContactUpdated] = useState(false);
  const params = useParams();
  // const [allUsers, setAllUsers] = useState([]);
  const setCtx = useSetCtx();

  console.log(params.id);

  useEffect(() => {
    const getUserData = async () => {
      if (localStorage.getItem("token")) {
        const user_id = localStorage.getItem("id");
        const res = await fetch(import.meta.env.VITE_SERVER_URL + "userData", {
          method: "post",
          body: JSON.stringify({
            user_id,
          }),
          headers: {
            "content-type": "application/json",
          },
        });
        const userData = await res.json();

        setCtx(userData);
        setIsCtxUpdated(true);
        console.log(ctx);
      }
    };
    getUserData();
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
  return (
    <Protected>
      <div className={styles.container}>
        <div className={styles.userDetails}>
          <img
            src={import.meta.env.VITE_SERVER_URL + "images/" + ctx.image}
            alt={ctx.image}
          />
          <h1>{ctx.username}</h1>
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
