const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const fs = require("fs/promises");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/rfid", (req, res) => {
  const rfidUID = req.body.rfid;
  console.log("Received RFID:", rfidUID);

  // Store the RFID UID in a text file
  const filePath = "rfidData.txt";

  // Write the RFID UID to the file (overwrite the existing content)
  fs.writeFile(filePath, rfidUID + "\n", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    } else {
      console.log("RFID UID stored in file:", filePath);
      res.json({ success: true });
    }
  });
});

app.get("/api/rfid/currentValue", async (req, res) => {
  try {
    // Read the current value from the text file
    const filePath = "rfidData.txt";
    const data = await fs.readFile(filePath, "utf-8");

    // Send the data as JSON response
    res.json({ rfidValue: data.trim() });
  } catch (error) {
    console.error("Error reading current value:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
  const email = req.body.email;
  const password = req.body.password;

  const sql = "SELECT * FROM `users` WHERE `email`= ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      return res.json({ error: err });
    }
    if (result.length > 0) {
      const storedHash = result[0].password;

      // Compare the password with the stored hash
      bcrypt.compare(password, storedHash, (err, passwordMatch) => {
        if (err) {
          return res.json({ error: err });
        }
        if (passwordMatch) {
          return res.json("Success");
        } else {
          return res.json({ error: "Invalid email or password" });
        }
      });
    } else {
      return res.json({ error: "Invalid email or password" });
    }
  });
});

// CRUD operations

// Create
app.post("/api/rfid", (req, res) => {
  const { rfidNumber, points, status } = req.body;
  const query =
    "INSERT INTO rfid (rfid_number, points, status) VALUES (?, ?, ?)";

  db.query(query, [rfidNumber, points, status], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(201).json({ message: "RFID added successfully" });
    }
  });
});

// Read
app.get("/api/rfid", (req, res) => {
  const query = "SELECT * FROM rfid";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
});

// Update
app.put("/api/rfid/:id", (req, res) => {
  const { id } = req.params;
  const { rfid_number, points, status } = req.body;
  const query =
    "UPDATE rfid SET rfid_number = ?, points = ?, status = ? WHERE id = ?";
  db.query(query, [rfid_number, points, status, id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send("RFID updated successfully");
    }
  });
});

// Delete
app.delete("/api/rfid/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM rfid WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send("RFID deleted successfully");
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
