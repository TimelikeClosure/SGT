<?php
    
    //  Check for valid request characters & length
    $request = filter_var($_POST['request'], FILTER_VALIDATE_REGEXP, ['options'=>['regexp'=>'/^delete_row$/']]);
    
    switch ($request) {
        case 'delete_row':
            require('delete_row.php');
            break;
        default:
            returnError($output, "Bad Request");
    }
    
?>