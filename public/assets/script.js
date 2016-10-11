"use strict";
/**
 * Define all global variables here
 */
//var dropDownArray = [];
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function () {
    controller.reset();
});

//  Begin global object instantiation
var controller = new Controller();
var view = new View();
var model = new Model();
var database = new DatabaseInterface();
//  End global object instantiation

/**
 * Controller - creates an object that handles all input
 * @constructor
 */
function Controller() {

    this.autofillTimer = null;

    this.filterTimer = null;

    /**
     * addClicked - Event Handler when user clicks the add button
     */
    this.addClicked = function () {

        //check if form input is valid
        if(model.validateForm()) {
            view.buttonSpinner($('#add'));
            var inputValues = [];
            for (var i = 0; i < view.inputIds.length; i++) {
                inputValues.push($("#" + view.inputIds[i]).val());
            }
            var studentObj = model.addStudent(inputValues[0], inputValues[1], inputValues[2]);
            database.createStudentData(studentObj);
        }
    };

    /**
     * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
     */
    this.cancelClicked = function () {
        view.buttonSpinner($('#cancel'));
        view.clearFormErrors();
        view.clearAddStudentForm();
        view.stopSpinner($('#cancel'));
    };

    /**
     * getDataClicked - Event Handler when user clicks the Get Student Data button, loads student data from server
     */
    this.getDataClicked = function () {
        view.buttonSpinner($('#getStudentData'));
        database.readStudentData();
    };

    /**
     * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
     */
    this.reset = function () {
        model.student_array = [];
        database.readStudentData();
    };

    /**
     * studentCourseAutoFillShowTimer - starts timer to update and show student course autofill list
     */
    this.studentCourseAutoFillShowTimer = function() {
        if (this.autofillTimer != null) {
            clearTimeout(this.autofillTimer);
        }
        this.autofillTimer = setTimeout(view.displayCourseAutoFillList(model.courseList.searchForMatchList($('#course').val())), 500);
    };

    /**
     * studentCourseAutoFillHideTimer - starts timer to hide student course autofill list
     */
    this.studentCourseAutoFillHideTimer = function() {
        if (this.autofillTimer != null) {
            clearTimeout(this.autofillTimer);
        }
        this.autofillTimer = setTimeout(view.displayCourseAutoFillList([]), 500);
    };

    /**
     * filterStudentTableTimer - starts timer to filter rows by value of search bar
     */
    this.filterStudentTableTimer = function() {
        if (this.filterTimer !== null) {
            clearTimeout(this.filterTimer);
        }
        this.filterTimer = setTimeout(model.filterStudentTable(), 500);
    };

    /**
     * getFilterString - Returns value of the search bar
     * @returns {string} - filter string
     */
    this.getFilterString = function() {
        return $("#tableFilter").val();
    };
}

/**
 * View - creates an object that handles all output updates
 * @constructor
 */
