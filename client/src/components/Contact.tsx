import { useEffect, useState } from "react";
import styles from "./Contact.module.css";
import { useNavigate } from "react-router-dom";
import socket from "@/conn/webSocket";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
// let contacts: string[] = ["arj", "sud"];

const Contact = () => {
  const params = useParams();
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();
  const clickHandler = (userId: string) => {
    // if (props.onClickFunction) props.onClickFunction();
    console.log("navigate");
    navigate(`/dashboard/${userId}`);
  };

  const getAllContacts = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER_URL + "userData/contacts",
        {
          method: "post",
          headers: {
            "content-type": "application/json",
            Authorization: String(localStorage.getItem("token")),
          },
          body: JSON.stringify({
            id: localStorage.getItem("id"),
          }),
        }
      );
      console.log("inside get All contacts");
      const contacts = await res.json();
      console.log(contacts);
      setContacts(contacts);
    } catch (err) {
      alert("Somethings broken , try logging out and loggin in again");
    }
  };
  useEffect(() => {
    getAllContacts();
  }, [params.id]);

  socket.on("renderContacts", () => {
    getAllContacts();
  });

  return (
    <>
      {contacts.map((c: any) => {
        console.log(">", c);
        return (
          <div
            key={c._id}
            className={
              c.receiverId === params.id
                ? `${styles.active} ${styles.contact}`
                : styles.contact
            }
            onClick={clickHandler.bind(null, c.receiverId)}
          >
            <img
              src={import.meta.env.VITE_SERVER_URL + "images/" + c.profile}
            />

            <div>
              <h6>{c?.contactName}</h6>
              <p>
                {c.lastMessage?.senderId === localStorage.getItem("id")
                  ? "You:"
                  : c?.lastMessage.text === ""
                  ? ""
                  : c.contactName + ":"}
                {c.lastMessage?.text}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};
export default Contact;
