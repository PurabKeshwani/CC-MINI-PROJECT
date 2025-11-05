import axios from "axios";
import API_URL from "../config/apiConfig";

export async function handleLoginUser(username: string, password: string) {
  const response = await axios.post(
    `${API_URL}/api/auth/login`,
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
  const response = await axios.post(`${API_URL}/api/auth/register`, {
    username,
    password,
    email,
  });
  return response.data;
}
