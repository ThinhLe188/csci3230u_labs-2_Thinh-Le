const floatCheck= /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;

var selected = null;
var clicked = null;
var preVal = 0;

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8000/data/grades.csv",
        dataType: "text",
        success: function(response) {
            var rows = response.split('\n');

            var colHeaders = rows[0].split(',');
            
            var gradesData = [];
            for (var i = 1; i < rows.length; i++) {
                gradesData.push(rows[i].split(','));
            }

            $('#table').append('<thead> <tr> </tr> </thead>');
            $thead = $('#table > thead > tr:first');
            colHeaders.forEach(function(colHeader) {
                $thead.append('<th>' + colHeader + '</th>');
            });

            $('#table').append('<tbody> <tr> </tr> </tbody>');
            $tbody = $('#table > tbody');
            for (var i = 0; i < gradesData.length; i++) {
                var $tr = $('<tr/>').appendTo($tbody);
                $tr.append('<th scope="row">' + gradesData[i][0] + '</th>');
                for (var j = 1; j < colHeaders.length; j++) {
                    $tr.append('<td>' + gradesData[i][j] + '</td>');
                }
            }

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
        }
    })
});

$.fn.selectCol = function() {
    var gradesCol = [];
    var index = this.index();
    if (index == 0) {
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

const sumCounts = obj => Object.values(obj).reduce((a, b) => a + b);

function plot(numberGrades) {
    var letterGrades = numberGrades.map(getGrade);
    var gradeCounts = {}
    letterGrades.forEach(e => gradeCounts[e] ? gradeCounts[e]++ : gradeCounts[e] = 1);
    var plotData = []
    var totalCount = sumCounts(gradeCounts);
    for (var k in gradeCounts) {
        plotData.push({letter: k, freq: (gradeCounts[k] / totalCount)});
    }

    d3.select('svg').remove();

    const margin = 50;
    const width = 800;
    const height = 500;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    const colourScale = d3.scaleLinear()
                          .domain([0, 1])
                          .range(['lavender', 'blue']);
    
    const xScale = d3.scaleBand()
                     .range([0, chartWidth])
                     .domain(['A', 'B', 'C', 'D', 'F'])
                     .padding(0.3);
    
    const yScale = d3.scaleLinear()
                     .range([chartHeight, 0])
                     .domain([0, 1]);
    
    const svg = d3.select('#svg-div')
                  .append('svg')
                    .attr('width', width)
                    .attr('height', height);
    
    const canvas = svg.append('g')
                        .attr('transform', `translate(${margin}, ${margin})`);
    
    // chart title
    svg.append('text')
          .attr('x', margin + chartWidth / 2 + margin)
          .attr('y', margin)
          .attr('text-anchor', 'middle')
          .attr('font-weight', 'bold')
          .text('Grade Distribution');

    // x-axis and label
    canvas.append('g')
             .attr('transform', `translate(${margin}, ${chartHeight})`)
             .call(d3.axisBottom(xScale));

    svg.append('text')
           .attr('x', margin + chartWidth / 2 + margin)
           .attr('y', chartHeight + 2 * margin - 15)
           .attr('text-anchor', 'middle')
           .attr('font-weight', 'bold')
           .text('Grade');

    // y-axis and label
    canvas.append('g')
             .attr('transform', `translate(${margin}, 0)`)
             .call(d3.axisLeft(yScale));

    svg.append('text')
           .attr('x', margin - (chartWidth / 2))
           .attr('y', margin)
           .attr('transform', 'rotate(-90)')
           .attr('text-anchor', 'start')
           .attr('font-weight', 'bold')
           .text('Frequency (%)');
    
    // the bar chart
    const bars = canvas.selectAll('rect')
                       .data(plotData)
                       .enter()
                          .append('rect')
                              .attr('x', (data) => margin + xScale(data.letter))
                              .attr('y', chartHeight)
                              .attr('height', 0)
                              .attr('width', xScale.bandwidth())
                              .attr('fill', (data) => colourScale(data.freq))
                              .on('mouseenter', function(source, index) {
                                  d3.select(this)
                                    .transition()
                                    .duration(200)
                                    .attr('opacity', 0.5);
                              })
                              .on('mouseleave', function(source, index) {
                                d3.select(this)
                                    .transition()
                                    .duration(200)
                                    .attr('opacity', 1.0);
                              });
    bars.transition()
        .ease(d3.easeElastic)
        .duration(800)
        .delay((data, index) => index * 50)
        .attr('y', (data) => yScale(data.freq))
        .attr('height', (data) => chartHeight - yScale(data.freq));
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






