// controllers/IkutKursusController.js
import IkutKursus from "../models/ikutkursusmodel.js";
import kursus from "../models/Kursusmodel.js";

// GET semua kursus yang diikuti user
export const getKursusDiikuti = async (req, res) => {
  try {
    const userId = req.params.userId;

    const data = await IkutKursus.findAll({
      where: { idUser: userId },
      include: [
        {
          model: kursus,
          attributes: ["id", "Judul", "Guru", "Waktu", "harga", "Img", "Deskripsi", "Kategori"],
        },
      ],
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// POST daftar kursus
export const daftarKursus = async (req, res) => {
  try {
    console.log("BODY:", req.body); // cek apa yang diterima backend
    const { idUser, idKursus, pembayaran } = req.body;

    if (!idUser || !idKursus) {
      return res.status(400).json({ msg: "idUser dan idKursus wajib diisi" });
    }

    const existing = await IkutKursus.findOne({
      where: { idUser, idKursus },
    });

    if (existing) {
      return res.status(400).json({ msg: "Kursus ini sudah diikuti" });
    }

    const newData = await IkutKursus.create({
      idUser,
      idKursus,
      pembayaran: pembayaran || "pending",
    });

    res.status(201).json(newData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

// (Opsional) DELETE batal ikut
export const batalIkut = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await IkutKursus.destroy({
      where: { id },
    });

    if (!deleted) return res.status(404).json({ msg: "Data tidak ditemukan" });

    res.json({ msg: "Berhasil dibatalkan" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
