<?php
    //  Create skeleton output array
    $output = [
        'data' => [],
        'success' => null
    ];
    /**
     * returnError - Returns an error through JSON with the given error message.
     * @param {Array} $output - associative array to use for conveying error.
     * @param {string} $errorMessage - error message.
     */
    function returnError($output, $errorMessage) {
        $output['success'] = false;
        $output['error_msg'] = $errorMessage;
        print(json_encode($output));
        exit();
    }
    //  Check for valid API Key characters & length
    $apiKey = filter_input(INPUT_POST, 'api_key', FILTER_VALIDATE_REGEXP, ['options'=>['regexp'=>'/^[a-z0-9]{64}$/i']]);
    if ($apiKey === null || $apiKey === false) {
        $output['api_key'] = $_POST['api_key'];
        $output['apiKey'] = $apiKey;
        returnError($output, "Access Denied");
        exit();
    }
    //  Initiate connection with database
    require_once('connection.php');
    if ($conn->connect_errno) {
        returnError($output, "Failed to connect to database: {$conn->connect_errno}: {$conn->connect_error}");
    }



    $preparedStatement = $conn->prepare('SELECT course_name, grade, id, student_name FROM grade_table');
    if (!$preparedStatement) {
        returnError($output, "Prepare failed: (" . $conn->errno . ") " . $conn->error);
    }
    if (!$preparedStatement->execute()) {
        returnError($output, "Execute failed: ({$preparedStatement->errno}) {$preparedStatement->error}");
    }
    $preparedStatement->bind_result($result['course'], $result['grade'], $result['id'], $result['student']);
    if (!$result){
        returnError($output, "Result failed: ({$preparedStatement->errno}) {$preparedStatement->error}");
    }
    while ($preparedStatement->fetch()) {
        $temp['course'] = $result['course'];
        $temp['grade'] = $result['grade'];
        $temp['id'] = $result['id'];
        $temp['name'] = $result['student'];
        $output['data'][] = $temp;
    }
    $preparedStatement->close();
    if ($output['success'] === null) {
        $output['success'] = true;
    }
    print(json_encode($output));
?>