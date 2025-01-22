const URL = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";



// Find Subject Data
function getSubjectData(allData, subjectID) {
    // Filter the data for the object with the desired Subject ID
    let result = allData.find(item => item.id == subjectID);
    return result
}

// Build the metadata panel
function buildMetadata(subjectID) {
  d3.json(URL).then((data) => {

    // get the metadata field
    let subjectMetaData = getSubjectData(data.metadata, subjectID) 
      
    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(subjectMetaData).forEach(([key, value]) => {
      let line = `${key.toUpperCase()}: ${value}`;
      metadataPanel.append("h6").text(line);
    });
  });
}

// function to build both charts
function buildCharts(subjectID) {
  d3.json(URL).then((data) => {
    // Filter the samples for the object with the desired sample number
    let subjectSamples = getSubjectData(data.samples, subjectID) 
    console.log(subjectSamples);
    // Get the otu_ids, otu_labels, and sample_values
    let otuIDs = subjectSamples.otu_ids;
    let otuLabels = subjectSamples.otu_labels;
    let sampleValues = subjectSamples.sample_values;

    // Build a Bubble Chart
    let trace1 = {
      x: otuIDs,
      y: sampleValues,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIDs
      },
      text: otuLabels
    };

    let layout1 = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    };
    let chart = [trace1];
    console.log(trace1)
    // Render the Bubble Chart
    Plotly.newPlot("bubble", chart, layout1);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otuIDs.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Build a Bar Chart
    let trace2 = {
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
    };

    let layout2 = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: 'Number of Bacteria'},
    };
    let chart2 = [trace2];
    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart
    Plotly.newPlot("bar", chart2, layout2);
  });
}


// Function for event listener
function optionChanged(newSubjectID) {
//   // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSubjectID);
  buildCharts(newSubjectID);
}

    // Use d3 to select the dropdown with id of `#selDataset`
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

function fillDropdown(names) {
  let dropdown = d3.select("#selDataset");
  for (const name of names) {
    console.log(name);
    dropdown.append("option").text(name).attr("value", name);
  }
}

// Function to run on page load
    // Get the first sample from the list
    // Build charts and metadata panel with the first sample
function init() {
  d3.json(URL).then((data) => {
    buildMetadata(941)
    buildCharts(941)
    fillDropdown(data.names)
    // Get the names field
    data.names


  });
}


// Initialize the dashboard
init();

