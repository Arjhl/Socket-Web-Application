import { useRef } from "react";
// import { useContext } from "react";
// import { accountContext } from "../store/accountContext";
import { useNavigate } from "react-router-dom";
import { useSetCtx } from "@/store/useSetContext";
import styles from "./Signup.module.css";

const Login = () => {
  const nav = useNavigate();
  // const ctx = useContext(accountContext);
  const setCtx = useSetCtx();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(import.meta.env.VITE_SERVER_URL + "auth", {
      method: "post",
      body: JSON.stringify({
        email: emailRef?.current?.value,
        pass: passwordRef?.current?.value,
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await res.json();

    console.log(data);

    if (data.message) {
      alert(data.message);
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      // const { age, mobile, username, user_id, image } = data.accountData;
      console.log(data);
      localStorage.setItem("id", data.accountData.user_id);
      //add user details to context
      setCtx(data);
      // console.log(age, mobile, username, user_id, image);
      // console.log(data);

      nav("/dashboard");
    }
  };

  const resetPass = () => {
    nav("/reset");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.head}>A Messenger App by 😑.</h1>

        <form onSubmit={submitHandler} className={styles.form}>
          <input type="string" ref={emailRef} placeholder="Email" />
          <br />
          <br />
          <input type="password" ref={passwordRef} placeholder="Password" />
          <br />
          <br />
          <button type="submit">Login</button>
        </form>
        <p>
          Forgot Password ? <button onClick={resetPass}> Click Here </button>
        </p>
        <footer>Techstack : MERN & Socket.io.</footer>
      </div>
    </div>
  );
};

export default Login;
