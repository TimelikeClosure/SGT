<?php
    if (empty($INTERNAL_LOAD) || $INTERNAL_LOAD !== true) {
        http_response_code(403);
        exit();
    }
    
    print(json_encode([
        'message' => 'You tried to delete something!',
        '$_POST' => $_POST
    ]))
    
?>