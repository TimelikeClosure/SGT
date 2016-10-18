<?php
    
    $response = preparedStatement($conn, 'SELECT course_name, grade, student_name FROM grade_table WHERE id=(?)', ['i', $gradeId], ['course', 'grade', 'name']);
    
    if (empty($response['success'])) {
        returnError($response['error_msg']);
    }
    $record = [];
    foreach($response as $key => $value) {
        $record[$key] = $value;
    }
    //  Output to client
    $REQUEST['data'] = ['grades' => ['records' => [$gradeId => $record]]];
    $REQUEST['success'] = true;
?>