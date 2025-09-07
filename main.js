class Assignment {
    //oop
    constructor(
        month,
        day,
        year,
        name,
        type,
        points,
        maxPoints
    ) {
        this.month = month;
        this.day = day;
        this.year = year;
        this.name = name;
        this.type = type;
        this.points = points;
        this.maxPoints = maxPoints;
        this.id = crypto.randomUUID();
    }

    get month() {
        return this._month;
    }
    set month(newMonth) {
        this._month = newMonth;
    }

    get day() {
        return this._day;
    }
    set day(newDay) {
        this._day = newDay;
    }

    get year() {
        return this._year;
    }
    set year(newYear) {
        this._year = newYear;
    }

    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }

    get type() {
        return this._type;
    }
    set type(newType) {
        this._type = newType;
    }

    get points() {
        return this._points;
    }
    set points(newPoints) {
        this._points = newPoints;
    }

    get maxPoints() {
        return this._maxPoints;
    }
    set maxPoints(newMaxPoints) {
        this._maxPoints = newMaxPoints;
    }

    get grade() {

        if (this._points === -1) {
            return "N/A";
        }
        else if (this._maxPoints > 0) {
            const calculatedGrade = (this._points / this._maxPoints) * 100;

            if (calculatedGrade >= 97.5) {
                return "A+";
            } else if (calculatedGrade >= 92.5) {
                return "A";
            } else if (calculatedGrade >= 89.5) {
                return "A-";
            } else if (calculatedGrade >= 86.5) {
                return "B+";
            } else if (calculatedGrade >= 82.5) {
                return "B";
            } else if (calculatedGrade >= 79.5) {
                return "B-";
            } else if (calculatedGrade >= 76.5) {
                return "C+";
            } else if (calculatedGrade >= 72.5) {
                return "C";
            } else if (calculatedGrade >= 69.5) {
                return "C-";
            } else if (calculatedGrade >= 66.5) {
                return "D+";
            } else if (calculatedGrade >= 62.5) {
                return "D";
            } else if (calculatedGrade >= 59.5) {
                return "D-";
            } else {
                return "F";
            }
        }

        return "N/A"; // Return a non-numeric value for cases with no points
    }
}

// array of assigments
let allAssignments = [];

function parseAssign() {
    const textBox = document.getElementById("gradeInput");
    const rawText = textBox.value;
    const lines = rawText.split("\n");
    console.log(lines); //for debugging


    for (let i = 0; i < lines.length; i += 5) {
        // get the date in mm/dd/yyyy
        const fullDate = lines[i];

        // split using the slash
        const dateParts = fullDate.split("/");

        // assign each part to a variable
        const month = dateParts[0];
        const day = dateParts[1];
        const year = dateParts[2] % 100;

        console.log(`Month: ${month}, Day: ${day}, Year: ${year}`);

        // get the assignment name
        const name = lines[i + 1];
        console.log(`Name: ${name}`);

        // get the assignment type
        const typeAndZero = lines[i + 2];
        const assignmentType = typeAndZero.split("\t")[0]; // splits at the tab
        console.log(`Type: ${assignmentType}`);

        // get the points and max points
        let points, maxPoints;
        const rawScoreLine = lines[i + 4].trim();

        // remove the Raw Score text
        const scoreLineData = rawScoreLine.split('\t')[1];

        // check if it has a grade or its just points possible
        if (scoreLineData.includes('/')) {
            // actually graded
            const scoreParts = scoreLineData.split('/'); // array
            points = parseFloat(scoreParts[0]);  // turn into a number
            maxPoints = parseFloat(scoreParts[1]); // same thing

        } else if (scoreLineData.includes('Points Possible')) {
            // ungraded assignment
            points = -1;
            const pointsParts = scoreLineData.split('Points Possible');
            maxPoints = parseFloat(pointsParts[0]); // get the number of points possible

        } else {
            // other cases, will signal an error
            points = null;
            maxPoints = null;
        }

        console.log(`Points: ${points}, Max Points: ${maxPoints}`);

        // make the object
        const assignment = new Assignment(
            month,
            day,
            year,
            name,
            assignmentType,
            points,
            maxPoints
        );
        allAssignments.push(assignment);
        textBox.value = "";
    }

    console.log(allAssignments);
    displayAssignments(allAssignments);
    console.log(gradeCalculator(allAssignments));

}

function displayAssignments(assignments) {
    const tableBody = document.getElementById("assignmentsTableBody");
    tableBody.innerHTML = ""; // clear the preexisting values
    const pasteSection = document.getElementById("pasteSection");
    if (assignments.length > 0) {
        pasteSection.style.display = 'none';
    } else {
        pasteSection.style.display = ''; // revert default
    }
    // iterate through the array of assignments
    assignments.forEach(assignment => {
        // creates table row
        const row = document.createElement("tr");
        row.dataset.id = assignment.id;

        // make a cell for the month, day, and year
        const dateCell = document.createElement("td");
        dateCell.textContent = assignment.month + "/" + assignment.day + "/" + assignment.year;
        dateCell.className = "py-3 pr-4";
        row.appendChild(dateCell);

        // name row
        const nameCell = document.createElement("td");
        nameCell.textContent = assignment.name;
        nameCell.className = "py-3 pr-4";
        row.appendChild(nameCell);

        // type row
        const typeCell = document.createElement("td");
        typeCell.textContent = assignment.type;
        typeCell.className = "py-3 pr-4";
        row.appendChild(typeCell);

        // points row
        const pointsCell = document.createElement("td");
        pointsCell.textContent = (assignment.points === -1) ? "Ungraded" : assignment.points; // goofy ahh if else
        pointsCell.className = "py-3 pr-4 text-right";
        row.appendChild(pointsCell);

        // max points row
        const maxPointsCell = document.createElement("td");
        maxPointsCell.textContent = assignment.maxPoints;
        maxPointsCell.className = "py-3 pr-4 text-right";
        row.appendChild(maxPointsCell);

        // letter grade row
        const letterCell = document.createElement("td");
        letterCell.textContent = assignment.grade;
        letterCell.className = "py-3 pr-4";
        row.appendChild(letterCell);

        // delete and eventually edit button
        const actionsCell = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "bg-red-500 text-white px-2 py-1 rounded text-s hover:bg-red-600 transition-colors";
        deleteBtn.addEventListener("click", () => {
            const assignmentId = row.dataset.id;
            allAssignments = allAssignments.filter(assignment => assignment.id !== assignmentId);
            displayAssignments(allAssignments);
            
        })

        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        // add the finished row to the table
        tableBody.appendChild(row);
    });
    const finalPercent = gradeCalculator(allAssignments);
    const finalGradeDisplay = document.getElementById("finalGrade");

    if (typeof finalPercent === 'number') {
        finalGradeDisplay.textContent = `${finalPercent.toFixed(2)}%`;
    } 
    else {
        finalGradeDisplay.textContent = finalPercent; // This will display "N/A"
    }
        // call the thing to display

}

