sgt.factory('gradeCache', ['$q', '$timeout', function($q, $timeout){
    function GradeCache(){

        var grades = {
            0: {
                name: 'Angry Bob',
                course: 'Anger Management',
                grade: 32
            },
            1: {
                name: 'Angry Bob',
                course: 'Anger Expression',
                grade: 87
            },
            2: {
                name: 'Angry Bob',
                course: 'Anger Substitution',
                grade: 54
            },
            3: {
                name: 'Calm Joe',
                course: 'Anger Management',
                grade: 87
            },
            4: {
                name: 'Calm Joe',
                course: 'Anger Expression',
                grade: 31
            },
            5: {
                name: 'Calm Joe',
                course: 'Anger Substitution',
                grade: 48
            }
        };

        this.recordList = function(idList){
            var recordListPromises = idList.map(function(id){
                var recordPromise = $q.defer();

                $timeout(function(){
                    recordPromise.resolve(grades[id]);
                }, Math.floor(Math.random()*2000, 1));

                return recordPromise.promise;
            });

            return $q.all(recordListPromises);
        }

    }

    return new GradeCache();
}]);