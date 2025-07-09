import { useState } from "react";

const RegisterForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    // let React handle the form submission
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match my friend!");
    }
  };

  return (
    <>
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
          type="text"
        ></input>
        <label htmlFor="confirm-password">Confirm password</label>
        <input
          className="border border-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          name="confirm-password"
          type="text"
        ></input>
        <button className="bg-violet-900 mt-3 rounded-2xl px-4 py-1">
          Submit
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
