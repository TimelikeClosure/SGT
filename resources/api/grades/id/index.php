<?php
    
    //  Re-route request based upon requested resource and method
    switch($_SERVER['REQUEST_METHOD']){
        case 'DELETE':
            if ($apiKey === null || $apiKey === false) {returnError($output, "Access Denied");}
            require('delete.php');
            break;
        default:
            returnError($output, "Bad Request, case null, bad method");
    }
    
?>