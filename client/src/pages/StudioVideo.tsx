import { useCookies } from "react-cookie";
import StudioVideo from "../components/StudioVideo";
import LoginAlert from "../components/LoginAlert";

export default function StudioVideoCx() {
  const [{ token }] = useCookies(["token"]);
  return token ? <StudioVideo /> : <LoginAlert />;
}
