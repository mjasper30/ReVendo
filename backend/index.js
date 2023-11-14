const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const fs = require("fs/promises");
const multer = require("multer");
const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Localhost Database - Create connection pool
const db = mysql.createPool({
  connectionLimit: 10, // Adjust this based on your needs
  host: "localhost",
  user: "root",
  password: "",
  database: "revendo",
});

// Hosting Database - Create connection pool
// const db = mysql.createPool({
//   connectionLimit: 10, // Adjust this based on your needs
//   host: "u943563710_revendo",
//   user: "u943563710_revendo",
//   password: "ReVendo2023!",
//   database: "u943563710_revendo",
// });

db.on("error", (err) => {
  console.error("Database error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    // Reconnect the database
    db.connect();
  } else {
    throw err;
  }
});

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

// Create new rfid
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

//Read all history in database
app.get("/api/history", (req, res) => {
  const query = "SELECT * FROM history";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
});

// Read all rfid in database
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

// Update rfid
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

// Delete rfid
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

// Read RFID to check if RFID is exist in the database
app.post("/check_rfid", (req, res) => {
  const rfidUID = req.body.rfid;
  console.log("Received RFID:", rfidUID);

  // Check the connection state before using it
  if (db.state === "disconnected") {
    console.log("Reconnecting to the database...");
    db.connect((err) => {
      if (err) {
        console.error("Database connection failed:", err);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
        return;
      }
      console.log("Database reconnected.");
      handleRFID();
    });
  } else {
    handleRFID();
  }

  function handleRFID() {
    // Check if the RFID is present in the database
    const query = "SELECT * FROM rfid WHERE rfid_number = ?";
    db.query(query, [rfidUID], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      } else {
        // Check if the result set is not empty
        if (result.length > 0) {
          // Check if an object is detected (you may need to modify this logic based on your requirements)
          const objectDetected = true; // Update this based on your object detection logic

          // Respond with "yes" if an object is detected, "no_object" if no object is detected
          const response = { result: objectDetected ? "yes" : "no_object" };
          res.json(response);
        } else {
          // RFID is not registered in the database
          const response = { result: "no" };
          res.json(response);
        }
      }
    });
  }
});

// Get the current rfid value in text file
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

// Insert data in history to every object detected in the machine
app.post("/addDataHistory", upload.single("image"), (req, res) => {
  const { rfid, height, no_object } = req.body;
  const image = req.file ? req.file.buffer : null;
  const query =
    "INSERT INTO history (rfid_number, height, captured_image, is_valid) VALUES (?, ?, ?, ?)";

  db.query(query, [rfid, height, image, no_object], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Add data to history successfully" });
    }
  });
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
