/**
 * Define all global variables here
 */
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = ["studentName", "course", "studentGrade"];

/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function(){
    controller.reset();
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
    this.addClicked = function() {
        model.addStudent();
        //view.updateData();
        view.updateAvg();
        view.clearAddStudentForm();
    };

    /**
     * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
     */
    this.cancelClicked = function() {
        view.clearAddStudentForm();
    };

    /**
     * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
     */
    this.reset = function() {
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
    this.clearAddStudentForm = function(){
        for (var i = 0; i < inputIds.length; i++) {
            $("#" + inputIds[i]).val("");
        }
    };

    /**
     * updateData - centralized function to update the average and call student list update
     */
    this.updateData = function() {
        view.updateAvg();
        view.updateStudentList();

    };

    this.updateAvg = function() {
        $(".avgGrade").text(model.calculateAverage());
    }

    /**
     * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
     */
    this.updateStudentList = function() {
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
    this.addStudentToDom = function(studentObj) {

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
            studentObj.delete_self();
            view.updateAvg();
        });

        operations.append(delete_button);
        table_row.append(student_name, student_course, student_grade, operations);
        $('.student-list tbody').append(table_row);

        //success animation for when student's row is added
        table_row.addClass('alert-success');
        setTimeout(function() {
            table_row.removeClass('alert-success');
        }, 200);

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
    this.addStudent = function() {

        var inputValues = [];
        for (var i = 0; i < inputIds.length; i++) {
            inputValues.push($("#"+inputIds[i]).val());
        }
        var student = new Student(inputValues[0], inputValues[1], inputValues[2]);
        this.student_array.push(student);
        view.addStudentToDom(student);
    };

    /**
     * calculateAverage - loop through the global student array and calculate average grade and return that value
     * @returns {number}
     */
    this.calculateAverage = function() {
        var total = 0;
        var avg;

        if(this.student_array.length !== 0) {
            for(var i = 0; i < this.student_array.length; i++) {
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

    this.delete_self = function() {
        var index = this.element.index();
        model.student_array.splice(index, 1);
        this.element.remove();
    }
}