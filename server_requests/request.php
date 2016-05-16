<?php
    $INTERNAL_LOAD = true;
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
     * @return {Array} $output - associative array containing either bound response data or an error message
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
        returnError($output, "Access Denied");
    }
    //  Initiate connection with database
    require_once('connection.php');
    if ($conn->connect_errno) {
        returnError($output, "Failed to connect to database: {$conn->connect_errno}: {$conn->connect_error}");
    }
    //  Check for valid request characters & length
    $request = filter_input(INPUT_POST, 'request', FILTER_VALIDATE_REGEXP, ['options'=>['regexp'=>'/^(?:get_all|insert_row|delete_row)$/']]);
    switch ($request) {
        case 'get_all':
            require('get_all.php');
            break;
        case 'insert_row':
            require('insert_row.php');
            break;
        case 'delete_row':
            require('delete_row.php');
            break;
        default:
            returnError($output, "Bad Request");
    }
?>