<?php
    
    //  Create skeleton output array
    $output = [
        'data' => [],
        'success' => null
    ];
    
    if(empty($_GET['content'])){
        returnError($output, "Bad Request");
    }
    
    switch ($_GET['content']){
        case "grades":
            require('grades/index.php');
            break;
        default:
            returnError($output, "Bad Request");
    }
    
?>
