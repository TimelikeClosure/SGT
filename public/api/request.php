<?php
    
    define('RESOURCES', '../../resources/');
    //require_once(RESOURCES . 'modules.php');
    /**
     * returnError - Returns an error through JSON with the given error message.
     * @param {Array} $output - associative array to use for conveying error.
     * @param {string} $errorMessage - error message.
     */
    function returnError($errorMessage) {
        $RESPONSE = $GLOBALS['RESPONSE'];
        $RESPONSE['success'] = false;
        $RESPONSE['messages'][] = $errorMessage;
        print(json_encode($RESPONSE));
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
        if (!$preparedStatement) {
            $output['success'] = false;
            $output['error_no'] = $connection->errno;
            $output['error_msg'] = $connection->error;
            return $output;
        }
        /** Binds input parameters to the prepared statement, if provided. */
        if (!empty($inputParameters)) {
            $status = $preparedStatement->bind_param(...$inputParameters);
            if (!$status) {
                $output['success'] = false;
                $output['error_no'] = $connection->errno;
                $output['error_msg'] = $connection->error;
                return $output;
            }
        }
        /** Sends the input parameters to the server to be inserted into the previously sent statement. */
        if (!$preparedStatement->execute()) {
            $output['success'] = false;
            $output['error_no'] = $connection->errno;
            $output['error_msg'] = $connection->error;
            return $output;
        }
        /**
         * Creates variables with names given by the strings in $outputKeys. For example:
         * if $outputKeys == ["keyName1", "keyName2", "keyName3"],
         * then $outputParameters == [$keyName1, $keyName2, $keyName3].
         */
        if (count($outputKeys) > 0){
            foreach($outputKeys as $keyString) {
                $outputParameters[] = $keyString;
            }
            /** Binds output columns to the resulting output parameters. */
            $preparedStatement->bind_result(...$outputParameters);
            if (!$outputParameters) {
                $output['success'] = false;
                $output['error_no'] = $connection->errno;
                $output['error_msg'] = $connection->error;
                return $output;
            }
        }
        /**
         * Fetches all rows and stores them for output. For example:
         * if $outputKeys == ["keyName1", "keyName2", "keyName3"]
         * and the resulting query has row values ["value1", "value2", "value3"] in row 0,
         * then $output['data'][0] == ["keyName1" => "value1", "keyName2" => "value2", "keyName3" => "value3"]
         */
        while($preparedStatement->fetch()) {
            $output['success'] = true;
            foreach($outputKeys as $index => $key) {
                $row[$key] = $outputParameters[$index];
            }
            $output['data'][] = $row;
        }
        if (!empty($preparedStatement->insert_id)) {
            $output['success'] = true;
            $output['data']['id'] = $preparedStatement->insert_id;
        } else if ($output['success'] == null) {
            $output['success'] = false;
            $output['error_no'] = null;
            $output['error_msg'] = 'Empty data set';
        }
        /** Close the prepared statement and return output. */
        $preparedStatement->close();
        return $output;
    }
    
    //  Check body MIME type and re-write $_POST as necessary
    if (!empty($_SERVER['CONTENT_TYPE'])){
        switch ($_SERVER['CONTENT_TYPE']){
            case 'application/json':    //  Body is encoded in JSON
                $_POST = json_decode(file_get_contents('php://input'), true);
                break;
            case 'application/x-www-form-urlencoded':   //  Body is url-encoded
                break;
            default:
                break;
        }
    }

    //  Initiate connection with database
    require_once(RESOURCES.'config.php');
    
    //  Break REQUEST_URI into array of sub-folders, then remove everything up through 'api/'
    $requestUriArray = explode('/', $_SERVER['REQUEST_URI']);
    while ($requestUriArray[0] !== 'api' && count($requestUriArray) > 0){   //  shift off everything before 'api/'
        array_shift($requestUriArray);
    }
    array_shift($requestUriArray);  //  shift off 'api/'
    
    //  Initialize response object
    $RESPONSE = [
        'success' => null,
        'messages' => [],
        'data' => []
    ];
    
    //  Re-route request to '/resources/api' index
    require(RESOURCES.'api/index.php');
    
    //  Send response object
    echo json_encode($RESPONSE);
    
?>
