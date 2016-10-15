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