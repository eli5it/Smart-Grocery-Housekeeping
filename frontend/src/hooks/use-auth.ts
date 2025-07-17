import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type UserInfo = {
  username: string;
};

const getUserInfo = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return;
  }

  try {
    const res = await axios.get<UserInfo>("/api/me", {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  } catch (err) {
    return undefined;
  }
};

export function useAuth() {
  const query = useQuery({
    queryKey: ["auth"],
    queryFn: getUserInfo,
    // refetch every hour
    staleTime: 6 * 10000,
  });
}
