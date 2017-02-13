/**
 * @file Maintains filtered, sorted, and paged lists of grade records.
 * @author Tim Horist Jr.
 */

/**
 * @name gradeRecordPaging
 * @type {angular.factory}
 * @summary Angular service which maintains filtered, sorted, and paged lists of grade records, obtaining details from the local grade cache as requested and obtaining updated lists from server as necessary.
 */
sgt.factory('gradeRecordPaging', ['$q', 'gradeCache', '$log', function($q, gradeCache, $log){
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

        var pagedIdCache = {
            1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            2: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        };

        var visible = {
            pages: [],
            records: []
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
                visible.records = visibleRecords;
            });
        };

        /**
         * @method visibleRecords
         * @returns {Object[]}
         * @summary Get list of currently visible grade records with their details.
         */
        this.visibleRecords = function(){
            return visible.records;
        };

        //this.setVisibleRecords([1]);

        /**********************************************/


        /** PRIVATE DIGEST CACHED VALUES METHODS */

        /** PRIVATE DIGEST CURRENT VALUES METHODS */

        this.digestCurrentPages = function(){
            var currentPagesPromise = $q.defer();
            if (!cache.pages.current.length){
                cache.pages.current.push(1);
            }
            currentPagesPromise.resolve(cache.pages.current);
            return currentPagesPromise.promise;
        };

        this.digestCurrentIds = function(){
            var currentIdsPromise = $q.defer();
            this.digestCurrentPages().then(function(currentPages){
                // get current record indices from current pages
                var currentRecordIndices = [];
                currentPages.forEach(function(page){
                    var minIndex = (page - 1) * cache.records.perPage;
                    var maxIndex = Math.min(page * cache.records.perPage, cache.records.total);
                    for (var index = minIndex; index < maxIndex; index++){
                        currentRecordIndices.push(index);
                    }
                });
                // get current record ids from indices
                currentIdsPromise.resolve(currentRecordIndices.map(function(index){
                    return cache.ids[index];
                }));
            });
            return currentIdsPromise.promise;
        };

        this.digestCurrentRecords = function(){
            this.digestCurrentIds().then(function(currentIds){
                gradeCache.recordList(currentIds).then(function(currentRecords){
                    cache.records.current = currentRecords;
                });
            });
        };

        // Reverse current values digest stack so that records and ids can be digested without pages, and records can be digested without ids

        function digestCurrentRecords(){
            var pages = cache.pages.current.pages;
            var perPage = cache.records.perPage;
            var totalRecords = cache.records.total;
            var idMap = cache.ids;
            var ids = [];
            // pages.forEach(function(page){
            //     for (var i = (page - 1) * perPage, maxI = Math.min(page * perPage, totalRecords); i < maxI; i++){
            //         ids.push(idMap[i]);
            //     }
            // });
            ids = pages
                .map(function(page){
                    return (new Array(Math.min(perPage, totalRecords - (page - 1) * perPage)))
                        .fill(null)
                        .map(function(val, index){
                            return index + (page - 1) * perPage;
                        });
                })
                .reduce(function(flatList, nestedList){
                    return flatList.concat(nestedList);
                }, [])
                .map(function(recordPosition){
                    return idMap[recordPosition];
                });
            gradeCache.recordList(ids).then(function(currentRecords){
                cache.records.current = currentRecords;
            });
        }

        function digestCurrentIds(){


            digestCurrentRecords();
        }

        function digestSelectedPages(){


            digestCurrentIds();
        }

        /**
         * @function digestCurrentPages
         * @param {int[]} newCurrentPages
         * @returns {Promise}
         */
        function digestCurrentPages(newCurrentPages){
            //  Create a promise that, once all data required for the new current pages is obtained,
            //  the new current pages will be updated in the cache
            var currentPagesPromise = $q.defer();

            //


            if (!cache.pages.current.length){
                cache.pages.current.push(1);
            }
            currentPagesPromise.resolve(cache.pages.current);
            return currentPagesPromise.promise;
        }

        /** PRIVATE SANITIZE VALUES METHODS */

        function sanitizeCurrentRecords(proposedCurrentRecords){
            return proposedCurrentRecords;
        }
        function sanitizeCurrentIds(proposedCurrentIds){
            return proposedCurrentIds;
        }
        function sanitizeCurrentPages(proposedCurrentPages){
            return proposedCurrentPages;
        }

        /** PRIVATE DIGEST CONTROLLER METHOD */

        function digest(values, options){
            /** Digest displayed page(s) */
            //  Sanitize current values
            var currentDigestType = null;
            if (values.hasOwnProperty('records')){
                var currentRecords = sanitizeCurrentRecords(values.records);
                currentDigestType = 'records';
            }
            if (values.hasOwnProperty('ids')){
                var currentIds = sanitizeCurrentIds(values.ids);
                currentDigestType = 'ids';
            }
            if (values.hasOwnProperty('pages')){
                var currentPages = sanitizeCurrentPages(values.pages);
                currentDigestType = 'pages';
            }
            //  Digest current values
            switch(currentDigestType){
                case 'pages':
                    digestCurrentPages(currentPages);
                    break;
                case 'ids':
                    digestCurrentIds(currentIds);
                    break;
                case 'records':
                    digestCurrentRecords(currentRecords);
                    break;
                default:
            }
            //  Update displayed values

            /** Digest cached page(s) */


        }

        /** PUBLIC GET METHODS */

        this.currentPages = function(){
            return cache.pages.current.pages;
        };

        this.firstPage = function(){
            return cache.pages.first;
        };

        this.lastPage = function(){
            return Math.ceil(cache.records.total / cache.records.perPage);
        };

        this.selectablePages = function(){
            return cache.pages.selectable;
        };

        this.perPageRecords = function(){
            return cache.records.perPage;
        };

        this.totalRecords = function(){
            return cache.records.total;
        };

        this.currentRecords = function(){
            return cache.records.current;
        };

        /** PUBLIC SET METHODS */

        this.selectPages = function(pages){
            digest({pages: pages});
        };

        /** INITIALIZATIONS */

        var cache = {
            pages: {
                current: {
                    maximum: 1,
                    pages: [1]
                },
                first: 1,
                selectable: {
                    maximum: 5,
                    pages: [1, 2, 3, 4, 5]
                }
            },
            ids: {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 13, 13: 14, 14: 15, 15: 16, 16: 17, 17: 18},
            records: {
                perPage: 15,
                total: 18,
                current: []
            }
        };

        digestCurrentRecords();

    }

    return new GradeRecordPaging();
}]);