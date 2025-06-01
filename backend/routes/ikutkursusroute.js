// routes/IkutKursusRoute.js
import express from "express";
import {
  getKursusDiikuti,
  daftarKursus,
  batalIkut,
  updateIkutKursus,
} from "../controllers/ikutkursuscontroller.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { verifyAdmin } from "../middleware/VerifyAdmin.js";

const router = express.Router();

// GET semua kursus yang diikuti oleh user tertentu
router.get("/ikutkursus/:userId",verifyToken, getKursusDiikuti);

// POST daftar kursus baru
router.post("/ikutkursus",verifyToken,verifyAdmin, daftarKursus);

// DELETE batal ikut kursus
router.delete("/ikutkursus/:id",verifyToken,verifyAdmin, batalIkut);
router.put("/ikutkursus/:id", verifyToken,verifyAdmin, updateIkutKursus);
export default router;
