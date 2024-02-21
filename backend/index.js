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

// Read all history in database
app.get("/api/history", (req, res) => {
  const query = "SELECT * FROM history";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // Process the longblob data before sending the response
      const processedResult = result.map((row) => {
        // Assuming 'your_longblob_column' is the name of the longblob column in your table
        const longblobData = row.captured_image;

        // Convert the longblob data to a base64 string or any other suitable format
        const base64Data = Buffer.from(longblobData).toString("base64");

        // Include the processed data in the result
        return {
          ...row,
          captured_image: base64Data,
        };
      });

      res.status(200).json(processedResult);
    }
  });
});

// Read all user in database
app.get("/api/account", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
});

// Add new user in database
app.post("/api/account", (req, res) => {
  const saltRounds = 10; // Number of salt rounds for hashing

  // Hash the password
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      return res.json({ error: err });
    }

    const sql =
      "INSERT INTO `users`(`name`, `email`, `gender`, `password`, `role`) VALUES (?)";
    const values = [
      req.body.fname,
      req.body.email,
      req.body.gender,
      hash,
      req.body.roles,
    ];
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(201).json({ message: "User added successfully" });
    });
  });
});

app.put("/api/account/:id", async (req, res) => {
  const saltRounds = 10; // Number of salt rounds for hashing

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const sql =
      "UPDATE users SET name = ?, email = ?, gender = ?, password = ?, role = ? WHERE id = ?";
    const values = [
      req.body.fname,
      req.body.email,
      req.body.gender,
      hashedPassword,
      req.body.roles,
      req.params.id, // Correct the parameter to req.params.id
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ message: "User updated successfully" });
      }
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete user
app.delete("/api/account/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send("RFID deleted successfully");
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

// API endpoint for checking balance
app.post("/check_balance", (req, res) => {
  const { rfid } = req.body;

  const query = `SELECT points FROM rfid WHERE rfid_number = '${rfid}'`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.length > 0) {
        const points = result[0].points;
        res.json(points);
      } else {
        res.status(404).json({ error: "RFID not found" });
      }
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
          // Extract points information from the result (assuming there is a 'points' field in the database)
          const points = result[0].points || 0;

          // Check if an object is detected (you may need to modify this logic based on your requirements)
          const objectDetected = true; // Update this based on your object detection logic

          // Respond with "yes" if an object is detected, "no_object" if no object is detected
          const response = {
            result: objectDetected ? "yes" : "no_object",
            points: points,
          };
          res.json(response);

          // Log points information to console
          console.log("Points:", points);
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
  const { rfid, height, weight, size, no_object } = req.body;
  const image = req.file ? req.file.buffer : null;
  const query =
    "INSERT INTO history (rfid_number, height, weight, size, captured_image, is_valid) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [rfid, height, weight, size, image, no_object],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Add data to history successfully" });
      }
    }
  );
});

// Update points of user
app.post("/updatePoints", (req, res) => {
  const { rfid, additionalPoints } = req.body;

  // Retrieve current points from the database
  db.query(
    "SELECT points FROM rfid WHERE rfid_number = ?",
    [rfid],
    (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        // RFID not found, handle accordingly
        res.status(404).send("RFID not found.");
      } else {
        const currentPoints = results[0].points;
        const updatedPoints = currentPoints + additionalPoints;

        // Update points in the database
        db.query(
          "UPDATE rfid SET points = ? WHERE rfid_number = ?",
          [updatedPoints, rfid],
          (updateError) => {
            if (updateError) throw updateError;

            res.status(200).send("Points updated successfully.");
          }
        );
      }
    }
  );
});

app.post("/minusPoints", (req, res) => {
  const { rfid, updatedBalance } = req.body;

  // Retrieve current points from the database
  db.query(
    "SELECT points FROM rfid WHERE rfid_number = ?",
    [rfid],
    (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        // RFID not found, handle accordingly
        res.status(404).send("RFID not found.");
      } else {
        // Update points in the database
        db.query(
          "UPDATE rfid SET points = ? WHERE rfid_number = ?",
          [updatedBalance, rfid],
          (updateError) => {
            if (updateError) throw updateError;

            res.status(200).send("Points updated successfully.");
          }
        );
      }
    }
  );
});

// API endpoint to get the status and time
app.get("/charging_station", (req, res) => {
  const query =
    "SELECT status, time FROM charging_station WHERE station_id = 1"; // Assuming id is 1 for simplicity

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "Data not found" });
    } else {
      const { status, time } = results[0];
      res.json({ status, time });
    }
  });
});

// API endpoint to update the station status and time
app.put("/updateStation", (req, res) => {
  const { status, time } = req.body;

  // Assuming you have a table named 'charging_station' with columns 'status' and 'time'
  const query =
    "UPDATE charging_station SET status = ?, time = ? WHERE station_id = 1"; // Assuming id is 1 for simplicity

  db.query(query, [status, time], (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.json({ message: "Station updated successfully" });
  });
});

// API endpoint to update the status and time
app.put("/update_charging_station", (req, res) => {
  const { status, time } = req.body;

  // Assuming you have a table named 'charging_station' with columns 'status' and 'time'
  const query =
    "UPDATE charging_station SET status = ?, time = ? WHERE station_id = 1"; // Assuming id is 1 for simplicity

  db.query(query, [status, time], (err, results) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.json({ message: "Database updated successfully" });
  });
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
