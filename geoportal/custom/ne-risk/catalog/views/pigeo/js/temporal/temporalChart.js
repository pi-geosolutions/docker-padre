(function() {

  goog.provide('app.temporalfiles.service');

  var module = angular.module('app.temporalfiles.service', []);

  module.service('temporalService', [
    function() {

    this.getChart = function(dataUrl, id) {
      if (d3.select("#"+id).select("svg")) {d3.select("#"+id).select("svg").remove();}

      var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 400 - margin.left - margin.right,
          height = 200 - margin.top - margin.bottom;

      var svg = d3.select("#"+id).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], 0.1);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickValues(this.tickValues);

      d3.tsv(dataUrl, function(error, data) {
        data.forEach(function(d) {
          d.value = +d.value;
        });

        x.domain(data.map(function(d) { return d.year; }));
        //  y.domain([0, d3.max(data, function(d) { return d.decade1; })]);
        y.domain([0, 255 ]);

        svg.selectAll(".d3_bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "d3_bar")
            .attr("x", function(d) { return x(d.year); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) {return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .text(function(d) { return d.value; });

        var xax = svg.append("g")
            .attr("class", "x d3_axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        xax.selectAll(".major line")
            .attr("transform", "translate("+x.rangeBand()/2+",0)");
        xax.selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-3")
            .attr("dy", "0em")
            .attr("transform", function(d) {
              return "rotate(-65)"
            });

        xax.append("text")
            .attr("x", width)
            .attr("y", 0)
            .attr("dy", "-.5em")
            .style("text-anchor", "middle")
            .text("years");

        svg.append("g")
            .attr("class", "y d3_axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text("index");
      });
    }
  }]);

})();