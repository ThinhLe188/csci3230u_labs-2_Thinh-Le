const colHeaders = ['Student ID', 'Asmt 1', 'Asmt 2', 'Asmt 3'];
const gradesData = [
    {'id': '100000000', 'asmt-1': 4.5, 'asmt-2': 3.75, 'asmt-3': 3.4},
    {'id': '100000001', 'asmt-1': 4.25, 'asmt-2': 4.12, 'asmt-3': 4.25},
    {'id': '100000002', 'asmt-1': 5.0, 'asmt-2': 4.75, 'asmt-3': 4.5},
];

var clicked = null;

$(document).ready(function() {
    $('table').append('<thead> <tr> </tr> </thead>');
    $thead = $('table > thead > tr:first');
    colHeaders.forEach(function(colHeader) {
        $thead.append('<th>' + colHeader + '</th>');
    });

    $('table').append('<tbody> <tr> </tr> </tbody>');
    $tbody = $('table > tbody');
    gradesData.forEach(function(data) {
        $tbody.append('<tr><th scope="row">' + data.id + '</th><td>' + data["asmt-1"] + '</td><td>' + data["asmt-2"] + '</td><td>' + data["asmt-3"] + '</td></tr>');
    });

    $('th').click(function() {
        if (clicked) {
            clicked.removeClass('select');
            clicked.deselectAll();
            if (clicked.is($(this))) {
                clicked = null;
                return;
            }
        }
        $(this).addClass('select');
        clicked = $(this);
        if (clicked.attr('scope') == 'row') {
            clicked.selectRow();
            return;
        }
        clicked.selectCol();
    });
});

$.fn.selectCol = function() {
    var index = this.index();
    if (index === 0) {
        $('table').find('tbody').find('tr').each((a,b) => {
            $(b).find('td').addClass('select');
        })
    }
    $('table').find('tbody').find('tr').each((a,b) => {
        $(b).find('td').eq(index-1).addClass('select');
    });
}

$.fn.selectRow = function() {
    this.closest('tr').each((a,b) => {
        $(b).find('td').addClass('select')
    })
};

$.fn.deselectAll = function() {
    $('table').find('tbody').find('tr').each((a,b) => {
        $(b).find('td').removeClass('select');
    });
};




