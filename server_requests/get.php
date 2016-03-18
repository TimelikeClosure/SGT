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
    /**
     * preparedStatement - Creates, binds, and executes a prepared statement of the given MySQL query. Returns results from that query or an error message.
     * @param {Object} $connection - mysqli connection object
     * @param {string} $queryString - MySQL query string from which to create a mysqli prepared statement
     * @param {Array} $inputKeys - array of input variables to bind to prepared statement
     * @param {string[]} $outputKeys - array of output key names to bind output to
     * @return {Array} $output - associative array containing either bound response data on an error message
     */
    function preparedStatement($connection, $queryString, $inputParams, $outputKeys) {
        //$output['status'][] = 'entered preparedStatement()';
        $preparedStatement = $connection->prepare($queryString);
        if (!$preparedStatement) {
            $output['error_msg'] = "Prepare failed: (" . $connection->errno . ") " . $connection->error;
            return $output;
        }
        //$output['status'][] = 'statement prepared';
        if (!empty($inputParams)) {
            foreach($inputParams as $keyString) {
                $output['inputParams'][] = $keyString;
            }
            $status = $preparedStatement->bind_param(...$inputParams);
            if (!$status) {
                $output['error_msg'] = "Bind_param failed: ({$preparedStatement->errno}) {$preparedStatement->error}";
                return $output;
            }
            //$output['status'][] = 'parameters bound';
        }
        if (!$preparedStatement->execute()) {
            $output['error_msg'] = "Execute failed: ({$preparedStatement->errno}) {$preparedStatement->error}";
            return $output;
        }
        //$output['status'][] = 'statement executed';
        foreach($outputKeys as $keyString) {
            $outputParams[] = $$keyString;
        }
        $preparedStatement->bind_result(...$outputParams);
        if (!$outputParams) {
            $output['error_msg'] = "Bind_result failed: ({$preparedStatement->errno}) {$preparedStatement->error}";
            return $output;
        }
        //$output['status'][] = 'results bound';
        while($preparedStatement->fetch()) {
            foreach($outputKeys as $index => $key) {
                $row[$key] = $outputParams[$index];
            }
            $output['data'][] = $row;
        }
        $preparedStatement->close();
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
    //  Get rows from database that match api_key
    $response = preparedStatement($conn, 'SELECT id, read_own, read_all FROM user_table WHERE api_key=(?)', ['s', $apiKey], ['userId', 'readOwn', 'readAll']);
    if (!empty($response['error_msg'])) {
        returnError($output, $response['error_msg']);
    }
    //  If set of rows returned is empty or no read permissions, throw access denied error
    if (empty($response['data'][0]['readOwn'])) {
        returnError($output, 'Access Denied');
    }
    //  If read permissions are limited to self, only query own entries
    if (empty($response['data'][0]['readAll'])) {
        $response = preparedStatement($conn, 'SELECT course_name, grade, id, student_name FROM grade_table WHERE user_id=(?)', ['i', $response['data'][0]['userId']], ['course', 'grade', 'id', 'name']);
    } else {
        //  Else get all available grades from the database
        $response = preparedStatement($conn, 'SELECT course_name, grade, id, student_name FROM grade_table', [], ['course', 'grade', 'id', 'name']);
    }
    if (!empty($response['error_msg'])) {
        returnError($output, $response['error_msg']);
    }
    foreach($response as $key => $value) {
        $output[$key] = $value;
    }
    //  Output to client
    $output['success'] = true;
    print(json_encode($output));
?>