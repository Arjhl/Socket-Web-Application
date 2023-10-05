import styles from "./Msgs.module.css";
import { useRef, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import socket from "@/conn/webSocket";
import { accountContext } from "@/store/accountContext";

const Msgs = (props) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<any>([]);
  const params = useParams();
  const ctx = useContext(accountContext);

  const getMsgs = async () => {
    const receiverId = props.id;
    const senderId = localStorage.getItem("id");
    const res = await fetch(import.meta.env.VITE_SERVER_URL + "userData/msgs", {
      method: "post",
      body: JSON.stringify({
        senderId,
        receiverId,
      }),
      headers: {
        "content-type": "application/json",
        Authorization: String(localStorage.getItem("token")),
      },
    });

    const responseData = await res.json();
    console.log(responseData);
    setMsgs(responseData);
  };
  useEffect(() => {
    if (params.id) {
      getMsgs();
    }
  }, [params.id]);

  useEffect(() => {
    socket.on("private_msg", (arg) => {
      console.log("prv", arg);
      const newMsg = {
        senderId: arg.senderId,
        receiverId: arg.receiverId,
        text: arg.text,
      };
      setMsgs((msgs) => {
        return [...msgs, newMsg];
      });
      console.log(msgs);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [msgs]);

  return (
    <div className={styles.container}>
      <div className={styles.fix}></div>
      {msgs?.map((m, i) => {
        console.log(m);
        const { senderId, text } = m;
        return (
          <p
            className={
              senderId === ctx.user_id ? styles.senderMsg : styles.receiverMsg
            }
            key={i}
          >
            {text}
          </p>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
export default Msgs;
