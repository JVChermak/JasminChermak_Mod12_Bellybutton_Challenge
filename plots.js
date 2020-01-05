function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      }); 
    });
    buildMetadata(940);
    buildCharts(940);
}
  
  init();

  function optionChanged(newSample) {
      buildMetadata(newSample);
      buildCharts(newSample);
  }

  function buildMetadata(sample) {
      d3.json("samples.json").then((data) => {
          var metadata = data.metadata;
          var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
          var result = resultArray[0];
          var demographic = Object.entries(result);
          var PANEL = d3.select("#sample-metadata");

          PANEL.html("");
          demographic.forEach(([key, value]) => PANEL.append("h6").text(key + ": " + value));
      });
  }

  function buildCharts(sample) {
      d3.json("samples.json").then((data) => {
          var samples = data.samples;
          var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
          var result = resultArray[0];
          var sampleValues = result.sample_values;
          var topTenOTUs = sampleValues.slice(0,10);
          var sampleIDs = result.otu_ids;
          var topTenIDs = sampleIDs.slice(0,10);
          var otuReversed = topTenOTUs.reverse();
          var idsReversed = topTenIDs.reverse();
          var yLabels = [];
          idsReversed.forEach(function(id) {
            yLabels.push("OTU " + id);
          });
          var textLabels = result.otu_labels;

          var trace1 = {
              x: otuReversed,
              y: yLabels,
              text: textLabels,
              type: "bar",
              orientation: "h"
          };
          var data1 = [trace1];

          Plotly.newPlot("bar", data1);

          var trace2 = {
              x: sampleIDs,
              y: sampleValues,
              text: textLabels,
              mode: "markers",
              marker: {
                color: sampleIDs,  
                size: sampleValues
              }
          };
          var data2 = [trace2];
          Plotly.newPlot("bubble", data2);

          var trace3 = {
              values: [81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
              text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
              hole: 0.4,
              rotation: 90,
              direction: "clockwise",
              textinfo: "text",
              textposition: "inside",
              marker: {
                  colors: ["", "", "", "", "", "", "", "", "", "white"],
                  labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
                  hoverinfo: "label"
              },
              type: "pie"
          };
          var data3 = [trace3];

          var metadata = data.metadata;
          var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
          var result = resultArray[0];
          var wfreq = result.wfreq;
          var needleAngle = wfreq * 0.34906585;

          var layout = {
              title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
              showlegend: false,
              shapes: [{
                  type: "line",
                  x0: 0.5,
                  y0:0.5,
                  x1: 0.5 - 0.2 * Math.cos(needleAngle),
                  y1: 0.5 + 0.2 * Math.sin(needleAngle),
                  line: {
                      color: "black",
                      width: 3
                  }
              }],
              xaxis: {visible: false, range: [-1,1]},
              yaxis: {visible: false, range: [-1,1]}
          };
          Plotly.newPlot("gauge", data3, layout);
      });
  }