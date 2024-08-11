import Login from "../components/Login";
import Register from "../components/Register";

export default function Auth(type: "login" | "register") {
  return type == "login" ? <Login /> : <Register />;
}
