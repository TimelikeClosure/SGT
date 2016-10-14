<?php
    
    print(json_encode([
        'message' => 'You tried to delete something!',
        'id' => $gradeId,
        '$_SERVER' => $_SERVER
    ]))
    
?>