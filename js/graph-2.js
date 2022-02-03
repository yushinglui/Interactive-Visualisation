// This clustered bar graph is enlighten by https://bl.ocks.org/bricedev/0d95074b6d83a77dc3ad

function main() {

    // create the setting of the dimensions and margins for the graph
    var margin = { top: 10, right: 30, bottom: 40, left: 50 },
        width = 1000 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var dataUrl = "https://raw.githubusercontent.com/yushinglui/IV/main/graph2.csv"

    // fetch the data
    d3.csv(dataUrl)
        .then((data) => {

            // append the svg object into the page
            var svg = d3.select("#graph-2")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")")

            // list of subgroups
            var subgroups = data.columns.slice(1)

            // list of groups
            var groups = d3.map(data, function (d) { return (d.startTime); })

            // add X axis
            var x = d3.scaleBand()
                .domain(groups)
                .range([0, width])
                .padding([0.2])
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "axis")
                .call(d3.axisBottom(x).tickSize(0));

            // add Y axis
            var y = d3.scaleLinear()
                .domain([0, 20])
                .range([height, 0]);
            svg.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y));

            // scale for subgroup
            var xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, x.bandwidth()])
                .padding([0.04])

            // color per subgroup
            var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#F5980A', '#0A67F5'])

            // show the bars
            svg.append("g")
                .selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr("transform", function (d) { return "translate(" + x(d.startTime) + ",0)"; })

                .selectAll("rect")
                .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
                .enter()
                .append("rect")
                .attr("x", function (d) { return xSubgroup(d.key); })
                .attr("y", function (d) { return y(d.value); })
                .attr("width", xSubgroup.bandwidth())
                .attr("height", function (d) { return height - y(d.value); })
                .attr("fill", function (d) { return color(d.key); })

                // interactive animation
                .on("mouseover", function (d) {
                    d3.select(this).style("fill", d3.rgb(color(d.key)).darker(4))
                })
                .on("mouseout", function (d) {
                    d3.select(this).style("fill", function (d) { return color(d.key); })
                })

            // add axis labels
            svg.append('text')
                .attr('x', - (height / 2))
                .attr('y', width - 950)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .style("font-size", "17px")
                .text('Average Distance (Miles)')

            svg.append('text')
                .attr('x', 450)
                .attr('y', width - 540)
                .attr('transform', 'rotate()')
                .attr('text-anchor', 'middle')
                .style("font-size", "17px")
                .text('Start Time');

            // add legend
            svg.append("circle").attr("cx", 800).attr("cy", 10).attr("r", 6).style("fill", "#F5980A")
            svg.append("circle").attr("cx", 800).attr("cy", 30).attr("r", 6).style("fill", "#0A67F5")
            svg.append("text").attr("x", 820).attr("y", 10).text("Present").style("font-size", "17px").attr("alignment-baseline", "middle")
            svg.append("text").attr("x", 820).attr("y", 30).text("Absent").style("font-size", "17px").attr("alignment-baseline", "middle")

            // add text labels on bars
            svg.append("g")
                .selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr("transform", function (d) { return "translate(" + x(d.startTime) + ",0)"; })

                .selectAll("text")
                .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
                .enter()
                .append("text")
                .text(function (d) { return d.value; })

                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "white")
                .attr("text-anchor", "middle")

                .attr("x", function (d) { return xSubgroup(d.key) + 15; })
                .attr("y", function (d) { return y(d.value) + 15; })
        });
}
window.addEventListener(
    'load',
    main
);
