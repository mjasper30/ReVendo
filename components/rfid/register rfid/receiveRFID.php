<?php
// Check if the POST request contains the 'rfid' parameter
if (isset($_POST['rfid'])) {
    // Retrieve the RFID number from the POST request
    $rfid = $_POST['rfid'];

    // You can perform further processing with the RFID data here
    // For example, you can save it to a database or perform some other actions

    $Write = "<?php $" . "UIDresult='$rfid'; " . "echo $" . "UIDresult;" . " ?>";
file_put_contents('UIDContainer.php', $Write);

// Send the RFID data back as a response
echo $rfid;

// Sample response for the NodeMCU
// $response = array('status' => 'success', 'message' => 'RFID received successfully');
// echo json_encode($response);
} else {
// If the 'rfid' parameter is not found in the POST request
echo "RFID not received";

// If the 'rfid' parameter is not found in the POST request
// $response = array('status' => 'error', 'message' => 'RFID not received');
// echo json_encode($response);
}
?>