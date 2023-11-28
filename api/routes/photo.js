const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');

router.get('/', async (req, res, next) => {
    try {
        const conn = await connectToDatabase();
        const groups = await conn.query('SELECT id_photo,ordre,liens,id_produit  FROM Photo');

        res.status(200).json(groups);

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des commande :', err);
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const {ordre,liens,id_produit} = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Photo (ordre,liens,id_produit) VALUES (?, ?, ?)',
            [ordre,liens,id_produit]
        );

        res.status(200).json({ message: 'Photo ajoutée avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
});

router.delete('/:IdPhoto', async (req, res) => {
  const IdPhoto = req.params.IdProduit;
  const query = 'DELETE FROM Photo WHERE id_photo = ?';

  const conn = await connectToDatabase()
  conn.query(query, [IdPhoto], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de la photo :', err);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Photo non trouvée' });
      } else {
        res.json({ message: 'Photo supprimée avec succès' });
      }
    }
  });
});

module.exports = router;