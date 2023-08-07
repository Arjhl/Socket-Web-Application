import { useRef } from "react";

const Login = () => {
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
  };

  return (
    <form onSubmit={submitHandler}>
      <input type="string" ref={emailRef}></input>
      <br />
      <br />
      <input type="password" ref={passwordRef}></input>
      <br />
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