function View() {

    /**
     * inputIds - id's of the elements that are used to add students
     * @type {string[]}
     */
    this.inputIds = ["studentName", "course", "studentGrade"];

    /**
     * clearAddStudentForm - clears out the form values based on inputIds variable
     */
    this.clearAddStudentForm = function () {
        for (var i = 0; i < this.inputIds.length; i++) {
            $("#" + this.inputIds[i]).val("");
        }
    };

    /**
     * updateData - centralized function to update the average and call student list update
     */
    this.updateData = function () {
        view.updateView();

    };

    this.updateView = function () {
        $(".avgGrade").text(model.calculateAverage());
        if (model.student_array.length > 0) {
            model.highlightGrades();
        }
    };

    /**
     * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
     */
    this.updateStudentList = function () {
        $(".student-list tbody").html("");
        for (var i = 0; i < model.student_array.length; i++) {
            view.addStudentToDom(model.student_array[i]);
        }
    };

    /**
     * addStudentToDom - take in a student object, create html elements from the values and then append the elements
     * into the .student_list tbody
     * @param studentObj
     */
    this.addStudentToDom = function (studentObj) {
        var table_row = $('<tr>');
        if (!studentObj.matchesFilter) {
            table_row.hide();
        }
        var student_name = $('<td>').text(studentObj.name);
        var student_course = $('<td>').text(studentObj.course);
        var student_grade = $('<td>').text(studentObj.grade);
        var operations = $('<td>');
        studentObj.element = table_row;
        var delete_button = $('<button>', {
            type: 'button',
            class: 'btn btn-danger btn-xs',
            text: 'Delete',
            disabled: true

        }).click(function () {
            model.removeStudent(studentObj);
            //view.updateView();
        });

        operations.append(delete_button);
        table_row.append(student_name, student_course, student_grade, operations);
        $('.student-list tbody').append(table_row);

        //success animation for when student's row is added
        table_row.addClass('alert-info');
        setTimeout(function () {
            table_row.removeClass('alert-info');
        }, 200);

    };

    /**
     * displayCourseAutoFillList - Displays the given course autofill list. Hides display if given list is empty.
     * @param {string[]} courseAutoFillList - List of courses to display.
     */
    this.displayCourseAutoFillList = function(courseAutoFillList) {
        $("#autothis").empty();

        if (courseAutoFillList.length != 0) {
            var ul = $("<ul>", {
                class: "list-group"
            });

            for (var i = 0; i < courseAutoFillList.length; i++) {
                var li = $("<a>", {
                    text: courseAutoFillList[i],
                    class: "list-group-item",
                    href: "#"
                });

                $(ul).append(li);
            }

            $(ul).on("mousedown", "a", function () {
                $('#course').val($(this).text());
                $("#autothis").empty();
            });

            $("#autothis").append(ul);
        }
    };

    /**
     * displayFormError - shows errors in the student-add-form
     * @param error - the type of error.
     * @param id - the id of the input element in which the error occurred
     * @return undefined
     */
    this.displayFormError = function(error, id) {

            // Get input field name based on what id the error applies to
            var inputFieldName;

            if(id === '#studentName') {
                inputFieldName = 'Student Name';
            }
            else if(id === '#course') {
                inputFieldName = 'Course';
            }
            else if(id === '#studentGrade') {
                inputFieldName = 'Student Grade';
            }

            // Create an error message depending on what error there was
            var errorMessage;
            switch(error) {
                case 'Blank Field':
                    errorMessage = 'Please enter a ' + inputFieldName + '.';
                    break;
                case 'Grade Invalid':
                    errorMessage = 'Please enter a number between 0 and 100.';
                    break;
                default:
                    errorMessage = 'Error';
                    break;
            }

            // Put error message into popover and display it
            $(id).attr('data-content', errorMessage);
            $(id).popover('show');

    };

    /**
     * clearFormErrors - clears error popovers in the student-add-form
     *
     * @return undefined
     *
     */
    this.clearFormErrors = function() {
        for (var i = 0; i < this.inputIds.length; i++) {
            $("#" + this.inputIds[i]).popover('destroy');
        }
    };

    this.displayDeleteError = function(errorMessage) {
        console.log("This should display to the window:", errorMessage);
    };

    this.buttonSpinner = function(element) {
        var span = $('<span>', {
            class: "glyphicon glyphicon-refresh spinning"
        });
        element.prepend(span);
        element.attr('disabled', 'disabled');
    };

    this.stopSpinner = function(element) {
        element.children('span').detach();
        element.removeAttr('disabled');
    };

    /**
     * filterRows - shows or hides the given list of students, based on whether the students match the search bar filter
     * @param {Object[]} toggledMatchStudents - list of students to hide or show
     */
    this.filterRows = function(toggledMatchStudents) {
        for (var i = 0; i < toggledMatchStudents.length; i++) {
            if (toggledMatchStudents[i].matchesFilter) {
                toggledMatchStudents[i].element.show();
            } else {
                toggledMatchStudents[i].element.hide();
            }
        }
    };
}

/**
 * Model - creates an object that handles all business logic
 * @constructor
 */
