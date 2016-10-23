/**
 * @file Connects displayed grade record table with business logic.
 * @author Tim Horist Jr.
 */

/**
 * @name gradeRecordTable
 * @type {angular.controller}
 * @summary Angular controller which connects displayed grade record table with services necessary for displaying, sorting, paging, and modifying records within table.
 */
sgt.controller('gradeRecordTable', ['gradeRecordPaging', function(gradeRecordPaging){
    /**
     * @method gradeRecords
     * @returns {Object[]}
     * @summary Get list of currently visible records and their details.
     */
    this.gradeRecords = function(){
        return gradeRecordPaging.currentRecords();
    };

    /**
     * @method editRecord
     * @param {int} recordIndex
     * @returns {null}
     * @summary Initiate editing of the given record.
     */
    this.editRecord = function(recordIndex){
        return null;
    };

    /**
     * @method deleteRecord
     * @param {int} recordIndex
     * @returns {null}
     * @summary Attempt deletion of the given record.
     */
    this.deleteRecord = function(recordIndex){
        return null;
    };
}]);
