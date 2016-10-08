sgt.provider('httpRequestGenerator', ['$http', function($http){

    this.baseUrl = '/';

    this.$get = [function(){
        return {
            http: function(){

            },
            get: function(){

            },
            post: function(){

            },
            put: function(){

            },
            delete: function(){

            }
        }
    }];
}]);

sgt.config(['httpRequestGenerator', function (httpRequestGenerator){
    httpRequestGenerator.baseUrl = '/api/';
}]);