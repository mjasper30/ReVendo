<!DOCTYPE html>
<html>

<head>
    <title>RFID Display</title>
</head>

<body>
    <input type="text" id="rfidTextBox">
    <input type="number" id="pointsInput" placeholder="Points">
    <select id="statusInput">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
    </select>
    <button id="addRFIDButton">Add RFID Data</button>
    <div id="responseMessage"></div>

    <script>
    function updateRFID() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById("rfidTextBox").value = this.responseText;
            }
        };
        xhttp.open("GET", "UIDContainer.php", true);
        xhttp.send();
    }

    function addRFIDData() {
        var rfidData = document.getElementById("rfidTextBox").value;
        var pointsData = document.getElementById("pointsInput").value;
        var statusData = document.getElementById("statusInput").value;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById("responseMessage").innerText = this.responseText;
                // You can display an alert instead if you prefer
                // alert(this.responseText);
            }
        };
        xhttp.open("POST", "AddDataToDatabase.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("rfidData=" + rfidData + "&pointsData=" + pointsData + "&statusData=" + statusData);
    }

    // Fetch RFID data every 1 second
    setInterval(updateRFID, 1000);

    // Add a click event listener to the "Add RFID Data" button
    document.getElementById("addRFIDButton").addEventListener("click", addRFIDData);
    </script>
</body>

</html>