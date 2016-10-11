<?php
    if (empty($INTERNAL_LOAD) || $INTERNAL_LOAD !== true) {
        http_response_code(403);
        exit();
    }

?>