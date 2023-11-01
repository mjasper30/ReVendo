<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $rfidData = $_POST["rfidData"];

    // Perform the database insertion here
    // You need to establish a database connection and execute an INSERT query

    // Example code for MySQL database:
    $db = new mysqli("localhost", "root", "", "revendo");
    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    }

    $sql = "INSERT INTO rfid (rfid_number) VALUES ('$rfidData')";

    if ($db->query($sql) === TRUE) {
        echo "Data added to the database successfully.";
    } else {
        echo "Error: " . $sql . "<br>" . $db->error;
    }

    $db->close();
}
?>