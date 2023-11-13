<?php
// Your PHP script for handling the RFID check

// Assuming your database connection is established properly
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'revendo';

// Get the RFID number from the POST request
$rfidUID = $_POST['rfid'];

// Establish connection to the database
$mysqli = new mysqli($host, $user, $password, $database);

// Check for connection error
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Check if the RFID is present in the database
$query = "SELECT * FROM rfid WHERE rfid_number = '$rfidUID'";
$result = $mysqli->query($query);

// Check if the result set is not empty
if ($result->num_rows > 0) {
    echo "success";
} else {
    echo "failed";
}

$mysqli->close();
?>