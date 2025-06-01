import express from "express";
import multer from "multer";
import {
  getKursus,
  createKursus,
  updateKursus,
  getKursusById,
  deleteKursus
} from "../controllers/kursuscontroller.js";
import { verifyAdmin } from "../middleware/VerifyAdmin.js";



// Setup multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const router = express.Router();

// GET semua kursus, bisa diakses siapa saja (bebas token)
router.get("/courses", getKursus);

// POST tambah kursus, harus admin & bisa upload gambar
router.post("/courses", verifyAdmin, upload.single("Img"), createKursus);
router.get("/courses/:id", getKursusById);
// PUT update kursus by id, harus admin
router.put("/courses/:id", verifyAdmin, updateKursus);

// DELETE hapus kursus by id, harus admin
router.delete("/courses/:id", verifyAdmin, deleteKursus);


export default router;
