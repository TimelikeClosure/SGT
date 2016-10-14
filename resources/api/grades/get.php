<?php
    
    $page = intval(array_shift($requestUriArray));
    if ($page < 1){$page = 1;}
    
    //  Get rows from database that match api_key
    /*$response = preparedStatement($conn, 'SELECT id, read_own, read_all FROM user_table WHERE api_key=(?)', ['s', $apiKey], ['userId', 'readOwn', 'readAll']);
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
    } else {*/
        //  Else get all available grades from the database
        $response = preparedStatement($conn, 'SELECT course_name, grade, id, student_name FROM grade_table', [], ['course', 'grade', 'id', 'name']);
    /*}*/
    if (empty($response['success'])) {
        returnError($output, $response['error_msg']);
    }
    foreach($response as $key => $value) {
        $output[$key] = $value;
    }
    //  Output to client
    $output['success'] = true;
    print(json_encode($output));
?>