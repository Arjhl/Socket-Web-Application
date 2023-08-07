import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
      console.log(err.message ? err.message : err);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <input type="string" ref={emailRef}></input>
      <br />
      <br />
      <input type="password" ref={passwordRef}></input>
      <br />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignUp;
