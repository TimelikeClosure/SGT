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
    function preparedStatement($connection, $output, $queryString, $inputParams, $outputKeys) {
        $output['status'][] = 'entered preparedStatement()';
        $preparedStatement = $connection->prepare($queryString);
        if (!$preparedStatement) {
            returnError($output, "Prepare failed: (" . $connection->errno . ") " . $connection->error);
        }
        $output['status'][] = 'statement prepared';
        if (!empty($inputParams)) {
            $status = call_user_func_array(array($preparedStatement, 'bind_param'), $inputParams);
            if (!$status) {
                returnError($output, "Execute failed: ({$preparedStatement->errno}) {$preparedStatement->error}");
            }
            $output['data'][] = 'parameters bound';
        }
        if (!$preparedStatement->execute()) {
            returnError($output, "Execute failed: ({$preparedStatement->errno}) {$preparedStatement->error}");
        }
        $output['status'][] = 'statement executed';

        foreach($outputKeys as $keyString) {
            $outputParams[] = $$keyString;
        }
        $output['outputParams'][] = $outputParams;

        $preparedStatement->bind_result(...$outputParams);
        if (!$outputParams) {
            returnError($output, "Result failed: ({$preparedStatement->errno}) {$preparedStatement->error}");
        }
        $output['status'][] = 'results bound';
        while($preparedStatement->fetch()) {
            $temp = [];
            foreach($outputParams as $keyVar) {
                $temp['value'][] = $keyVar;
                $output['$keyVar'][] = $keyVar;
            }
            foreach($outputKeys as $keyString) {
                $output['keyString'][] = $keyString;
                $temp['key'][] = $keyString;
            }
            foreach($temp['key'] as $index => $key) {
                $temp2[$key] = $temp['value'][$index];
            }
            $output['data'][] = $temp2;
        }


        return $output;
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

    $output = preparedStatement($conn, $output, 'SELECT course_name, grade, id, student_name FROM grade_table', [], ['course', 'grade', 'id', 'name']);

    /*$preparedStatement = $conn->prepare('SELECT course_name, grade, id, student_name FROM grade_table');
    if (!$preparedStatement) {
        returnError($output, "Prepare failed: (" . $conn->errno . ") " . $conn->error);
    }
    if (!$preparedStatement->execute()) {
        returnError($output, "Execute failed: ({$preparedStatement->errno}) {$preparedStatement->error}");
    }
    $result = [
        'course'=>null,
        'grade'=>null,
        'id'=>null,
        'student'=>null
    ];
    $test = '[
        $result["course"],
        $result["grade"],
        $result["id"],
        $result["student"]
    ]';
    $preparedStatement->bind_result(...($$test));
    //call_user_func_array([$preparedStatement, 'bind_result'], [$result['course'], $result['grade'], $result['id'], $result['student']]);
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
    }*/
    print(json_encode($output));
?>