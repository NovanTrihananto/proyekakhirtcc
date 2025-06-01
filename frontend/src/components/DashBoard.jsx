import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAxiosToken from "../hooks/useAxiosToken";
import { BASE_URL } from "../utils";

const Dashboard = () => {
  const { axiosJWT, token, name, role } = useAxiosToken();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (role && role !== "admin") {
      navigate("/dashboarduser"); // Ganti dengan halaman yang sesuai
    }
  }, [role, navigate]);

  const getUsers = useCallback(async () => {
    try {
      const response = await axiosJWT.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }, [axiosJWT, token]);

  const getCourses = useCallback(async () => {
    try {
      const response = await axiosJWT.get(`${BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data || []);
    } catch (error) {
      console.log(error);
    }
  }, [axiosJWT, token]);

  const deleteCourse = async (id) => {
    if (window.confirm("Yakin ingin menghapus kursus ini?")) {
      try {
        await axiosJWT.delete(`${BASE_URL}/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        getCourses();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteUser = async (id) => {
    try {
      await axiosJWT.delete(`${BASE_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getUsers(); // Refresh list after delete
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token && role === "admin") {
      getUsers();
      getCourses();
    }
  }, [token, role, getUsers, getCourses]);

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-full">
        <div className="mb-5">
          Halo, {name} ({role})
          {/* Tambahkan tombol ke Dashboard User */}
          <button
            className="button is-link ml-4"
            onClick={() => navigate("/dashboarduser")}
          >
            Ke Dashboard User
          </button>
        </div>

        {/* TABEL USERS */}
        <h2 className="title is-4">Daftar Pengguna</h2>
        <table className="table is-striped is-fullwidth mb-6">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
                <td>
                  <Link
                    to={`/edit/${user.id}`}
                    className="button is-small is-info mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="button is-small is-danger"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="title is-4">Daftar Kursus</h2>
        <div className="mb-4">
          <Link to="/add-course" className="button is-primary">
            + Tambah Kursus
          </Link>
        </div>

        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Guru</th>
              <th>Waktu (jam)</th>
              <th>Harga</th>
              <th>Kategori</th>
              <th>Deskripsi</th>
              <th>Gambar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.id}>
                <td>{index + 1}</td>
                <td>{course.Judul}</td>
                <td>{course.Guru}</td>
                <td>{course.Waktu}</td>
                <td>{course.harga}</td>
                <td>{course.Kategori}</td>
                <td>{course.Deskripsi}</td>

                <td>
                  {course.Img ? (
                    <img
                      src={`${BASE_URL}/images/${course.Img}`}
                      alt={course.Judul}
                      style={{ width: "100px", objectFit: "cover" }}
                    />
                  ) : (
                    "Tidak ada gambar"
                  )}
                </td>
                <td>
                  <Link
                    to={`/edit-kursus/${course.id}`}
                    className="button is-small is-info mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="button is-small is-danger"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
