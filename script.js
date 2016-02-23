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
//  End global object instantiation

/**
 * Controller - creates an object that handles all input
 * @constructor
 */
function Controller() {

    this.inputTimer = null;

    /**
     * addClicked - Event Handler when user clicks the add button
     */
    this.addClicked = function () {
        model.addStudent();
        //view.updateData();
        setTimeout(function () {
            view.updateView();
        }, 200);
        view.clearAddStudentForm();
    };

    /**
     * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
     */
    this.cancelClicked = function () {
        view.clearAddStudentForm();
    };

    /**
     * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
     */
    this.reset = function () {
        model.student_array = [];
        view.clearAddStudentForm();
        view.updateData();
    };

    /**
     * studentCourseAutoFillShowTimer - starts timer to update and show student course autofill list
     */
    this.studentCourseAutoFillShowTimer = function() {
        if (this.inputTimer != null) {
            clearTimeout(this.inputTimer);
        }
        this.inputTimer = setTimeout(view.displayCourseAutoFillList(model.courseList.searchForMatchList($('#course').val())), 500);
    };

    /**
     * studentCourseAutoFillHideTimer - starts timer to hide student course autofill list
     */
    this.studentCourseAutoFillHideTimer = function() {
        if (this.inputTimer != null) {
            clearTimeout(this.inputTimer);
        }
        this.inputTimer = setTimeout(view.displayCourseAutoFillList([]), 100);
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
        var student_name = $('<td>').text(studentObj.name);
        var student_course = $('<td>').text(studentObj.course);
        var student_grade = $('<td>').text(studentObj.grade);
        var operations = $('<td>');
        studentObj.element = table_row;
        var delete_button = $('<button>', {
            type: 'button',
            class: 'btn btn-danger btn-xs',
            text: 'Delete'

        }).click(function () {
            studentObj.delete_self(view.updateView);
            //view.updateView();
        });

        operations.append(delete_button);
        table_row.append(student_name, student_course, student_grade, operations);
        $('.student-list tbody').append(table_row);

        //success animation for when student's row is added
        table_row.addClass('alert-success');
        setTimeout(function () {
            table_row.removeClass('alert-success');
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
                class: "autofill"
            });

            for (var i = 0; i < courseAutoFillList.length; i++) {
                var li = $("<li>", {
                    text: courseAutoFillList[i]
                });

                $(ul).append(li);
            }

            $(ul).on("click", "li", function () {
                $('#course').val($(this).text());
                $("#autothis").empty();
            });

            $("#autothis").append(ul);
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
    this.addStudent = function () {

        var inputValues = [];
        for (var i = 0; i < view.inputIds.length; i++) {
            inputValues.push($("#" + view.inputIds[i]).val());
        }
        var student = new Student(inputValues[0], inputValues[1], inputValues[2]);
        this.student_array.push(student);
        this.courseList.addCourse(student.course);
        view.addStudentToDom(student);
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
        for (var t in topStudents) {
            $(topStudents[t].element.addClass('alert-success'));
        }
        for (var l in lowStudents) {
            $(lowStudents[l].element.addClass('alert-danger'));
        }
    };


    /**
     * Student - creates a student Object that holds their name, course, and grade
     * @param {string} name
     * @param {string} course
     * @param {number} grade
     * @constructor
     */
    function Student(name, course, grade) {
        this.name = name;
        this.course = course;
        this.grade = grade;
        this.element;

        this.delete_self = function (callback) {
            var index = this.element.index();
            model.courseList.removeCourse(this.course);
            model.student_array.splice(index, 1);
            this.element.remove();
            callback();
        }
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
                    if (filterString.toLowerCase() == course.substr(0, filterString.length).toLowerCase()) {
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


//EXPERIMENTAL STUFF

//this does not exist
function callDatabase() {
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: {
            api_key: "LEARNING"
        },
        url: 'http://s-apis.learningfuze.com/sgt/get',
        success: function (result) {
            console.log(result);
            for (var i  in result.data) {
                var student = new Student(result.data[i].name, result.data[i].course, result.data[i].grade);
                view.addStudentToDom(student);
                model.student_array.push(student);
            }

            $(".avgGrade").text(model.calculateAverage());
        }
    });
}
