const floatCheck= /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;

const colHeaders1 = ['Student ID', 'Asmt 1', 'Asmt 2', 'Asmt 3'];
const gradesData1 = [
    {'id': '100000000', 'asmt-1': 4.5, 'asmt-2': 3.75, 'asmt-3': 3.4},
    {'id': '100000001', 'asmt-1': 4.25, 'asmt-2': 4.12, 'asmt-3': 4.25},
    {'id': '100000002', 'asmt-1': 5.0, 'asmt-2': 4.75, 'asmt-3': 4.5},
];

const colHeaders2 = ['Student ID', 'Asmt 1', 'Asmt 2', 'Asmt 3', 'Midterm', 'Final Exam'];
const gradesData2 = [
    {'id': '100000001', 'asmt-1': 92.0, 'asmt-2': 80.0, 'asmt-3': 100.0, 'midterm': 62.5, 'final': 81.5},
    {'id': '100000002', 'asmt-1': 100.0, 'asmt-2': 85.5, 'asmt-3': 90.0, 'midterm': 75.0, 'final': 90.25},
    {'id': '100000003', 'asmt-1': 80.0, 'asmt-2': 90.5, 'asmt-3': 90.0, 'midterm': 66.5, 'final': 68.0},
    {'id': '100000004', 'asmt-1': 100.0, 'asmt-2': 100.0, 'asmt-3': 100.0, 'midterm': 98.0, 'final': 95.5},
    {'id': '100000005', 'asmt-1': 100.0, 'asmt-2': 90.0, 'asmt-3': 100.0, 'midterm': 58.5, 'final': 72.0},
    {'id': '100000006', 'asmt-1': 90.5, 'asmt-2': 81.5, 'asmt-3': 95.5, 'midterm': 65.5, 'final': 64.0},
    {'id': '100000007', 'asmt-1': 40.5, 'asmt-2': 50.5, 'asmt-3': 65.5, 'midterm': 22.5, 'final': 51.0},
    {'id': '100000008', 'asmt-1': 70.0, 'asmt-2': 75.0, 'asmt-3': 70.0, 'midterm': 55.5, 'final': 21.0},
    {'id': '100000009', 'asmt-1': 80.0, 'asmt-2': 82.5, 'asmt-3': 65.0, 'midterm': 72.5, 'final': 88.0},
];

var selected = null;
var clicked = null;
var preVal = 0;

$(document).ready(function() {
    $('#table-1').append('<thead> <tr> </tr> </thead>');
    $thead = $('#table-1 > thead > tr:first');
    colHeaders1.forEach(function(colHeader) {
        $thead.append('<th>' + colHeader + '</th>');
    });

    $('#table-1').append('<tbody> <tr> </tr> </tbody>');
    $tbody = $('#table-1 > tbody');
    gradesData1.forEach(function(data) {
        $tbody.append('<tr><th scope="row">' + data.id + '</th><td>' + data["asmt-1"] + '</td><td>' + data["asmt-2"] + '</td><td>' + data["asmt-3"] + '</td></tr>');
    });

    $('#table-2').append('<thead> <tr> </tr> </thead>');
    $thead = $('#table-2 > thead > tr:first');
    colHeaders2.forEach(function(colHeader) {
        $thead.append('<th>' + colHeader + '</th>');
    });

    $('#table-2').append('<tbody> <tr> </tr> </tbody>');
    $tbody = $('#table-2 > tbody');
    gradesData2.forEach(function(data) {
        $tbody.append('<tr><th scope="row">' + data.id + '</th><td>' + data["asmt-1"] + '</td><td>' + data["asmt-2"] + '</td><td>' + data["asmt-3"] + '</td><td>' + data["midterm"] + '</td><td>' + data["final"] + '</td></tr>');
    });

    $('th').click(function() {
        if (selected) {
            selected.removeClass('select');
            selected.deselectAll();
            if (selected.is($(this))) {
                selected = null;
                return;
            }
        }
        $(this).addClass('select');
        selected = $(this);
        if (selected.attr('scope') == 'row') {
            selected.selectRow();
            return;
        }
        selected.selectCol();
    });

    $('td').click(function() {
        preVal = $(this).text();
        $(this).attr('contenteditable', true);
    });

    $('td').focusout(function() {
        $(this).text(preVal);
        $(this).attr('contenteditable', false);
    })


    $('td').on("keydown", function(e) {
        if (e.keyCode == 13) {
            if (!floatCheck.test($(this).text()) || $(this).text() < 0 || $(this).text() > 100) {
                $(this).text(preVal);
            }
            e.preventDefault();
            preVal = $(this).text();
            $(this).attr('contenteditable', false);
        }
    });
});

$.fn.selectCol = function() {
    var gradesCol = [];
    var index = this.index();
    if (index === 0) {
        this.closest('table').find('td').each((a,b) => {
            $(b).addClass('select');
            gradesCol.push($(b).text());
        })
    } else {
        this.closest('table').find('tr').each((a,b) => {
            $(b).find('td').eq(index-1).addClass('select');
            gradesCol.push($(b).find('td').eq(index-1).text()); 
        });
        gradesCol.splice(0,2);
    }
    plot(gradesCol);
}

$.fn.selectRow = function() {
    var gradesRow = [];
    index = 0;
    this.closest('tr').find('td').each((a,b) => {
        $(b).addClass('select');
        gradesRow.push($(b).text());
    });
    plot(gradesRow);
}

$.fn.deselectAll = function() {
    this.closest('table').find('td').each((a,b) => {
        $(b).removeClass('select');
    })
}

function plot(numberGrades) {
    var letterGrades = numberGrades.map(getGrade);
    var gradeFreq = {}
    letterGrades.forEach(e => gradeFreq[e] ? gradeFreq[e]++ : gradeFreq[e] = 1);
}

function getGrade(mark) {
    if (mark < 50.0) {
        return 'F';
    } else if (mark < 60.0) {
        return 'D';
    } else if (mark < 70.0) {
        return 'C';
    } else if (mark < 80.0) {
        return 'B';
    } else {
        return 'A';
    }
}






