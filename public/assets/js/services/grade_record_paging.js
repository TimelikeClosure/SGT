sgt.factory('gradeRecordPaging', ['gradeCache', '$log', function(gradeCache, $log){
    function GradeRecordPaging(){

        var records = {
            visible: [],
            pages: {
                1: [0, 1, 2],
                2: [3, 4, 5]
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