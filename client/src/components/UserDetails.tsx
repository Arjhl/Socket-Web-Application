import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const nav: any = useNavigate();
  const params: any = useParams();
  const [img, setImg] = useState<File | null>(null);
  const [mobile, setMobile] = useState<any>("");
  const [age, setAge] = useState<any>("");
  const [username, setUserName] = useState<any>("");

  console.log(params);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(img);
    const formData = new FormData();
    formData.set("username", username);
    formData.set("age", age);
    formData.set("mobile", mobile);
    formData.set("userid", params.id);
    formData.set("image", img as Blob);

    try {
      const res = await fetch(import.meta.env.VITE_SERVER_URL + "userdetails", {
        method: "post",
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      if (data) nav("/login");
    } catch (err) {
      console.log("file upload err:", err);
    }
  };

  return (
    <form onSubmit={submitHandler} encType="multipart/form-data">
      <input
        type="username"
        placeholder="Enter Username"
        onChange={(e) => {
          console.log(e.target.value);
          setUserName(e.target.value);
        }}
        required
      />
      <input
        type="number"
        placeholder="Enter mobile number"
        onChange={(e) => {
          setMobile(e.target.value);
        }}
        required
      />
      <input
        type="number"
        placeholder="Enter age"
        onChange={(e) => {
          setAge(e.target.value);
        }}
        required
      />
      <br></br>
      <input
        type="file"
        onChange={(e) => {
          console.log(e);
          if (!e.target.files) return;
          setImg(e.target.files[0]);
        }}
        name="image"
        required
      />

      <button type="submit" value="Submit">
        Submit
      </button>
    </form>
  );
};

export default UserDetails;
