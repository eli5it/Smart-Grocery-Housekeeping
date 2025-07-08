import axios from "axios";

export const login = async (username: string, password: string) => {
  const data = {
    username,
    password,
  };

  // Accept Set-Cookie responses from the server
  const res = await axios.post("/api/login", data, {
    withCredentials: true,
  });

  return res.data;
};

export const logout = async () => {
  const res = await axios.post("/api/logout", {
    withCredentials: true,
  });

  return res.data;
};
