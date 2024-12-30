//global variables to persist prediction data and inputs throughout the program
//idk js well so this was my solution to passing information
let predictionData = [];
let startInfect;
let totalPop;
let rNaught;
let numDays;
let percentVax;
let allInfected;


//assigns global variables and generates the data
function submitData(event)
{
    event.preventDefault();
    startInfect = parseInt(document.getElementById("initial-infections").value);
    totalPop = parseInt(document.getElementById("population").value);
    rNaught = parseFloat(document.getElementById("r0").value);
    numDays = parseInt(document.getElementById("prediction-range").value);
    percentVax = parseFloat(document.getElementById("vaccinated").value);

    generateData();
    updateFillingEffect();
}

//main part of the application that makes the data
function generateData()
{
    let totalInfectData = startInfect;
    let infectedCount = 0;

    for(let index = 0; index < numDays; index++)
    {
        infectedCount = totalInfectData * rNaught * ((100 - percentVax) / 100); 

        //this is so that our prediction data of infected doesn't go past the amount of people in the simulation
        if (infectedCount > totalPop)
        {
            infectedCount = totalPop;
        }

        predictionData[index] = Math.round(infectedCount);

        totalInfectData += infectedCount;
    }
    console.log("Prediction Data:", predictionData);

    totalInfected = totalInfectData;

    return predictionData;
}


// Line Graph Modal Stuff
function openLineModal()
{
    document.getElementById('lineGraphModal').style.display = 'flex';

    drawlineGraphModal();
}

function closeLineModal()
{
    document.getElementById('lineGraphModal').style.display = 'none';
}



//Generating the line graph
function drawlineGraphModal()
{
    lineGraph = document.getElementById('lineGraphCanvas').getContext('2d');
    let arrayDays = [];

    //makes the days x-axis
    for(let index = 0; index < numDays; index++)
    {
        arrayDays[index] = index + 1;
    }

    new Chart(lineGraph,
    {
        type: 'line',
        data:
        {
            //makes the line
            labels: arrayDays,
            datasets:
            [{
                label: 'Number of Infected',
                data: predictionData,
                borderColor: 'red',
                borderWidth: 2,
                fill: false
            }]
        },

        //makes the title
        options:
        {
            responsive: true,
            maintainAspectRatio: false,
            plugins:
            {
                title:
                {
                    display: true,
                    text: 'Infection Trend Over Time'
                }
            }
        },
    });
}





//Pie Chart Modal Stuff
function openPieModal()
{
    document.getElementById('pieChartModal').style.display = 'flex';

    drawPieChartModal();
}

function closePieModal()
{
    document.getElementById('pieChartModal').style.display = 'none';
}


//Generating the pie chart
function drawPieChartModal()
{
    newPieChart = document.getElementById("pieChartCanvas").getContext("2d");
    
    //makes our global variables local in this
    let totalInfected = predictionData[numDays - 1];
    let healthy = totalPop - totalInfected;

    pieChart = new Chart(newPieChart,
    {
        type: "pie",
        data:
        {
            //populates the pieces of pie chart
            labels: ["Healthy", "Infected"],
            datasets:
            [{
                backgroundColor: ["blue", "red"],
                data: [healthy, totalInfected],
            }]
        },

        options:
        {
            plugins:
            {
                datalabels:
                {
                    //the title format
                    display: true,
                    color: 'white',
                    formatter: (value, newPieChart) =>
                    {
                        return `${value}`;
                    }
                },
                title:
                {
                    display: true,
                    text: "Infection Distribution"
                }
            }
        }
    });
}





//Table modal stuff
function openTableModal()
{
    document.getElementById('tableFormModal').style.display = 'flex';

    drawTableFormModal();
}

function closeTableModal()
{
    document.getElementById('tableFormModal').style.display = 'none';
}


//Creating the table
function drawTableFormModal()
{   
    newTable = document.getElementById("tableFormModal").querySelector("tbody");

    newTable.innerHTML = "";

    //builds the table block by block
    predictionData.forEach((value, index) =>
    {
        newRow = document.createElement("tr");

        //adds the current day
        dayBlock = document.createElement("td");
        dayBlock.textContent = `${index + 1}`;
        newRow.appendChild(dayBlock);

        //adds the amount of infected total at that day
        infectedBlock = document.createElement("td");
        infectedBlock.textContent = value;
        newRow.appendChild(infectedBlock);

        newTable.appendChild(newRow);
    });
} 


//function that is supposed to fill up the city image
function updateFillingEffect()
{
    population = document.getElementById("population").value;
    infected = document.getElementById("infected").value;

    fillPercentage = (totalInfected / totalPop) * 100;

    fillingDiv = document.getElementById("fillingDiv");
    fillingDiv.style.height = `${fillPercentage}%`;
}


//an attempt at trying to make a pdf report generator
function generateReport()
{
    newReport = new jsPDF();

    newReport.setFontSize(18);
    newReport.text("Infection Report", 10, 10);

    //ads the line grpah
    lineGraphCanvas = document.getElementById("lineGraphCanvas");
    lineGraphImage = lineGraphCanvas.toDataURL("image/png");
    newReport.addImage(lineGraphImage, "PNG", 10, 30, 180, 100);

    //adds the pie chart
    pieChartCanvas = document.getElementById("pieChartCanvas");
    pieChartImage = pieChartCanvas.toDataURL("image/png");
    newReport.addImage(pieChartImage, "PNG", 10, 140, 180, 100);

    //saves the whole thing to pdf
    newReport.save("InfectionReport.pdf");
}


//Search functions
function searchMayo()
{
    keyword = document.getElementById("searchinput").value.trim();

    tempURL = `https://www.mayoclinic.org/search/search-results?q=${encodeURIComponent(keyword)}`
    window.open(tempURL, "_blank");
}

function searchNCBI()
{
    keyword = document.getElementById("searchinput").value.trim();

    tempURL = `https://www.ncbi.nlm.nih.gov/search/all/?term=${encodeURIComponent(keyword)}`
    window.open(tempURL, "_blank"); 
}

function searchGoogle()
{
    keyword = document.getElementById("searchinput").value.trim();

    tempURL = `https://scholar.google.com/scholar?q=${encodeURIComponent(keyword)}`
    window.open(tempURL, "_blank");
}
