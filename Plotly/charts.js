///////////////// Deliverable 1 //////////////////////////////
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

/////////////////Deliverable 2: Bar and Bubble charts///////////////////////
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
   //Create a variable that holds the samples array.
    console.log(data);
    var sampleArray = data.samples;
    var metadataArray = data.metadata 

    // Create a variable that filters the samples for the object with the desired sample number.
    var filteredArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    var filteredMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var result = filteredArray[0];
    var metadataResult = filteredMetadata[0]

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = result.otu_ids;
    var otu_label = result.otu_labels;
    var sample_value = result.sample_values;
    var wash_freq = metadataResult.wfreq;


    // Create the yticks for the bar chart.
    var yticks = otu_id.slice(0, 10).map(otu => "OTU" + otu).reverse();
    var xticks = sample_value.slice(0,10).reverse()
    var hoverlabels = otu_label.slice(0, 10).reverse()
    // console.log(yticks);

    // Create the trace for the bar chart. 
    var barData = [{
      type: 'bar',
      orientation: 'h',
      text: hoverlabels,
      y: yticks,
      x: xticks,
    }];
    var barLayout = {
      title: "...",
      margin:{t:30,l:150}
    }

    // console.log(yticks);
    //Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    //Create the trace for the bubble chart.
    var bubbleData = [{
      type: 'bubble',
      x: otu_id,
      y: sample_value,
      text: otu_label,
      mode: 'markers',
      marker: {
        size : sample_value,
        color: otu_id
      }
    }
    ];

    //Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: "OTU ID"
      },
      hovermode: 'closest',
      paper_bgcolor: '#F0F8FF',
      plot_bgcolor: '#F0F8FF'
    };
    //Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
//   });
// }

//////////////  Deliverable 3: Gaug Chart ///////////////
// Create the trace for the gauge chart.
    var gaugeData = [ {
      type: "indicator",
      mode: "gauge+number",
      value: wash_freq,
      gauge: {
        axis: { range: [null, 10], tickcolor: "black" },
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ],
      }
    }
     
    ];
    
    //Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: { text: "Belly Button Washing Frequency <br> Scrubs Per Week"},
      width: 500,
      height: 400,
      plot_bgcolor: '#F0F8FF',
      paper_bgcolor: '#F0F8FF',
    };

    //Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
