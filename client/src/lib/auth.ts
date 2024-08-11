import axios from "axios";
import { BASE_URL } from "./constants";

export async function handleLoginUser(username: string, password: string) {
  const response = await axios.post(
    `${BASE_URL}/api/auth/login`,
    {
      username,
      password,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function handleRegisterUser(
  username: string,
  password: string,
  email: string
) {
  const response = await axios.post(`${BASE_URL}/api/auth/register`, {
    username,
    password,
    email,
  });
  return response.data;
}
