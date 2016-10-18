sgt.factory('serverInterface', ['$q', '$http', function($q, $http){
    function ServerInterface(){

        var baseUrl = 'api/';

        this.getGradeById = function(id){

            var result = $q.defer();
            var url = baseUrl + 'grades/' + id;

            $http.get(url).then(function(response){
                if (response.hasOwnProperty('data') &&
                    response.data.hasOwnProperty('success') &&
                    response.data.success){
                    result.resolve(response.data.data[0]);
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