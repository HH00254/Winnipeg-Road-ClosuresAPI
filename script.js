/******w**************
    
    Assignment 4 Javascript
    Name: Al Hochbaum   
    Date: Oct 14, 2023
    Description: This JavaScript preforms the fetching and formating of the API for road closures.

*********************/
document.addEventListener("DOMContentLoaded", load);

/*
 *
 *
 */
function load() {
    const submitButton = document.getElementById("submit");
    const resetButton = document.getElementById("reset");

    submitButton.addEventListener("click", event => {
        event.preventDefault();

        if (document.getElementById("road_closures").style.visibility === 'visible') {
            clearTableData();
        }
    
        hideErrorMessage();
        displayFetchedData();
    });

    resetButton.addEventListener("click", () => {
        hideErrorMessage();
        resetUserInputs();
        clearTableData();
    });
}

/*
 *
 *
 */
async function getData() {

    let organizationElement = document.getElementById("organization").value.trim();
    let cityDistrict        =  document.getElementById("district").value.trim();

    const apiRequest = 
        encodeURI("https://data.winnipeg.ca/resource/lane_closure.json?" +
                    `$where=(lower(organization) LIKE lower('%${organizationElement}%')) 
                     AND (lower(direction) LIKE lower('%${cityDistrict}%'))` +
                    `&$order=date_closed_from DESC` +
                    `&$limit=100`
                    );
            
    try {

        const response = await fetch(apiRequest);
        const dataFormated = await response.json();

        if (response.status === 200 && dataFormated.length > 0) {
            return dataFormated;
        }
        else {
            displayErrorMessage('Server error: ' + `${dataFormated.error.message}`);
        }
    } 
    catch (error) {
        displayErrorMessage('Fetch error: ' + `${error.name.message}`);
    }
}


/*
 *
 *
 */
async function displayFetchedData() {

    let displayData = await getData();

    if (displayData === undefined) {
        return;
    }

    let tableBodyTag          = document.getElementsByTagName('tbody')[0];
    let tHeadTag              = document.getElementById("table_header");
    let tableTag              = document.getElementById("road_closures");
    tableTag.style.visibility = "visible";

    let keys   = null;
    let values = null;
    
    for(let index = 0; index < displayData.length; index++) {

        if (index === 0) {

            keys = reformatTableHeaders(Object.keys(displayData[index]));
            let tableRow = document.createElement('tr');

            for (let i = 0; i < keys.length - 6; i++) {
                
                let thTag = document.createElement('th');

                thTag.innerHTML = `${keys[i]}`;
                tableRow.append(thTag);
                tHeadTag.append(tableRow);
            }
        }

        values = Object.values(displayData[index]);

        let tableDataRow = document.createElement('tr');
        tableDataRow.onclick = SelectedElement.bind(null, tableDataRow);
        tableDataRow.className = "data_rows";
        
        for (x = 0; x < values.length -6; x++) {

            let tableData = document.createElement('td');
            tableData.className = "data_cell";

            tableData.innerHTML = `${values[x]}`;
            tableDataRow.append(tableData);
            tableBodyTag.appendChild(tableDataRow);
        }
    } 
}

/*
 *
 *
 */
function SelectedElement(element) {

    const closeModal = document.querySelector(".button");
    const modal = document.getElementById("displayContent");
    const container = document.getElementById('w3-container');
    
    modal.style.display = "block";

    for(let index = 0; index < element.length - 1; index++) {

        let ulTag = document.createElement('ul');
        ulTag.appendChild(`<li> ${element[index]} </li>`);
        container.appendChild(ulTag);
    } 
        modal.style.display = "block";
    
        closeModal.addEventListener("click", () => {
            
        modal.style.display = "none";
    });
}

/*
 *
 *
 */
function clearTableData() {

    let tableTag = document.getElementById("road_closures");
    let tHeadTag = document.getElementById("table_header")
    let tbodyTag = document.getElementsByTagName('tbody')[0];

    while (tHeadTag.hasChildNodes()) {
        tHeadTag.removeChild(tHeadTag.firstChild);
    }

    while (tbodyTag.hasChildNodes()) {
        tbodyTag.removeChild(tbodyTag.firstChild);
    }
    
    tableTag.style.visibility = "hidden";
}



/*
 *
 *
 */
function resetUserInputs() {

    document.getElementById('district').value = "";

    let organizationInput = document.getElementById('organization');
    organizationInput.value = "";
    organizationInput.focus();
    organizationInput.select();
}

/*
 *
 *
 */
function displayErrorMessage(value) {

    let pTag = document.getElementById('message_error');
    pTag.style.visibility  = "visible";

    let message =  "I\'m sorry there was a issue well processing you request. \nThe issue was a " + `${value}`;
    pTag.innerHTML = message;
}

/*
 *
 *
 */
function hideErrorMessage () {
    document.getElementById('message_error').style.visibility  = "hidden";
}

/*
 *
 *
 */
function reformatTableHeaders(tableHeadersArray) {

    tableHeadersArray.forEach(function (element, index, array) {

        let indexLocation;

        if (element.indexOf("_") === -1) {
            array[index] = element[0].toUpperCase() + element.substring(1);
        }
        else {
            do {

                indexLocation = element.indexOf("_");

                let subStringOne = element[0] !== element[0].toUpperCase() ? 
                    element[0].toUpperCase() + element.substring(1, indexLocation) : 
                    element.substring(0, indexLocation);

                let subStringTwo = 
                    element[indexLocation + 1].toUpperCase() +
                    element.substring(indexLocation + 2, element.length);
    
                    // You need to move me!
                array[index] = (element =  `${subStringOne}` + " " + `${subStringTwo}`);
            } while (element.indexOf("_") !== -1);
        }
    });
    return tableHeadersArray;
}


