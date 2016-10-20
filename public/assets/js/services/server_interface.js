/**
 * @file Creates an interface for interacting with the server's API.
 * @author Tim Horist Jr.
 */

/**
 * @name serverInterface
 * @type {angular.factory}
 * @description Angular service which acts as an interface for interacting with the server's API.
 */
sgt.factory('serverInterface', ['$q', '$http', function($q, $http){
    function ServerInterface(){

        /**
         * @name baseUrl
         * @type {string}
         * @summary The base URI for all server API requests
         */
        var baseUrl = 'api/';

        /**
         * @method getGradeDetails
         * @param id
         * @returns {Promise}
         * @summary Attempts to return grade record details for the record with the given id.
         */
        this.getGradeDetails = function(id){

            var result = $q.defer();
            var url = baseUrl + 'grades/' + id;

            $http.get(url).then(function(response){
                if (response.hasOwnProperty('data') &&
                    response.data.hasOwnProperty('success') &&
                    response.data.success &&
                    response.data.hasOwnProperty('data')){
                    result.resolve(response.data.data);
                } else {
                    result.reject(response);
                }
            }, function(response){
                result.reject(response);
            });

            return result.promise;
        };

    }

    return new ServerInterface();
}]);