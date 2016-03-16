<?php

    require_once('connection.php');

    if ($conn->connect_errno) {
        echo "Failed to connect to database: " . $conn->connect_error;
    } else {
        $query = "SELECT * FROM `grade_table`";
        $result = $conn->query($query);
        while ($row = $result->fetch_assoc()) {
            print("<p>"); print_r($row); print("</p>");
        }
    }
?>