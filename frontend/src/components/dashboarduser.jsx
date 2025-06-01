import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosToken from "../hooks/useAxiosToken"; 
import { BASE_URL } from "../utils";

const DashboardUser = () => {
  const { axiosJWT, token, name, role,userId  } = useAxiosToken();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const [msg, setMsg] = useState(""); 
  const navigate = useNavigate();

   useEffect(() => {
     if (role && role !== "admin" && role !== "user") {
       navigate("/landingpage"); // Ganti dengan halaman yang sesuai
     }
   }, [role, navigate]);


  const getCourses = useCallback(async () => {
    try {
      const res = await axiosJWT.get(`${BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Gagal mengambil data kursus");
    }
  }, [axiosJWT, token]);

  useEffect(() => {
    if (token && role === "user") {
      getCourses().finally(() => setLoading(false));
    }
  }, [token, role, getCourses]);

const handleDaftar = async (idKursus) => {
  try {
    setMsg("");
    const res = await axiosJWT.post(
      `${BASE_URL}/ikutkursus`,
      { idUser: userId, idKursus },  // kirim keduanya
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMsg(`Berhasil daftar kursus: ${res.data.idKursus}`);
  } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setMsg(`Gagal daftar: ${err.response.data.msg}`);
      } else {
        setMsg("Gagal daftar kursus");
      }
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="has-text-danger">{error}</p>;

  return (
    <div>
      <h1>Selamat datang, {name}</h1>
      <h2>Daftar Kursus</h2>
      {msg && <p>{msg}</p>}
      <div className="columns is-multiline">
        {courses.map((course) => (
          <div key={course.id} className="column is-one-third">
            <div className="card">
              <div className="card-content">
                <p className="title">{course.Judul}</p>
                <p className="subtitle">oleh {course.Guru}</p>
                <button
                  className="button is-primary"
                  onClick={() => handleDaftar(course.id)}
                >
                  Daftar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardUser;