function Model() {

    /**
     * student_array - array to hold student objects
     * @type {Array}
     */
    this.student_array = [];

    this.courseList = new CourseList();

    /**
     * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
     *
     * @return undefined
     */
    this.addStudent = function (name, course, grade, id) {
        var student = new Student(name, course, grade, id);
        this.student_array.push(student);
        this.courseList.addCourse(student.course);
        view.addStudentToDom(student);
        return student;
    };

    this.removeStudent = function(student) {
        database.deleteStudentData(student, view.updateView, view.displayDeleteError);
    };

    /**
     * calculateAverage - loop through the global student array and calculate average grade and return that value
     * @returns {number}
     */
    this.calculateAverage = function () {
        var total = 0;
        var avg;

        if (this.student_array.length !== 0) {
            for (var i = 0; i < this.student_array.length; i++) {
                total += parseFloat(this.student_array[i].grade);
            }
            avg = total / this.student_array.length;

            //Round to the nearest 100ths
            avg *= 100;
            avg = Math.round(avg);
            avg /= 100;

            return avg;
        }
        else {
            return 0;
        }
    };
    //highlights all lowest and highest grades in the student array
    this.highlightGrades = function () {
        //initialize the starting grades and students and grade holders;
        var highestGrade = parseFloat(this.student_array[0].grade);
        var lowestGrade = highestGrade;
        var topStudent = this.student_array[0];
        var lowStudent = this.student_array[0];
        var topStudents = [];
        var lowStudents = [];
        //loop through the student array
        for (var i = 0; i < this.student_array.length; i++) {
            //remove any previous highlights
            $(this.student_array[i].element).removeClass('alert-danger alert-success');
            var currentGrade = parseFloat(this.student_array[i].grade);
            var currentStudent = this.student_array[i];
            //console.log(currentGrade, typeof  currentGrade, highestGrade, lowestGrade);
            //if grade is higher than highestGrade reset topStudents array and put current student inside
            if (highestGrade < currentGrade) {
                highestGrade = currentGrade;
                topStudent = currentStudent;
                topStudents = [topStudent];
            }
            //if highestGrade is equal to current student grade add them to topStudents
            else if (highestGrade == currentGrade) {
                topStudents.push(currentStudent);
            }
            //if grade is lower than lowestGrade reset lowStudents array and put current student inside
            if (lowestGrade > currentGrade) {
                lowestGrade = currentGrade;
                lowStudent = currentStudent;
                lowStudents = [lowStudent];
            }
            //if lowestGrade is equal to current student grade add them to lowStudents
            else if (lowestGrade == currentGrade) {
                lowStudents.push(currentStudent);
            }
        }
        //check for a grade tie;
        if (highestGrade == lowestGrade) {
            //console.log("this looks like communism")
            return;
        }
        //loop through each student holder array and apply correct class;
        for (var t = 0; t < topStudents.length; t++) {
            $(topStudents[t].element.addClass('alert-success'));
        }
        for (var l in lowStudents) {
            $(lowStudents[l].element.addClass('alert-danger'));
        }
    };

    /**
     * validateForm - checks if forms are filled out correctly, returns false and calls displayFormError if they are not
     * if they are filled out correctly, remove the previous popover
     * @return {boolean}
     */
    this.validateForm = function() {
        var gradeVal = $('#' + view.inputIds[2]).val();
        var isValid = true;

        //loop through only the first two input form values and check if any are blank
        for(var i = 0; i < view.inputIds.length-1; i++) {
            if($('#' + view.inputIds[i]).val() == '') {
                view.displayFormError('Blank Field', '#' + view.inputIds[i]);
                isValid = false;
            }
            else {
                $('#' + view.inputIds[i]).popover('destroy'); //remove popover if no error
            }
        }

        // validation for grade input is all here to prevent overlapping errors
        if(isNaN(gradeVal) || gradeVal > 100 || gradeVal < 0 || gradeVal === '') {
            if(gradeVal === '') {
                view.displayFormError('Blank Field', '#' + view.inputIds[2]);
            }
            else {
                view.displayFormError('Grade Invalid', '#' + view.inputIds[2]);
            }

            isValid = false;
        }
        else {
            $('#' + view.inputIds[2]).popover('destroy'); //remove popover if no error
        }
        return isValid;

    };

    /**
     * filterStudentTable - checks every student for filter match. Sends a list of students with changes to view.filterRows().
     */
    this.filterStudentTable = function() {
        var filterString = controller.getFilterString();
        var changeList = [];
        for (var i = 0; i < this.student_array.length; i++) {
            var studentFilterResult = this.student_array[i].filterSelf(filterString);
            if (studentFilterResult !== null) {
                changeList.push(studentFilterResult);
            }
        }
        return view.filterRows(changeList);
    };

    /**
     * checkMatch - Returns whether the given string matches the given search string according to the specified match method
     * @param {string} searchString - string to use as condition for match
     * @param {string} mainString - string to check for match
     * @param {string} matchMethod - specifies method of match. All methods are case insensitive:
     *     "keywords" - checks that all words/numbers, delimited by spaces, are in the main string
     *     "contains" - checks that the full search string is inside the main string at any position
     *     "begins with" - checks that the main string starts with the full string
     * @returns {boolean} - true if the match method conditions are satisfied, false otherwise or if match method is invalid. Empty search string always returns true.
     */
    function checkMatch (searchString, mainString, matchMethod) {
        if (searchString.length == 0) {
            return true;
        }
        searchString = searchString.toLowerCase();
        mainString = mainString.toLowerCase();
        switch (matchMethod) {
            case "begins with":
                return mainString.indexOf(searchString) == 0;
            case "contains":
                return mainString.indexOf(searchString) > -1;
            case "keywords":
                var keywordList = searchString.split(" ");
                for (var i = 0; i < keywordList.length; i++) {
                    if (mainString.indexOf(keywordList[i]) == -1) {
                        return false;
                    }
                }
                return true;
            default:
                return false;
        }
    }

    /**
     * Student - creates a student Object that holds their name, course, and grade
     * @param {string} name
     * @param {string} course
     * @param {number} grade
     * @param {number} [id]
     * @constructor
     */
    function Student(name, course, grade, id) {
        //  Begin public methods
        /**
         * filterSelf - checks whether Student is included in the given filter and returns self if value has changed
         * @param {string} [filterString] - filter string.  Gets filter from controller if not specified.
         * @returns {Object|null} - returns self if filtered status has changed, null otherwise.
         */
        this.filterSelf = function(filterString) {
            var oldMatchesFilter = this.matchesFilter;
            if (filterString === undefined) {
                filterString = controller.getFilterString();
            }
            this.matchesFilter = checkMatch(filterString, this.name + " " + this.course + " " + this.grade, "keywords");
            if (oldMatchesFilter == this.matchesFilter) {
                return null;
            } else {
                return this;
            }
        };

        this.delete_self = function (callback) {
            var index = this.element.index();
            model.courseList.removeCourse(this.course);
            model.student_array.splice(index, 1);
            this.element.remove();
            callback();
        };
        //  End public methods

        //  Begin variable initialization
        this.name = name;
        this.course = course;
        this.grade = grade;
        this.id = id;
        this.matchesFilter = false; // Current filter status
        this.filterSelf(); // Filters self on construction
        this.element;
        //  End variable initialization

        //  Begin private methods
        //  End private methods
    }

    /**
     * CourseList - creates a courseList Object that holds a list of all courses in the student_table, along with their quantities.
     * @param {string[]} startingCourseList - Optional list to populate courseList with upon construction.
     * @constructor
     */
    function CourseList(startingCourseList) {

        // Begin variable initialization
        var courseList = {};
        if (Array.isArray(startingCourseList)) {
            for (var i = 0; i < startingCourseList.length; i++) {
                this.addCourse(startingCourseList[i]);
            }
        }
        // End variable initialization

        // Begin public method definitions
        /**
         * addCourse - Adds the given course to the course list. If the course is already included, increments the number of uses.
         * @param {string} course - The course to add to the list.
         */
        this.addCourse = function(course) {
            if (courseList.hasOwnProperty(course)) {
                courseList[course]++;
            } else {
                courseList[course] = 1;
            }
        };
        /**
         * removeCourse - If possible, decrements the number of uses for the given course in the course list.
         * @param {string} course - The course to decrement the number of uses for.
         */
        this.removeCourse = function(course) {
            if (courseList.hasOwnProperty(course) && courseList[course] > 0) {
                courseList[course]--;
            }
        };
        /**
         * searchForMatchList - Returns a sorted list of courses that are relevant to the search term.
         * @param {string} searchTerm - Term used to filter courses.
         * @returns {string[]} - Sorted list of search term matches. Empty list if no alphanumeric characters are used.
         */
        this.searchForMatchList = function(searchTerm) {
            if (!(/[\w\d]/.test(searchTerm))) { // If the search term contains no alphanumeric characters
                return []; // Return an empty list
            }
            var filteredList = filterList(searchTerm); // Filters the list with the search term.
            return sortList(filteredList); // Sorts the list.
        };
        // End public method definitions

        // Begin private method definitions
        function filterList(filterString) {
            var filteredList = [];
            for (var course in courseList) {
                if (courseList.hasOwnProperty(course) && courseList[course] > 0) {
                    if (checkMatch(filterString, course, "contains")) {
                        filteredList.push([course, courseList[course]]);
                    }
                }
            }
            return filteredList;
        }
        function sortList(unsortedList) {
            unsortedList.sort(function(a, b){ // Sorts the course list
                if (a[1] !== b[1]) { // If the course counts are not equal
                    return b[1] - a[1]; // Sort the higher course counts to earlier in the array
                } else { // If the course counts are equal
                    return a[0].toLowerCase() - b[0].toLowerCase(); // Sort alphabetically, ignoring capitalization
                }
            });
            return unsortedList.map(function(value){return value[0]}); // Removes course counts and flattens array.
        }
        // End private method definitions

    }

}

