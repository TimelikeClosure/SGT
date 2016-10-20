/**
 * @file Maintains filtered, sorted, and paged lists of grade records.
 * @author Tim Horist Jr.
 */

/**
 * @name gradeRecordPaging
 * @type {angular.factory}
 * @summary Angular service which maintains filtered, sorted, and paged lists of grade records, obtaining details from the local grade cache as requested and obtaining updated lists from server as necessary.
 */
sgt.factory('gradeRecordPaging', ['gradeCache', '$log', function(gradeCache, $log){
    function GradeRecordPaging(){

        /**
         * @name records
         * @type {{visible: Array, pages: {1: number[], 2: number[]}}}
         * @summary Contains the currently visible records, pages, and an ordered cache of ids associated with pages.
         */
        var records = {
            visible: [],
            pages: {
                1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                2: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
            }
        };

        /**
         * @method setVisibleRecords
         * @param {int[]} pageList
         * @summary Updates the list of currently visible grade records, given a new list of pages to display.
         */
        this.setVisibleRecords = function(pageList){
            var ids = pageList.reduce(function(last, current){
                return last.concat(records.pages[current]);
            }, []);
            gradeCache.recordList(ids).then(function(visibleRecords){
                records.visible = visibleRecords;
            });
        };

        /**
         * @method visibleRecords
         * @returns {Object[]}
         * @summary Get list of currently visible grade records with their details.
         */
        this.visibleRecords = function(){
            return records.visible;
        };

        this.setVisibleRecords([1]);
    }

    return new GradeRecordPaging();
}]);