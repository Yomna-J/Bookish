import useAuth from "../context/AuthContext";
import axios from "../api/axios";

const LOGOUT_URL = "/logout";

const Logout = () => {
  const { setAuth } = useAuth();
  const logout = async () => {
    setAuth({});
    try {
      const response = await axios(LOGOUT_URL, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
};

export default Logout;
