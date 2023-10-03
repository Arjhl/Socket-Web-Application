import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styles from "./Signup.module.css";

const SignUp = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  //this is the landing page so if the user logged in already/before and the token is present in local storage then i want to get the user data
  console.log(localStorage);
  useEffect(() => {
    if (localStorage.getItem("id")) {
      navigate("/dashboard");
    }
  }, []);
  // socket.on("connect", () => {
  //   console.log(socket.id);

  //   // const engine = socket.io.engine;

  //   socket.emit("msg", "henlo");
  //   // console.log(engine);
  //   socket.on("hello", (arg) => {
  //     console.log(arg);
  //   });
  // });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(emailRef.current?.value);
    console.log(passwordRef.current?.value);

    const email = emailRef.current?.value;
    const pass = passwordRef.current?.value;

    if (email?.trim().length === 0 || pass?.trim().length === 0) {
      return alert("Email and Password is required");
    }

    const weak = /^(?=.*[a-z]).{6,20}$/;
    const medium =
      /^(?=.*\d)(?=.*[a-z]).{6,20}$|^(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const strong = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (pass?.match(strong)) {
      console.log("Password is Strong");
    } else if (pass?.match(medium)) {
      console.log("Password is Mid");
    } else if (pass?.match(weak)) {
      console.log("Password is weak");
    }

    try {
      console.log(import.meta.env.VITE_SERVER_URL + "register");
      const res = await fetch(import.meta.env.VITE_SERVER_URL + "register", {
        method: "post",
        body: JSON.stringify({
          email: email,
          pass: pass,
        }),
        headers: {
          "content-type": "application/json",
        },
      });
      const { data } = await res.json();
      console.log(data);

      navigate(`/${data._id}/userdetails`);
    } catch (err: any) {
      console.log(err);
      alert(err);
      console.log(err.message ? err.message : err);
    }
  };
  const redirectedToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.head}>A Messenger App by 😑.</h1>
        <form onSubmit={submitHandler} className={styles.form}>
          <input type="string" ref={emailRef} placeholder="Email"></input>
          <br />
          <br />
          <input
            type="password"
            ref={passwordRef}
            placeholder="Password"
          ></input>
          <br />
          <br />
          <button type="submit">Submit</button>
        </form>
        <p>
          Already registered ?
          <button onClick={redirectedToLogin}>Login ?</button>
        </p>
        <footer>Techstack : MERN & Socket.io.</footer>
      </div>
    </div>
  );
};

export default SignUp;
