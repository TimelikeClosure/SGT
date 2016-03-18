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
     * preparedStatement - Creates, binds, and executes a prepared statement of the given MySQL query. Returns results from that query if no errors occur, otherwise prints an error to the browser and halts script.
     * @param {Object} $connection - mysqli object
     * @param {Array} $output - associative array reference used to contain all output
     * @param {string} $queryString - MySQL query string from which to create a mysqli prepared statement
     * @param {string[]} $inputKeys - array of input variable names to bind to prepared statement
     * @param {string[]} $outputKeys - array of output key names to bind output to
     * @return {Array} mixed
     */
    function preparedStatement($connection, $output, $queryString, $inputKeys, $outputKeys) {
        //$output['status'][] = 'entered preparedStatement()';
        $preparedStatement = $connection->prepare($queryString);
        if (!$preparedStatement) {
            returnError($output, "Prepare failed: (" . $connection->errno . ") " . $connection->error);
        }
        //$output['status'][] = 'statement prepared';
        if (!empty($inputKeys)) {
            foreach($inputKeys as $keyString) {
                $inputParams[] = $$keyString;
            }
            $status = $preparedStatement->bind_param(...$inputParams);
            if (!$status) {
                returnError($output, "Execute failed: ({$preparedStatement->errno}) {$preparedStatement->error}");
            }
            //$output['status'][] = 'parameters bound';
        }
        if (!$preparedStatement->execute()) {
            returnError($output, "Execute failed: ({$preparedStatement->errno}) {$preparedStatement->error}");
        }
        //$output['status'][] = 'statement executed';
        foreach($outputKeys as $keyString) {
            $outputParams[] = $$keyString;
        }
        $preparedStatement->bind_result(...$outputParams);
        if (!$outputParams) {
            returnError($output, "Result failed: ({$preparedStatement->errno}) {$preparedStatement->error}");
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
    //  Query the database
    $output = preparedStatement($conn, $output, 'SELECT course_name, grade, id, student_name FROM grade_table', [], ['course', 'grade', 'id', 'name']);
    //  Output to client
    $output['success'] = true;
    print(json_encode($output));
?>