function gradeCalculator(list) {
    let majorPoints = 0;
    let majorMaxPoints = 0;
    let minorPoints = 0;
    let minorMaxPoints = 0;
    let formativePoints = 0;
    let formativeMaxPoints = 0;

    for (let i = 0; i < list.length; i++) {
        // save current loop in variable
        const assignment = list[i];
        // add
        if (assignment.points !== -1 && assignment.points !== null) {
            if (assignment.type === "Major Summative") {
                majorPoints += assignment.points;
                majorMaxPoints += assignment.maxPoints;
            }
            else if (assignment.type === "Minor Summative") {
                minorPoints += assignment.points;
                minorMaxPoints += assignment.maxPoints;
            }
            else if (assignment.type === "Graded Formative") {
                formativePoints += assignment.points;
                formativeMaxPoints += assignment.maxPoints;
            }
        }

    }
    // set weights
    const majorWeight = 50;
    const minorWeight = 40;
    const formativeWeight = 10;

    // check which ones have data
    let totalWeight = 0;
    if (majorMaxPoints > 0) {
        totalWeight += majorWeight;
    }
    if (minorMaxPoints > 0) {
        totalWeight += minorWeight;
    }
    if (formativeMaxPoints > 0) {
        totalWeight += formativeWeight;
    }


    // dont divide by 0
    if (totalWeight === 0) {
        return "N/A";
    }

    else {
        // normalize the weights
        const majorWeightNormalized = (majorMaxPoints > 0) ? majorWeight / totalWeight : 0;
        const minorWeightNormalized = (minorMaxPoints > 0) ? minorWeight / totalWeight : 0;
        const formativeWeightNormalized = (formativeMaxPoints > 0) ? formativeWeight / totalWeight : 0;

        // NOW do the grade distribution bro
        const majorGrade = (majorMaxPoints > 0) ? (majorPoints / majorMaxPoints) * majorWeightNormalized : 0;
        const minorGrade = (minorMaxPoints > 0) ? (minorPoints / minorMaxPoints) * minorWeightNormalized : 0;
        const formativeGrade = (formativeMaxPoints > 0) ? (formativePoints / formativeMaxPoints) * formativeWeightNormalized : 0;

        const finalGrade = (majorGrade + minorGrade + formativeGrade) * 100;


        return finalGrade;
    }


}

function addNewAssignment() {
    // get the value from the input boxes
    const newDateInput = document.getElementById("newDate").value;
    const newName = document.getElementById("newName").value;
    const newType = document.getElementById("newType").value;
    const newPoints = parseFloat(document.getElementById("newPoints").value);
    const newMaxPoints = parseFloat(document.getElementById("newMaxPoints").value);
    
    // makes sure them joints is filled out
    if (!newDateInput || !newName || !newType || isNaN(newPoints) || isNaN(newMaxPoints)) {
        console.log("Error: Please fill out all fields.");
        return; // cancel the func
    }

    // its in yyyy-mm-dd so we gotta parse
    const dateParts = newDateInput.split("-");
    const year = dateParts[0] % 100; // get the last 2 digits
    const month = dateParts[1];
    const day = dateParts[2];

    // make the object yk
    const newAssignment = new Assignment(month, day, year, newName, newType, newPoints, newMaxPoints);

    // add to array
    allAssignments.push(newAssignment);

    // update the display box
    displayAssignments(allAssignments);

    // clear the input boxes for the next entry
    document.getElementById("newDate").value = "";
    document.getElementById("newName").value = "";
    document.getElementById("newType").value = "Major Summative";
    document.getElementById("newPoints").value = "";
    document.getElementById("newMaxPoints").value = "";
}

function resetApp() {
    // clear assignments
    allAssignments = [];

    // this will display the empty table
    displayAssignments(allAssignments);

    // remove the %
    document.getElementById("finalGrade").textContent = "--%";
}


// ts page needs to load
document.addEventListener("DOMContentLoaded", () => {
    // get button element
    const calculateBtn = document.getElementById("calculateBtn");
    calculateBtn.addEventListener("click", parseAssign);

    // resetter
    const resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener("click", resetApp);

    const addBtn = document.getElementById("addAssignmentBtn");
    addBtn.addEventListener("click", addNewAssignment);
});


const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalContainer = document.getElementById('modalContainer');

function openModal() {
    modalContainer.classList.remove('hidden');
}

function closeModal() {
    modalContainer.classList.add('hidden');
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

// Optional: Close the modal if the user clicks outside the content box
modalContainer.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
        closeModal();
    }
});
