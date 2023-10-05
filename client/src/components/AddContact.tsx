import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Styles from "./AddContact.module.css";

// let contacts: string[] = ["arj", "sud"];

const AddContact = (props) => {
  const [newContactemail, setNewContactEmail] = useState("");
  const navigate = useNavigate();
  // const clickHandler = (userId: string) => {
  //   props.onClickFunction();
  //   navigate(`/dashboard/${userId}`);
  // };

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await fetch(
      import.meta.env.VITE_SERVER_URL + "userData/newContact",
      {
        method: "post",
        headers: {
          "content-type": "application/json",
          Authorization: String(localStorage.getItem("token")),
        },
        body: JSON.stringify({
          senderId: localStorage.getItem("id"),
          email: newContactemail,
        }),
      }
    );
    const data = await res.json();
    console.log(data);
    if (data.msg) {
      alert(data.msg);
    } else {
      const { receiverId } = data;
      props.contactUpdate(!props.contactValue);
      navigate(`/dashboard/${receiverId}`);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler} className={Styles.form}>
        <input
          type="text"
          onChange={(e) => {
            console.log(e.target.value);
            setNewContactEmail(e.target.value);
          }}
          placeholder="Add Contact(Enter Email)"
        />
        <button type="submit" value="submit">
          +
        </button>
      </form>
    </div>
  );
};
export default AddContact;
