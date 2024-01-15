const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../configs/conn");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
router.use(cors({ methods: ["POST"] }));

const secretKey = crypto.randomBytes(64).toString("hex");
router.post("/", async (req, res, _next) => {
  const { email, password } = req.body;

  const conn = await connectToDatabase();
  const queryResp = await conn.query(
    "SELECT Client.id_client, password AS hashedPassword, nom, prenom, age, email, tel FROM Client,Connexion WHERE Client.id_client = Connexion.id_client AND Client.email = (?)",
    [email],
  );

  if (queryResp.length > 0) {
    const object = queryResp[0];
    const hashedPassword = object.hashedPassword;

    if (await bcrypt.compare(password, hashedPassword)) {
      const token = jwt.sign(
        {
          clientId: object.id_client,
          email,
          password: hashedPassword,
        },
        secretKey,
      );

      return res.json({
        accessToken: token,
        data: {
          id: object.id_client,
          lastName: object.nom,
          firstName: object.prenom,
          age: object.age,
          email: object.email,
          phone: object.tel,
          password: object.hashedPassword,
        },
      });
    }
  }

  return res.status(401).json({ error: "Email ou mot de passe incorrect" });
});

module.exports = router;
