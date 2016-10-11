<?php
    
    //  Create skeleton output array
    $output = [
        'data' => [],
        'success' => null
    ];
    
    //  Re-route request based upon requested resource and method
    $requestSubDir = array_shift($requestUriArray);
    
    switch ($requestSubDir){
        case "grades":  //  'api/grades'
            require('grades/index.php');
            break;
        case null:  //  'api'
        default:
            returnError($output, "Bad Request, invalid content");
    }
    
?>
