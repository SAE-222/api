const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../configs/conn');
const cors = require('cors');
router.use(cors({methods: ['GET','POST','DELETE']}));

router.get('/', async (req, res, next) => {
    try {
        const conn = await connectToDatabase();
        const groups = await conn.query('SELECT * FROM Favoris');

        res.status(200).json(groups);

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des favoris :', err);
        res.status(500).json({ error: err });
    }
});


router.post('/', async (req, res, next) => {
    try {
        const {id_client,id_produit} = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Favoris (id_client) VALUES (?) RETURNING id_favori',
            [id_client]
        );
        await conn.query('INSERT INTO Ajouter (id_produit,id_favori) VALUES (?, ?)', [id_produit, result[0].id_favori]);

        res.status(200).json({ message: 'Favori ajouté avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du favori :', err);
        res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Favori ajouté avec succès',});
});

router.delete('/:IdFavori',async (req, res) => {
    const IdFavori = req.params.IdFavori;
    const query = 'DELETE FROM Favoris WHERE id_favori = ?';
  
    const conn = await connectToDatabase()
    conn.query(query, [IdFavori], (err, results) => {
      if (err) {
        console.error('Erreur lors de la suppression du favori :', err);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Favori non trouvé' });
        } else {
          res.json({ message: 'Favori supprimé avec succès' });
        }
      }
    });
});

module.exports = router;