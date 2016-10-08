sgt.provider('httpRequestGenerator', ['$http', function($http){

    this.baseUrl = '//api/';

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