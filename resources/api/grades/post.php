<?php
    if (empty($INTERNAL_LOAD) || $INTERNAL_LOAD !== true) {
        http_response_code(403);
        exit();
    }

    
    $studentName = filter_var(
        empty($_POST['name']) ? false : $_POST['name'],
        FILTER_VALIDATE_REGEXP,
        ['options'=>['regexp'=>'/^[A-Za-z -]+$/']]
    );
    if (empty($studentName)) {
        returnError($output, 'Invalid student name');
    }
    $studentCourse = filter_var(
        empty($_POST['course']) ? false : $_POST['course'],
        FILTER_VALIDATE_REGEXP,
        ['options'=>['regexp'=>'/[\w -]+$/']]
    );
    if (empty($studentCourse)) {
        returnError($output, 'Invalid course');
    }
    $studentGrade = filter_var(
        empty($_POST['grade']) ? false : $_POST['grade'],
        FILTER_VALIDATE_REGEXP,
        ['options'=>['regexp'=>'/^(?:100(?:\.(?:0))?|[0-9]{1,2}(?:\.(?:[0-9])?)?)$/']]
    );
    if (empty($studentGrade)) {
        returnError($output, 'Invalid student grade');
    }
    //  Get rows from database that match api_key
    $response = preparedStatement($conn, 'SELECT id, insert_own FROM user_table WHERE api_key=(?)', ['s', $apiKey], ['userId', 'insertOwn']);
    if (empty($response['success'])) {
        returnError($output, $response['error_msg']);
    }
    //  If set of rows returned is empty or no insert permissions, throw access denied error
    if (empty($response['data'][0]['insertOwn'])) {
        returnError($output, 'Access Denied');
    }
    //  Else get all available grades from the database
    $response = preparedStatement($conn,
        'INSERT INTO grade_table(grade, student_name, course_name, user_id) VALUES ((?), (?), (?), (?))',
        ['sssi', $studentGrade, $studentName, $studentCourse, $response['data'][0]['userId']],
        []
    );

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