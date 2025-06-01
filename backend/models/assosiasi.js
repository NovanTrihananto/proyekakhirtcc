// models/associations.js
import User from "./UserModel.js";
import kursus from "./Kursusmodel.js";
import IkutKursus from "./ikutkursusmodel.js";

// User ↔ IkutKursus
User.hasMany(IkutKursus, { foreignKey: "idUser", constraints:true });
IkutKursus.belongsTo(User, { foreignKey: "idUser", constraints:true });

// Kursus ↔ IkutKursus
kursus.hasMany(IkutKursus, { foreignKey: "idKursus", constraints:true, as: "kursus" });
IkutKursus.belongsTo(kursus, { foreignKey: "idKursus", constraints:true, as: "kursus" });
