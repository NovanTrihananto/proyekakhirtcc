import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosToken from "../hooks/useAxiosToken"; 
import { BASE_URL } from "../utils";

const DashboardUser = () => {
  const { axiosJWT, token, name, role, userId } = useAxiosToken();
  const [courses, setCourses] = useState([]);
  const [coursesDiikuti, setCoursesDiikuti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDiikuti, setLoadingDiikuti] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState(""); 
  const [showDiikuti, setShowDiikuti] = useState(false);
  const [isLoadingDaftar, setIsLoadingDaftar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (role && role !== "admin" && role !== "user") {
      navigate("/landingpage");
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

  const getCoursesDiikuti = useCallback(async () => {
    try {
      setLoadingDiikuti(true);
      const res = await axiosJWT.get(`${BASE_URL}/ikutkursus/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoursesDiikuti(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data kursus yang diikuti");
    } finally {
      setLoadingDiikuti(false);
    }
  }, [axiosJWT, token, userId]);

  useEffect(() => {
    if (token && role === "user") {
      getCourses().finally(() => setLoading(false));
    }
  }, [token, role, getCourses]);

  const handleDaftar = async (idKursus) => {
    try {
      setIsLoadingDaftar(true);
      setMsg("");
      const res = await axiosJWT.post(
        `${BASE_URL}/ikutkursus`,
        { idUser: userId, idKursus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(`Berhasil daftar kursus: ${res.data.idKursus}`);
      if (showDiikuti) {
        getCoursesDiikuti();
      }
    } catch (err) {
      const errMsg = err.response?.data?.msg || "Gagal daftar kursus";
      setMsg(`Gagal daftar: ${errMsg}`);
      console.error(err);
    } finally {
      setIsLoadingDaftar(false);
    }
  };

  const toggleShowDiikuti = () => {
    if (!showDiikuti) {
      getCoursesDiikuti();
    }
    setShowDiikuti(!showDiikuti);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="has-text-danger">{error}</p>;

  return (
    <div>
      <h1>Selamat datang, {name}</h1>
      <button className="button is-info mb-4" onClick={toggleShowDiikuti}>
        {showDiikuti ? "Sembunyikan Kursus Saya" : "Lihat Kursus Saya"}
      </button>

      {showDiikuti ? (
        <>
          <h2 className="title is-4">Kursus yang Kamu Ikuti</h2>
          {loadingDiikuti ? (
            <p>Loading...</p>
          ) : coursesDiikuti.length === 0 ? (
            <p>Kamu belum mengikuti kursus apapun.</p>
          ) : (
            <div className="columns is-multiline">
              {coursesDiikuti.map((item) => {
                const course = item.kursus;
                if (!course) return null; // safety check
                return (
                  <div key={item.id} className="column is-one-third">
                    <div className="card">
                      <div className="card-content">
                        <p className="title">{course.Judul}</p>
                        <p className="subtitle">oleh {course.Guru}</p>
                        <p>
                          Status pembayaran:{" "}
                          <span className={`tag ${item.pembayaran === "lunas" ? "is-success" : "is-warning"}`}>
                            {item.pembayaran}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="title is-4">Daftar Kursus</h2>
          {msg && <p className="has-text-info">{msg}</p>}
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
                      disabled={isLoadingDaftar}
                    >
                      {isLoadingDaftar ? "Mendaftar..." : "Daftar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardUser;
