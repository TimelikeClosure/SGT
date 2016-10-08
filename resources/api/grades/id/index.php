<?php
    
    $gradeId = intval($requestSubDir);
    
    //  Re-route request based upon requested resource and method
    $requestSubDir = array_shift($requestUriArray);
    
    switch ($requestSubDir){
        case null:  //  'api/grades'
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    require('get.php');
                    break;
                case 'PUT':
                    if ($apiKey === null || $apiKey === false) {returnError("Access Denied");}
                    require('put.php');
                    break;
                case 'DELETE':
                    require('delete.php');
                    break;
                default:
                    returnError("Bad Request, case null, bad method");
            }
            break;
        default:
            returnError("Bad Request, no match");
    }

?>