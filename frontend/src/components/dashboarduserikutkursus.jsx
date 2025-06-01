import React, { useEffect, useState } from "react";
import useAxiosToken from "../hooks/useAxiosToken";
import { BASE_URL } from "../utils";

const DashboardUserIkutKursus = () => {
  const { axiosJWT, token, name, role } = useAxiosToken();
  const [ikutKursus, setIkutKursus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Ambil userId dari token decode atau state, misal di useAxiosToken sudah ada
  // Asumsi di useAxiosToken ada userId (kalau belum ada, decode sendiri token)
  // Misal:
  // const userId = decodedToken.id;
  // Kalau belum ada, kamu bisa decode token di sini juga

  // Contoh decode token untuk dapetin userId
  const jwtDecode = require("jwt-decode");
  const userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    if (!userId) {
      setError("User belum login");
      setLoading(false);
      return;
    }

    const fetchIkutKursus = async () => {
      try {
        const res = await axiosJWT.get(`${BASE_URL}/ikutkursus/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIkutKursus(res.data);
      } catch (err) {
        setError("Gagal mengambil data kursus yang diikuti");
      } finally {
        setLoading(false);
      }
    };

    fetchIkutKursus();
  }, [axiosJWT, token, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{color: "red"}}>{error}</p>;

  return (
    <div>
      <h2>Kursus yang Anda Ikuti</h2>
      {ikutKursus.length === 0 ? (
        <p>Anda belum mengikuti kursus apapun.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Judul Kursus</th>
              <th>Guru</th>
              <th>Waktu</th>
              <th>Harga</th>
              <th>Kategori</th>
            </tr>
          </thead>
          <tbody>
            {ikutKursus.map((ikut) => (
              <tr key={ikut.id}>
                <td>{ikut.kursus?.Judul || "-"}</td>
                <td>{ikut.kursus?.Guru || "-"}</td>
                <td>{ikut.kursus?.Waktu || "-"}</td>
                <td>{ikut.kursus?.harga || "-"}</td>
                <td>{ikut.kursus?.Kategori || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardUserIkutKursus;
