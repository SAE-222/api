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
});

router.delete('/:IdFavori',async (req, res) => {
    const IdFavori = req.params.IdFavori;
    try {
      const conn = await connectToDatabase();
  
      await conn.query('DELETE FROM Ajouter WHERE id_favori = ?', [IdFavori]);
  
      await conn.query('DELETE FROM Favoris WHERE id_favori = ?', [IdFavori]);
  
      conn.release();
  
      res.status(200).json({ message: 'Favori supprimé avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;