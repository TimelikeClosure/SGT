<?php
    
    $studentName = filter_var(
        empty($_POST['name']) ? false : $_POST['name'],
        FILTER_VALIDATE_REGEXP,
        ['options'=>['regexp'=>'/^[A-Za-z -]+$/']]
    );
    if (empty($studentName)) {
        returnError('Invalid student name');
    }
    $studentCourse = filter_var(
        empty($_POST['course']) ? false : $_POST['course'],
        FILTER_VALIDATE_REGEXP,
        ['options'=>['regexp'=>'/[\w -]+$/']]
    );
    if (empty($studentCourse)) {
        returnError('Invalid course');
    }
    $studentGrade = filter_var(
        empty($_POST['grade']) ? false : $_POST['grade'],
        FILTER_VALIDATE_REGEXP,
        ['options'=>['regexp'=>'/^(?:100(?:\.(?:0))?|[0-9]{1,2}(?:\.(?:[0-9])?)?)$/']]
    );
    if (empty($studentGrade)) {
        returnError('Invalid student grade');
    }
    //  Get rows from database that match api_key
    $response = preparedStatement($conn, 'SELECT id, insert_own FROM user_table WHERE api_key=(?)', ['s', $apiKey], ['userId', 'insertOwn']);
    if (empty($response['success'])) {
        returnError($response['error_msg']);
    }
    //  If set of rows returned is empty or no insert permissions, throw access denied error
    if (empty($response['data'][0]['insertOwn'])) {
        returnError('Access Denied');
    }
    //  Else get all available grades from the database
    $response = preparedStatement($conn,
        'INSERT INTO grade_table(grade, student_name, course_name, user_id) VALUES ((?), (?), (?), (?))',
        ['sssi', $studentGrade, $studentName, $studentCourse, $response['data'][0]['userId']],
        []
    );

    if (!empty($response['error_msg'])) {
        returnError($response['error_msg']);
    }
    $records = [];
    foreach($response as $key => $value) {
        $records[$key] = $value;
    }
    //  Output to client
    $RESPONSE['data'] = ['data' => ['grades' => ['records' => $records]]];
    $RESPONSE['success'] = true;

?>