const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../configs/conn");
const cors = require("cors");
router.use(cors({ methods: ["GET", "POST"] }));

router.get("/:nom_categorie?", async (req, res, next) => {
  const nomCategorie = req.params.nom_categorie;

  try {
    const conn = await connectToDatabase();
    let query =
      "SELECT id_categories, nom, id_parent, label FROM Categories WHERE id_parent IS NULL";

    if (nomCategorie) {
      query += ` AND nom = ?`;
      const categorie = await conn.query(query, [nomCategorie]);

      if (categorie.length > 0) {
        res.status(200).json(categorie);
      } else {
        res.status(404).json({ message: "Catégorie non trouvée" });
      }
    } else {
      const categories = await conn.query(query);
      res.status(200).json(categories);
    }

    await conn.end();
  } catch (err) {
    console.error("Erreur lors de la récupération des catégories :", err);
    res.status(500).json({ error: err });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { nom, id_parent, label } = req.body;

    const conn = await connectToDatabase();
    const result = await conn.query(
      "INSERT INTO Categories (nom,id_parent,label) VALUES (?, ?, ?)",
      [nom, id_parent, label],
    );

    await conn.end();

    res.status(200).json({ message: "Catégorie ajoutée avec succès", result });
  } catch (err) {
    console.error("Erreur lors de l'ajout du produit :", err);
    res.status(500).json({ error: err });
  }
  res.status(200).json({ message: "Catégorie ajouté avec succès" });
});
module.exports = router;
