<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $rfidData = $_POST["rfidData"];
    $pointsData = $_POST["pointsData"];
    $statusData = $_POST["statusData"];

    // Perform the database insertion here
    // You need to establish a database connection and execute an INSERT query

    // Example code for MySQL database:
    $db = new mysqli("localhost", "root", "", "revendo");
    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    }

    // Check if RFID already exists
    $checkQuery = "SELECT * FROM rfid WHERE rfid_number = '$rfidData'";
    $result = $db->query($checkQuery);
    if ($result->num_rows > 0) {
        echo "RFID already exists in the database. Please use a different RFID.";
    } else {
        $sql = "INSERT INTO rfid (`rfid_number`, `points`, `status`) VALUES ('$rfidData', '$pointsData', '$statusData')";

        if ($db->query($sql) === TRUE) {
            echo "Data added to the database successfully.";
        } else {
            echo "Error: " . $sql . "<br>" . $db->error;
        }
    }

    $db->close();
}
?>