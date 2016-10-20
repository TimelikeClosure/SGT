/**
 * @file Connects displayed grade record table with business logic.
 * @author Tim Horist Jr.
 */

/**
 * @name gradeRecordTable
 * @type {angular.controller}
 * @description Angular controller which connects displayed grade record table with services necessary for displaying, sorting, paging, and modifying records within table.
 */
sgt.controller('gradeRecordTable', ['gradeRecordPaging', function(gradeRecordPaging){
    this.gradeRecords = function(){
        return gradeRecordPaging.visibleRecords();
    };

    this.editRecord = function(recordIndex){
        return null;
    };

    this.deleteRecord = function(recordIndex){
        return null;
    };
}]);
