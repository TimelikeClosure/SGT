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
         * @function httpRequest
         * @param {string} contentUri
         * @param {string} action
         * @param {string|Object} [body]
         * @returns {Promise}
         * @summary The base handler for all API requests and server responses.
         */
        var httpRequest = function httpRequest(contentUri, action, body){
            /**
             * @name baseUri
             * @type {string}
             * @summary The base URI for all server API requests
             */
            var baseUri = 'api/';
            var uri = baseUri + contentUri;
            var result = $q.defer();
            var request;
            switch(action){
                case "GET":
                    request = $http.get(uri);
                    break;
                case "POST":
                    request = body ? $http.post(uri, body) : $http.post(uri);
                    break;
                case "PUT":
                    request = body ? $http.put(uri, body) : $http.put(uri);
                    break;
                case "DELETE":
                    request = $http.delete(uri);
                    break;
                default:
                    return null;
            }
            request.then(function(response){
                var output = {};
                if (!response.hasOwnProperty('data')){
                    output.errorLayer = 'http';
                    output.response = response;
                    result.reject(output);
                } else {
                    output.status = response.status;
                    output.messages = response.data.hasOwnProperty('messages')
                        ? response.data.messages
                        : null;
                    output.data = response.data.hasOwnProperty('data')
                        ? response.data.data
                        : null;
                    if (!response.data.hasOwnProperty('success') || !response.data.success){
                        output.errorLayer = 'application';
                        result.reject(output);
                    } else {
                        result.resolve(output);
                    }
                }
            }, function(response){
                result.reject({
                    errorLayer: 'http',
                    response: response
                });
            });
            return result.promise;
        };

        /**
         * @method getGradeRecordDetails
         * @param id
         * @returns {Promise}
         * @summary Attempts to return grade record details for the record with the given id.
         */
        this.getGradeRecordDetails = function(id){
            var result = $q.defer();
            var contentUri = 'grades/' + id;
            httpRequest(contentUri, 'GET').then(function(response){
                result.resolve(response.data);
            }, function(httpStatus, response){
                result.reject(response);
            });
            return result.promise;
        };

    }

    return new ServerInterface();
}]);