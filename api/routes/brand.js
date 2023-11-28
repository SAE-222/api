const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');

router.get('/:nom_marque?', async (req, res, next) => {
    const nomMarque = req.params.nom_marque;

    try {
        const conn = await connectToDatabase();
        let query = 'SELECT id_marque, nom, logo_marque, pays, adresse, tel FROM Marque';

        // Vérifie s'il y a un nom de marque spécifique fourni dans l'URL
        if (nomMarque) {
            query += ' WHERE nom = ?';
            const marque = await conn.query(query, [nomMarque]);

            if (marque.length > 0) {
                res.status(200).json(marque);
            } else {
                res.status(404).json({ message: "Marque non trouvée" });
            }
        } else {
            const marques = await conn.query(query);
            res.status(200).json(marques);
        }

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des marques :', err);
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { nom,logo_marque,pays,adresse,tel } = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Marque (nom,logo_marque,pays,adresse,tel) VALUES (?, ?, ?,?,?)',
            [nom,logo_marque,pays,adresse,tel]
        );

        res.status(200).json({ message: 'Marque ajoutée avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Marque ajouté avec succès',});
});

router.delete('/:IdMarque',async (req, res) => {
  const IdMarque = req.params.IdProduit;
  const query = 'DELETE FROM Marque WHERE id_marque = ?';

  const conn = await connectToDatabase()
  conn.query(query, [IdMarque], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de la marque :', err);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Marque non trouvée'});
      } else {
        res.json({ message: 'Marque supprimée avec succès'});
      }
    }
  });
});

module.exports = router;