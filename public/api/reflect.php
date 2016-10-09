<?php
    
    //  If body is encoded in JSON, decode and write to $_POST
    if (!empty($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] == 'application/json'){
        $_POST = json_decode(file_get_contents('php://input'), true);
    }
    
    $_RESPONSE = [];
    
    $_RESPONSE['SERVER'] = $_SERVER;
    $_RESPONSE['QUERY'] = $_GET;
    $_RESPONSE['BODY'] = $_POST;
    
    print(json_encode($_RESPONSE));
    
?>