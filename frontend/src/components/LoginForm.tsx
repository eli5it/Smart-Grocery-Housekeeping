import { useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";
import Toaster from "./Toaster";
import type { ToastDetails } from "../lib/types";

const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate({
    from: "/login",
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login", {
        username,
        password,
      });
      localStorage.setItem("access_token", res.data.access_token);
      console.log("redirecting");
      navigate({
        to: "/app/dashboard",
      });
    } catch (err) {
      setShowToast(true);
    }
  };

  return (
    <>
      <Toaster
        toastDetails={{
          description: "Please try again.",
          title: "Incorrect username/password ",
        }}
        showToast={showToast}
        setShowToast={setShowToast}
      />
      <form onSubmit={submitHandler} className="flex flex-col items-center">
        <label htmlFor="username">Username</label>
        <input
          className="border border-white"
          value={username}
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <label htmlFor="password">Password</label>
        <input
          className="border border-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          type="password"
        ></input>
        <button className="bg-violet-900 mt-3 rounded-2xl px-4 py-1">
          Submit
        </button>
      </form>
    </>
  );
};

export default LoginForm;
