const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');

router.get('/:clientId?', async (req, res, next) => {
    const clientId = req.params.clientId;

    try {
        const conn = await connectToDatabase();
        let query = 'SELECT id_client, nom, prenom, age, email, tel, date_inscription, Sexe FROM Client';

        if (clientId) {
            query += ` WHERE id_client = ${clientId}`;
            const client = await conn.query(query);

            if (client.length > 0) {
                res.status(200).json(client[0]);
            } else {
                res.status(404).json({ message: 'Client non trouvé' });
            }
        } else {
            const clients = await conn.query(query);
            res.status(200).json(clients);
        }

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des clients :', err);
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const {nom,prenom,age,email,tel,date_inscription,motdepasse,Sexe} = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Client(nom,prenom,age,email,tel,date_inscription,motdepasse,Sexe) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nom,prenom,age,email,tel,date_inscription,motdepasse,Sexe]
        );

        res.status(200).json({ message: 'Client ajouté avec succès', result });
        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;