// routes/IkutKursusRoute.js
import express from "express";
import {
  getKursusDiikuti,
  daftarKursus,
  batalIkut,
} from "../controllers/ikutkursuscontroller.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { getAccessToken } from "../controllers/TokenController.js";

const router = express.Router();

// GET semua kursus yang diikuti oleh user tertentu
router.get("/ikutkursus/:userId",verifyToken, getKursusDiikuti);

// POST daftar kursus baru
router.post("/ikutkursus",verifyToken, daftarKursus);

// DELETE batal ikut kursus
router.delete("/ikutkursus/:id",verifyToken, batalIkut);

export default router;
