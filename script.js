/**
 * Define all global variables here
 */
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = ["studentName", "course", "studentGrade"];
var timer = null;
var courseList = {};
var input = "";
//var dropDownArray = [];
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function () {
    controller.reset();
    $("")


});

var controller = new Controller();
var view = new View();
var model = new Model();

/**
 * Controller - creates an object that handles all input
 * @constructor
 */
function Controller() {

    /**
     * addClicked - Event Handler when user clicks the add button
     */
    this.addClicked = function () {

        //check if form input is valid
        if(model.validateForm()) {

            model.addStudent();
            setTimeout(function () {
                view.updateView();
            }, 200)
            view.clearAddStudentForm();
        }
    };

    /**
     * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
     */
    this.cancelClicked = function () {
        view.clearFormErrors();
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

}

/**
 * View - creates an object that handles all output updates
 * @constructor
 */
function View() {

    /**
     * clearAddStudentForm - clears out the form values based on inputIds variable
     */
    this.clearAddStudentForm = function () {
        for (var i = 0; i < inputIds.length; i++) {
            $("#" + inputIds[i]).val("");
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
    }

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
        courseList[studentObj.course] = 1;
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
     * displayFormError - shows errors in the student-add-form
     *
     * @return undefined
     * @param
     * error - the type of error.
     * id - the id of the input element in which the error occurred
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
        for (var i = 0; i < inputIds.length; i++) {
            $("#" + inputIds[i]).popover('destroy');
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

    /**
     * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
     *
     * @return undefined
     */
    this.addStudent = function () {

        var inputValues = [];
        for (var i = 0; i < inputIds.length; i++) {
            inputValues.push($("#" + inputIds[i]).val());
        }
        var student = new Student(inputValues[0], inputValues[1], inputValues[2]);
        this.student_array.push(student);
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
     * validateForm - checks if forms are filled out correctly, returns false and calls displayFormError if they are not
     * if they are filled out correctly, remove the previous popover
     * @return {boolean}
     */
    this.validateForm = function() {
        var gradeVal = $('#' + inputIds[2]).val();
        var isValid = true;

        //loop through only the first two input form values and check if any are blank
        for(var i = 0; i < inputIds.length-1; i++) {
            if($('#' + inputIds[i]).val() == '') {
                view.displayFormError('Blank Field', '#' + inputIds[i]);
                isValid = false;
            }
            else {
                $('#' + inputIds[i]).popover('destroy'); //remove popover if no error
            }
        }

        // validation for grade input is all here to prevent overlapping errors
        if(isNaN(gradeVal) || gradeVal > 100 || gradeVal < 0 || gradeVal === '') {
            if(gradeVal === '') {
                view.displayFormError('Blank Field', '#' + inputIds[2]);
            }
            else {
                view.displayFormError('Grade Invalid', '#' + inputIds[2]);
            }

            isValid = false;
        }
        else {
            $('#' + inputIds[2]).popover('destroy'); //remove popover if no error
        }
        return isValid;

    };

}

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
        model.student_array.splice(index, 1);
        this.element.remove();
        callback();
    }
}
//EXPERIMENTAL STUFF
/**
 * keyPressTimer - function that is called on key press up and will show a drop down list
 */
function keyPressTimer() {
    input = $('#course').val();

    if (timer != null) {
        clearTimeout(timer);
    }
    if (input.length > 0) {
        timer = setTimeout('showCourseList()', 500);
    }
}
/**
 * showCourseList
 */
function showCourseList() {
    var dropDownArray = [];
    //for (var i in model.student_array) {
    //    var course = model.student_array[i].course;
    //    courseList[course] = 1;
    //}
    for (var property in courseList) {
        if (input.toUpperCase() == (property.substr(0, input.length)).toUpperCase()) {
            dropDownArray.push(property);
        }
    }
    displayAutoList(dropDownArray);

}
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

function displayAutoList(display) {
    $("#autothis").empty();

    if (display.length != 0) {
        var ul = $("<ul>", {
            class: "autofill"
        });

        for (var i = 0; i < display.length; i++) {
            var li = $("<li>", {
                text: display[i]
            });

            $(ul).append(li);
        }

        $(ul).on("click", "li", function () {
            $('#course').val($(this).text());
            $("#autothis").empty();
        });

        $("#autothis").append(ul);
    }
}