<?php
    
    $page = intval(array_shift($requestUriArray));
    if ($page < 1){$page = 1;}
    
    $response = preparedStatement($conn, 'SELECT id, student_name, course_name, grade FROM grade_table', [], ['id', 'name', 'course', 'grade']);
    
    if (empty($response['success'])) {
        returnError($response['error_msg']);
    }
    $pageList = [];
    foreach($response['data'] as $key => $value) {
        $pageList[$key] = $value;
    }
    //  Output to client
    $RESPONSE['data'] = ['grades' => ['pages' => [$page => $pageList]]];
    $RESPONSE['success'] = true;
?>