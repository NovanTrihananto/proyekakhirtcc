import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils";

const useAxiosToken = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  // Gunakan useRef supaya axiosJWT tetap konsisten (tidak bikin instance baru setiap render)
  const axiosJWT = useRef(axios.create()).current;

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/token`);
        const accessToken = response.data.accessToken;
        setToken(accessToken);
        const decoded = jwtDecode(accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
        setRole(decoded.role);
      } catch (error) {
        setToken("");
        navigate("/");
      }
    };

    refreshToken();

    // Tambahkan interceptor SEKALI setelah axiosJWT dibuat
    const interceptor = axiosJWT.interceptors.request.use(
      async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
          const response = await axios.get(`${BASE_URL}/token`);
          const accessToken = response.data.accessToken;
          config.headers.Authorization = `Bearer ${accessToken}`;
          setToken(accessToken);
          const decoded = jwtDecode(accessToken);
          setExpire(decoded.exp);
          setName(decoded.name);
          setRole(decoded.role);
        }
        return config;
      },
      (error) => {
        navigate("/");
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor saat unmount (opsional tapi aman)
    return () => {
      axiosJWT.interceptors.request.eject(interceptor);
    };
  }, [expire, navigate, axiosJWT]);

  return { axiosJWT, token, name, role };
};

export default useAxiosToken;
