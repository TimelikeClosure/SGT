<?php
    
    $response = preparedStatement($conn, 'SELECT course_name, grade, student_name FROM grade_table WHERE id=(?)', ['i', $gradeId], ['course', 'grade', 'name']);
    
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