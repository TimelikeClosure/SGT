<?php

    require_once('connection.php');

    $output = [
        'data' => [],
        'success' => null
    ];

    if ($conn->connect_errno) {
        echo "Failed to connect to database: {$conn->connect_errno}: {$conn->connect_error}";
    } else {
        $preparedStatement = $conn->prepare('SELECT course_name, grade, id, student_name FROM grade_table');
        if (!$preparedStatement) {
            print "Prepare failed: (" . $conn->errno . ") " . $conn->error;
        }
        if (!$preparedStatement->execute()) {
            print("Execute failed: ({$preparedStatement->errno}) {$preparedStatement->error}");
        }
        $result = [];
        $preparedStatement->bind_result($result['course'], $result['grade'], $result['id'], $result['student']);
        if (!$result){
            print("Result failed: ({$preparedStatement->errno}) {$preparedStatement->error}");
        }
        while ($preparedStatement->fetch()) {
            $temp['course'] = $result['course'];
            $temp['grade'] = $result['grade'];
            $temp['id'] = $result['id'];
            $temp['student'] = $result['student'];
            $output['data'][] = $temp;
        }
        $preparedStatement->close();
        if ($output['success'] === null) {
            $output['success'] = true;
        }
        print(json_encode($output));
    }
?>