function DatabaseInterface() {

    this.readStudentData = function() {
        var data = {
            api_key: '9s6bvouy3t4roslo937vlosb7lo4tysol4u9tsloye4btlosyl4et8vbs9e4yb9y',
            request: 'get_all'
        };
        $.ajax({
            type: "POST",
            dataType: 'json',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(data),
            url: 'api/grades',
            success: function (result) {
                for (var i in result.data) {
                    if (result.data[i].hasOwnProperty('name') && result.data[i].hasOwnProperty('course') && result.data[i].hasOwnProperty('grade') && result.data[i].hasOwnProperty('id')) {
                        model.addStudent(result.data[i].name, result.data[i].course, result.data[i].grade, result.data[i].id);
                    }
                }
                view.updateView();
                view.stopSpinner($('#getStudentData'));
            },
            error: function(response) {
                return console.log(response);
                view.stopSpinner($('#getStudentData'));
            }
        });
    };

    this.createStudentData = function(studentObj) {
        var studentID;
        $.ajax({
            type: "POST",
            dataType: 'json',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({
                api_key: '9s6bvouy3t4roslo937vlosb7lo4tysol4u9tsloye4btlosyl4et8vbs9e4yb9y',
                request: 'insert_row',
                name: studentObj.name,
                course: studentObj.course,
                grade: studentObj.grade
            }),
            url: 'api/grades',
            success: function (result) {
                studentObj.id = result.data.id;
                view.clearAddStudentForm();
                view.updateView();
                view.stopSpinner($('#add'));
            },
            error: function (result) {
                view.stopSpinner($('#add'));
            }
        });
    };

    this.deleteStudentData = function(student, successCallback, failCallback) {
        $.ajax({
            type: "POST",
            dataType: 'json',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({
                api_key: '9s6bvouy3t4roslo937vlosb7lo4tysol4u9tsloye4btlosyl4et8vbs9e4yb9y',
                request: 'delete_row',
                student_id: student.id
            }),
            url: 'api/grades/' + student.id,
            success: function(response) {
                if (response.success) {
                    student.delete_self(successCallback);
                } else {
                    failCallback(response);
                }
            },
            error: function (response) {
                failCallback(response);
            },
            timeout: 10000
        });
    };
}
