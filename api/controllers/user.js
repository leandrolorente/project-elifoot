import { db } from "../db.js";

export const getUsers = (_, res) => {
  const q = "SELECT * FROM tcoachrk06 order by rankingPosition asc";

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};
export const getUserElifoot = (req, res) => {
  const email = req.params.email;
  const password = req.query.password; // Modificado para obter a senha dos parâmetros da consulta

  // Consulta para obter o addressId com base no email
  const getAddressIdQuery = "SELECT addressId FROM taddr01 WHERE address = ?";

  db.query(getAddressIdQuery, [email], (err, result) => {
    if (err) return res.json(err);

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const addressId = result[0].addressId;

    // Consulta para obter o usuário usando JOIN nas tabelas taddr01 e tcoach02
    const getUserQuery = `
      SELECT taddr01.*, tcoach02.*
      FROM taddr01
      LEFT JOIN tcoach02 ON taddr01.addressId = tcoach02.addressId
      WHERE taddr01.addressId = ? AND tcoach02.password = ?
    `;

    db.query(getUserQuery, [addressId, password], (err, data) => {
      if (err) return res.json(err);

      if (data.length === 0) {
        return res.status(401).json({ error: "Invalid password" });
      }

      return res.status(200).json(data);
    });
  });
};

export const getUserByToken = (req, res) => {
  const token = req.params.token;

  // Consulta para obter o email com base no token
  const getEmailQuery = "SELECT address FROM taddr01 WHERE address = ?";

  db.query(getEmailQuery, [token], (err, result) => {
    if (err) return res.json(err);

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const email = result[0].address;

    // Consulta para obter o usuário usando JOIN nas tabelas taddr01 e tcoach02
    const getUserQuery = `
      SELECT taddr01.*, tcoach02.*
      FROM taddr01
      LEFT JOIN tcoach02 ON taddr01.addressId = tcoach02.addressId
      WHERE taddr01.address = ?
    `;

    db.query(getUserQuery, [email], (err, data) => {
      if (err) return res.json(err);

      if (data.length === 0) {
        return res.status(401).json({ error: "Invalid token" });
      }

      return res.status(200).json(data);
    });
  });
};

export const addUser = (req, res) => {
  const q =
    "INSERT INTO usuarios(`nome`, `email`, `fone`, `data_nascimento`) VALUES(?)";

  const values = [
    req.body.nome,
    req.body.email,
    req.body.fone,
    req.body.data_nascimento,
  ];

  db.query(q, [values], (err) => {
    if (err) return res.json(err);

    return res.status(200).json("Usuário criado com sucesso.");
  });
};

export const updateUser = (req, res) => {
  const q =
    "UPDATE usuarios SET `nome` = ?, `email` = ?, `fone` = ?, `data_nascimento` = ? WHERE `id` = ?";

  const values = [
    req.body.nome,
    req.body.email,
    req.body.fone,
    req.body.data_nascimento,
  ];

  db.query(q, [...values, req.params.id], (err) => {
    if (err) return res.json(err);

    return res.status(200).json("Usuário atualizado com sucesso.");
  });
};

export const deleteUser = (req, res) => {
  const q = "DELETE FROM usuarios WHERE `id` = ?";

  db.query(q, [req.params.id], (err) => {
    if (err) return res.json(err);

    return res.status(200).json("Usuário deletado com sucesso.");
  });
};
