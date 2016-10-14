<?php
    
    print(json_encode([
        'message' => 'You tried to update something!',
        'id' => $gradeId,
        '$_POST' => $_POST,
        '$_SERVER' => $_SERVER
    ]))
    
?>