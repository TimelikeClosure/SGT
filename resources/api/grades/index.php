<?php
    
    //  Check for valid API Key characters & length
    $apiKey = filter_var(
        empty($_POST['api_key']) ? null : $_POST['api_key'],
        FILTER_VALIDATE_REGEXP,
        ['options'=>['regexp'=>'/^[a-z0-9]{64}$/i']]
    );
    
    if(!empty($_GET['id'])){
        require('id/index.php');
    } else {
        //  Check for valid request characters & length
        $request = filter_var($_POST['request'], FILTER_VALIDATE_REGEXP, ['options'=>['regexp'=>'/^(?:get_all|insert_row)$/']]);
        
        switch ($request) {
            case 'get_all':
                require('get.php');
                break;
            case 'insert_row':
                if ($apiKey === null || $apiKey === false) {returnError($output, "Access Denied");}
                require('post.php');
                break;
            default:
                returnError($output, "Bad Request");
        }
    }
    
?>
