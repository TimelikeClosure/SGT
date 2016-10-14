<?php
    
    //  Check for valid API Key characters & length
    $apiKey = filter_var(
        empty($_POST['api_key']) ? null : $_POST['api_key'],
        FILTER_VALIDATE_REGEXP,
        ['options'=>['regexp'=>'/^[a-z0-9]{64}$/i']]
    );
    
    //  Re-route request based upon requested resource and method
    $requestSubDir = array_shift($requestUriArray);
    
    switch ($requestSubDir){
        case null:  //  'api/grades'
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    require('get.php');
                    break;
                case 'POST':
                    if ($apiKey === null || $apiKey === false) {returnError($output, "Access Denied");}
                    require('post.php');
                    break;
                default:
                    returnError($output, "Bad Request, case null, bad method");
            }
            break;
        case 'page':    //  'api/grades/page'
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    if (empty($requestUriArray[0]) || $requestUriArray[0] !== strval(intval($requestUriArray[0]))){
                        returnError($output, "Bad Request, /page specified without valid page number");
                    }
                    require('get.php');
                    break;
                default:
                    returnError($output, "Bad Request, case page, bad method");
            }
            break;
        case preg_match('/^(?:0|[1-9][0-9]*)?/', $requestSubDir) ? $requestSubDir : !$requestSubDir:    //  'api/grades/:id'
            require('id/index.php');
            break;
        default:
            returnError($output, "Bad Request, no match");
    }
    
?>
