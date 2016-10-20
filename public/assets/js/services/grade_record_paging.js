/**
 * @file Maintains filtered, sorted, and paged lists of grade records.
 * @author Tim Horist Jr.
 */

/**
 * @name gradeRecordPaging
 * @type {angular.factory}
 * @description Angular service which maintains filtered, sorted, and paged lists of grade records, obtaining details from the local grade cache as requested and obtaining updated lists from server as necessary.
 */
sgt.factory('gradeRecordPaging', ['gradeCache', '$log', function(gradeCache, $log){
    function GradeRecordPaging(){

        var records = {
            visible: [],
            pages: {
                1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                2: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
            }
        };

        this.setVisibleRecords = function(pageList){
            var ids = pageList.reduce(function(last, current){
                return last.concat(records.pages[current]);
            }, []);
            gradeCache.recordList(ids).then(function(visibleRecords){
                records.visible = visibleRecords;
            });
        };

        this.visibleRecords = function(){
            return records.visible;
        };

        this.setVisibleRecords([1]);
    }

    return new GradeRecordPaging();
}]);