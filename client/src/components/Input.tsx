import styles from "./Input.module.css";
import { useRef } from "react";

const Input = ({ submitHandler }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const localSubmit = (e) => {
    submitHandler(inputRef?.current?.value, e);
    inputRef?.current?.value ? (inputRef.current.value = "") : "";
  };

  return (
    <form className={styles.formContainer} onSubmit={localSubmit}>
      <input
        type="text"
        placeholder="Enter Your Message"
        ref={inputRef}
      ></input>
      <button type="submit">🚀</button>
    </form>
  );
};

export default Input;
