/**
 * @file Maintains a local cache of grade record details.
 * @author Tim Horist Jr.
 */

/**
 * @name gradeCache
 * @type {angular.factory}
 * @summary Angular service which manages the local caching of student grade record details, requesting details from the server when necessary.
 */
sgt.factory('gradeCache', ['$q', 'serverInterface', function($q, serverInterface){
    function GradeCache(){

        /**
         * @name grades
         * @type {{id: {name: string, course: string, grade: float}}}
         * @summary Contains the cache of grade record details.
         */
        var grades = {};

        /**
         * @function useCachedRecord
         * @param {int} id
         * @returns {boolean}
         * @summary Determines whether or not the cached version of the grade record with the given id should be used.
         */
        function useCachedRecord(id){
            if (!grades.hasOwnProperty(id)){
                return false;
            }
            if (!grades[id].hasOwnProperty('name') || !grades[id].name){
                return false;
            }
            if (!grades[id].hasOwnProperty('course') || !grades[id].course){
                return false;
            }
            if (!grades[id].hasOwnProperty('grade') || typeof (grades[id].grade) != 'number'){
                return false;
            }
            return true;
        }

        /**
         * @method recordList
         * @param {int[]} idList
         * @returns {Promise}
         * @summary Attempts to return grade record details for the list of given record ids.
         */
        this.recordList = function(idList){
            var recordListPromises = idList.map(function(id){
                var recordPromise = $q.defer();
                if (useCachedRecord(id)){
                    recordPromise.resolve(grades[id]);
                } else {
                    serverInterface.getGradeDetails(id)
                        .then(function(response){
                            var record = response.grades.records[id];
                            grades[id] = {
                                name: record.name,
                                course: record.course,
                                grade: parseFloat(record.grade)
                            };
                            recordPromise.resolve(grades[id]);
                        }, function(response){
                            recordPromise.reject(response);
                        }
                    );
                }
                return recordPromise.promise;
            });

            return $q.all(recordListPromises);
        }

    }

    return new GradeCache();
}]);