const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

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
  const sql =
    "INSERT INTO `users`(`name`, `email`, `password`, `role`) VALUES (?)";
  const values = [req.body.fullname, req.body.email, req.body.password, "user"];
  db.query(sql, [values], (err, result) => {
    if (err) {
      return res.json({ error: err });
    }
    return res.json(result);
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
