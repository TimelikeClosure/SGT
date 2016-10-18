<?php
    
    $dbOutputKeys = ['name', 'course', 'grade'];
    
    $response = preparedStatement($conn, 'SELECT student_name, course_name, grade FROM grade_table WHERE id=(?)', ['i', $gradeId], $dbOutputKeys);
    
    if (empty($response['success'])) {
        returnError($response['error_msg']);
    }
    $record = [];
    for ($i = 0; $i < count($dbOutputKeys); $i++){
        $record[$dbOutputKeys[$i]] = $response['data'][0][$dbOutputKeys[$i]];
    }
    //  Output to client
    $RESPONSE['data'] = ['grades' => ['records' => [$gradeId => $record]]];
    $RESPONSE['success'] = true;
?>