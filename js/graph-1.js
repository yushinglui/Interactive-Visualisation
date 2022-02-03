// This bar graph is enlighten by https://www.d3-graph-gallery.com/graph/barplot_animation_start.html
// and https://blockbuilder.org/1Cr18Ni9/bfadecc96183c48d13b7b90bcf358a61

function main() {

    // create the setting of the dimensions and margins for the bar graph
    var margin = { top: 10, right: 30, bottom: 100, left: 50 }
    var width = 1000 - margin.left - margin.right
    var height = 500 - margin.top - margin.bottom;

    var dataUrl = "https://raw.githubusercontent.com/yushinglui/IV/main/graph1.csv"

    // fetch the data
    d3.csv(dataUrl)
        .then((data) => {

            // append the svg object into the page
            var svg = d3.select("#graph-1")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // add X axis
            var x = d3.scaleBand()
                .range([0, width])
                .domain(data.map(function (d) { return d.CourseCode; }))
                .padding(0.2);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-90)")
                .style("text-anchor", "end");

            // add Y axis
            var y = d3.scaleLinear()
                .domain([0, 55])
                .range([height, 0])
            svg.append("g")
                .call(d3.axisLeft(y));

            // create bars and interactive function
            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", function (d) { return x(d.CourseCode); })
                .attr("width", x.bandwidth())
                .attr("fill", "#F5980A")
                .attr("height", function (d) { return height - y(0); })
                .attr("y", function (d) { return y(0); })
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseout', mouseout);

            // create animation for the bars at the beginning to load the webpage
            svg.selectAll("rect")
                .transition()
                .duration(1000)
                .attr("y", function (d) { return y(d.AverageDistance); })
                .attr("height", function (d) { return height - y(d.AverageDistance); })
                .delay(function (d, i) { console.log(i); return (i * 10) })

            // add axis labels
            svg.append('text')
                .attr('x', -(height / 2))
                .attr('y', width - 950)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .text('Average Distance (Miles)');

            svg.append('text')
                .attr('x', 450)
                .attr('y', 460)
                .attr('transform', 'rotate()')
                .attr('text-anchor', 'middle')
                .text('Course Code');

            // add text labels on the top of the bars
            svg.selectAll(null)
                .data(data)
                .enter()
                .append("text")
                .text(function (d) { return d.AverageDistance; })

                .attr("x", function (d) { return x(d.CourseCode) + 5; })
                .attr("y", function (d) { console.log(d); return y(d.AverageDistance) - 2; })

                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("text-anchor", "middle");

            // create tooltip to show the details of each course
            var div = d3.select('#graph-1').append('div')
                .attr('class', 'tooltip')
                .style('display', 'none');
            function mouseover() {
                div.style('display', 'inline');
            }
            function mousemove() {
                var d = d3.select(this).data()[0]
                div
                    .html(d.CourseName + '<hr/>' + d.CourseCode)
                    .style('left', (event.pageX - 60) + 'px')
                    .style('top', (event.pageY - 80) + 'px');
            }
            function mouseout() {
                div.style('display', 'none');
            }
        })
}
window.addEventListener(
    'load',
    main
);
