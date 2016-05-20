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
     * preparedStatement - Creates, binds, and executes a prepared statement of the given MySQL query. Returns results from that query or an error message. Requires PHP 5.6 or later.
     * @uses require('MySQL_connect.php')
     * @param {Object} $connection - mysqli connection object.
     * @param {string} $queryString - MySQL query string from which to create a mysqli prepared statement. All places where a parameter is inserted must be replaced by (?).
     * @param {Array} $inputParameters - array of input variables to bind to prepared statement. The first index must contain a string with a letter for each following variable, indicating it's expected data type ('i' for integer, 'd' for double, 's' for string, and 'b' for blob).
     * @param {string[]} $outputKeys - array of strings, indicating which key names to bind output data to.
     * @return {Array} $output - associative array containing a success indicator and either bound response data or error data. Contains the following keys:
     *     'success' - indicates true if the query was successful, or false if it was unsuccessful.
     *     'data' - contains all results from the query, if the query was successful.
     *     'error_no' - contains the mysqli error number or null, if the query was unsuccessful.
     *     'error_msg' - contains the mysqli or custom error message, if the query was unsuccessful.
     */
    function preparedStatement($connection, $queryString, $inputParameters, $outputKeys) {
        $output['success'] = null;
        /** Sends the prepared statement, before any input parameters are inserted, to the server. */
        $preparedStatement = $connection->prepare($queryString);
        $output['progress'][] = "Statement sent";
        if (!$preparedStatement) {
            $output['success'] = false;
            $output['error_no'] = $connection->errno;
            $output['error_msg'] = $connection->error;
            return $output;
        }
        /** Binds input parameters to the prepared statement, if provided. */
        if (!empty($inputParameters)) {
            $status = $preparedStatement->bind_param(...$inputParameters);
            $output['progress'][] = "Input parameters bound";
            if (!$status) {
                $output['success'] = false;
                $output['error_no'] = $connection->errno;
                $output['error_msg'] = $connection->error;
                return $output;
            }
        }
        /** Sends the input parameters to the server to be inserted into the previously sent statement. */
        if (!$preparedStatement->execute()) {
            $output['progress'][] = "Statement executed";
            $output['success'] = false;
            $output['error_no'] = $connection->errno;
            $output['error_msg'] = $connection->error;
            return $output;
        }
        $output['progress'][] = "Statement executed";
        /**
         * Creates variables with names given by the strings in $outputKeys. For example:
         * if $outputKeys == ["keyName1", "keyName2", "keyName3"],
         * then $outputParameters == [$keyName1, $keyName2, $keyName3].
         */
        foreach($outputKeys as $keyString) {
            $outputParameters[] = $$keyString;
        }
        /** Binds output columns to the resulting output parameters. */
        $preparedStatement->bind_result(...$outputParameters);
        $output['progress'][] = "Output parameters bound";
        if (!$outputParameters) {
            $output['success'] = false;
            $output['error_no'] = $connection->errno;
            $output['error_msg'] = $connection->error;
            return $output;
        }
        /**
         * Fetches all rows and stores them for output. For example:
         * if $outputKeys == ["keyName1", "keyName2", "keyName3"]
         * and the resulting query has row values ["value1", "value2", "value3"] in row 0,
         * then $output['data'][0] == ["keyName1" => "value1", "keyName2" => "value2", "keyName3" => "value3"]
         */
        while($preparedStatement->fetch()) {
            $output['progress'][] = "Row fetched";
            $output['success'] = true;
            foreach($outputKeys as $index => $key) {
                $row[$key] = $outputParameters[$index];
            }
            $output['data'][] = $row;
        }
        if (!empty($preparedStatement->insert_id)) {
            $output['progress'][] = "Insert id obtained";
            $output['success'] = true;
            $output['insert_id'] = $preparedStatement->insert_id;
        } else if ($output['success'] == null) {
            $output['success'] = false;
            $output['error_no'] = null;
            $output['error_msg'] = 'Empty data set';
        }
        /** Close the prepared statement and return output. */
        $preparedStatement->close();
        return $output;
    }

    //  Check for valid API Key characters & length
    $apiKey = filter_var($_POST['api_key'], FILTER_VALIDATE_REGEXP, ['options'=>['regexp'=>'/^[a-z0-9]{64}$/i']]);
    if ($apiKey === null || $apiKey === false) {
        returnError($output, "Access Denied");
    }
    //  Initiate connection with database
    require_once('connection.php');
    if ($conn->connect_errno) {
        returnError($output, "Failed to connect to database: {$conn->connect_errno}: {$conn->connect_error}");
    }
    //  Check for valid request characters & length
    $request = filter_var($_POST['request'], FILTER_VALIDATE_REGEXP, ['options'=>['regexp'=>'/^(?:get_all|insert_row|delete_row)$/']]);
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