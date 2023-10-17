const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "revendo",
});

app.post("/signup", (req, res) => {
  const saltRounds = 10; // Number of salt rounds for hashing

  // Hash the password
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      return res.json({ error: err });
    }

    const sql =
      "INSERT INTO `users`(`name`, `email`, `password`, `role`) VALUES (?)";
    const values = [req.body.fullname, req.body.email, hash, "user"];
    db.query(sql, [values], (err, result) => {
      if (err) {
        return res.json({ error: err });
      }
      return res.json(result);
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM `users` WHERE `email`= ? AND `password` = ?";
  db.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      return res.json({ error: err });
    }
    if (result.length > 0) {
      return res.json("Success");
    } else {
      return res.json({ error: "Invalid email or password" });
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
