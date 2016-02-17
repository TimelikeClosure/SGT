/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds = ["studentName", "course", "studentGrade"];

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent() {

    var inputValues = [];
    for (var i = 0; i < inputIds.length; i++) {
        inputValues.push($("#"+inputIds[i]).val());
    }
    var student = new Student(inputValues[0], inputValues[1], inputValues[2]);
    student_array.push(student);
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
        student_array.splice(this.element.index(), 1);
        this.element.remove();
    }
}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm() {
    for (var i = 0; i < inputIds.length; i++) {
        $("#"+inputIds[i]).val("");
    }
}

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage() {
    var total = 0;
    var avg;

    if(student_array.length !== 0) {
        for(var i = 0; i < student_array.length; i++) {
            total += parseFloat(student_array[i].grade);
        }
        avg = total / student_array.length;

        //Round to the nearest 100ths
        avg *= 100;
        avg = Math.round(avg);
        avg /= 100;

        return avg;
    }
    else {
        return 0;
    }
}

/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData() {
    $(".avgGrade").text(calculateAverage());
    updateStudentList();

}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {
    $(".student-list tbody").html("");
    for (var i = 0; i < student_array.length; i++) {
        addStudentToDom(student_array[i]);
    }
}

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj) {

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

    }).click(function() {
        console.log('student index', studentObj.element.index());
        studentObj.delete_self();
    });

    operations.append(delete_button);
    table_row.append(student_name, student_course, student_grade, operations);
    $('.student-list tbody').append(table_row);

}

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
        addStudent();
        updateData();
        clearAddStudentForm();
    };

    /**
     * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
     */
    this.cancelClicked = function() {
        clearAddStudentForm();
    };

    /**
     * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
     */
    this.reset = function() {
        student_array = [];
        clearAddStudentForm();
        updateData();
    };

}

/**
 * View - creates an object that handles all output updates
 * @constructor
 */
function View() {

}

/**
 * Model - creates an object that handles all business logic
 * @constructor
 */
function Model() {

}