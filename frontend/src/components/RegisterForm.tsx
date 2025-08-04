import { useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";
import Toaster from "./Toaster";
import type { ToastDetails } from "../lib/types";

type RegisterResponse = {
  msg: string;
  access_token: string;
};

const RegisterForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [toastDetails, setToastDetails] = useState<ToastDetails>({
    title: "Invalid combination",
    description: "Please enter valid credentials",
  });

  const navigate = useNavigate({
    from: "/register",
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    // let React handle the form submission
    e.preventDefault();

    if (password !== confirmPassword) {
      setShowToast(true);
      setToastDetails({
        title: "Passwords don't match!",
        description: "Try again with matching passwords",
      });
      return;
    }

    // if passwords match
    try {
      const res = await axios.post<RegisterResponse>("/api/register", {
        username,
        password,
      });

      const data = res.data;
      localStorage.setItem("access_token", data.access_token);
      navigate({
        to: "/app/dashboard",
      });
    } catch (err) {
      setShowToast(true);
      setToastDetails({
        title: "Invalid username and or password",
        description: "Please try again with valid credentials",
      });
    }
  };

  return (
    <>
      <Toaster
        showToast={showToast}
        setShowToast={setShowToast}
        toastDetails={toastDetails}
      />
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center gap-1"
      >
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
        <label htmlFor="confirm-password">Confirm password</label>
        <input
          className="border border-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          name="confirm-password"
          type="password"
        ></input>
        <button className="bg-violet-900 mt-3 rounded-2xl px-4 py-1">
          Submit
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
