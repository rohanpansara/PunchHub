var punchIns = [];
var punchOuts = [];
var inInput = document.getElementById("addPunchInBtn");
var outInput = document.getElementById("addPunchOutBtn");
outInput.disabled = true;

function addPunchIn() {
  var punchIn = document.getElementById("punchIn").value;

  if (punchOuts.length > 0 && punchIn <= punchOuts[punchOuts.length - 1]) {
    alert("Time-Travel is not allowed in the real world!");
    return;
  }

  punchIns.push(punchIn);
  displayPunchList();
  outInput.disabled = false;
  inInput.disabled = true;
  document.getElementById("punchIn").value = ""; // Clear input field after adding punch in
}

function addPunchOut() {
  var punchOut = document.getElementById("punchOut").value;

  if (punchIns.length > 0 && punchOut <= punchIns[punchIns.length - 1]) {
    alert("Time-Travel is not allowed in the real world!");
    return;
  }

  punchOuts.push(punchOut);
  displayPunchList();
  inInput.disabled = false;
  outInput.disabled = true;
  document.getElementById("punchOut").value = ""; // Clear input field after adding punch out
}

function getCurrentTime() {
  var now = new Date();
  var hours = now.getHours().toString().padStart(2, "0");
  var minutes = now.getMinutes().toString().padStart(2, "0");
  return hours + ":" + minutes;
}

document.getElementById("punchIn").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (e.shiftKey) {
      e.preventDefault();
      document.getElementById("calculateTime").click();
    } else {
      document.getElementById("addPunchInBtn").click();
    }
  }
});

document.getElementById("punchOut").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (e.shiftKey) {
      e.preventDefault();
      document.getElementById("calculateTime").click();
    } else {
      document.getElementById("addPunchOutBtn").click();
    }
  }
});

var punchInInput = document.getElementById("punchIn");
var punchOutInput = document.getElementById("punchOut");

// Add keydown event listener to punchInInput
punchInInput.addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    event.preventDefault(); // Prevent default tab behavior
    punchOutInput.focus(); // Move focus to punchOutInput
  }
});

// Add keydown event listener to punchOutInput
punchOutInput.addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    event.preventDefault(); // Prevent default tab behavior
    punchInInput.focus(); // Move focus to punchInInput
  }
});

document.addEventListener('keydown', function (event) {
  // Check if the pressed key is 'r'
  if (event.key === 'r') {
    // Perform your desired task here
    resetInput();
  }
});

function calculateTime() {
  // Check if there are punch in times
  if (punchIns.length === 0) {
    alert("Please add at least one punch in time.");
    return;
  }

  // If there are more punch ins than punch outs, add a punch out at the current time
  if (punchIns.length > punchOuts.length) {
    punchOuts.push(getCurrentTime());
    displayPunchList(); // Update punch list when adding auto-generated punch out
  }

  var totalMilliseconds = 0;

  // Calculate total time worked
  for (var i = 0; i < punchIns.length; i++) {
    var punchInTime = new Date("2000-01-01T" + punchIns[i] + ":00").getTime();
    var punchOutTime = new Date("2000-01-01T" + punchOuts[i] + ":00").getTime();
    totalMilliseconds += punchOutTime - punchInTime;
  }

  // Convert total milliseconds to hours and minutes
  var hours = Math.floor(totalMilliseconds / 3600000);
  var minutes = Math.floor((totalMilliseconds % 3600000) / 60000);

  // Display total time worked
  console.log(hours + " hours and " + minutes + " minutes");

  var shiftHours = parseFloat(document.getElementById("shiftHours").value);

  // Calculate remaining time in milliseconds
  var remainingMilliseconds = shiftHours * 3600000 - totalMilliseconds;

  // Convert remaining milliseconds to hours and minutes
  var remainingHours = Math.floor(remainingMilliseconds / 3600000);
  var remainingMinutes = Math.floor((remainingMilliseconds % 3600000) / 60000);

  // Calculate final punch out time
  var finalPunchOutTime = new Date();
  finalPunchOutTime.setMilliseconds(finalPunchOutTime.getMilliseconds() + remainingMilliseconds);

  // Format final punch out time
  var finalPunchOutHours = finalPunchOutTime.getHours();
  var finalPunchOutMinutes = finalPunchOutTime.getMinutes();
  var ampm = finalPunchOutHours >= 12 ? "PM" : "AM";
  finalPunchOutHours = finalPunchOutHours % 12;
  finalPunchOutHours = finalPunchOutHours ? finalPunchOutHours : 12; // Handle midnight (0 hours)
  finalPunchOutMinutes = finalPunchOutMinutes.toString().padStart(2, "0");

  // Display total time worked and final punch out time


  // Calculate overtime
  var checker = calculateOvertime(finalPunchOutTime);
  if (checker == null) {
    document.getElementById("result").innerHTML = hours + " hrs " + minutes + " mins";
    document.getElementById("finalPunchOutTime").innerHTML = finalPunchOutHours + ":" + finalPunchOutMinutes + " " + ampm;
  }
  else {
    document.getElementById("result").innerHTML = hours + " hrs " + minutes + " mins";
    // document.getElementById("finalPunchOutTime").innerHTML = finalPunchOutHours + ":" + finalPunchOutMinutes + " " + ampm;
    document.getElementById("finalPunchOutTime").innerHTML = "You should have left by now"
    document.getElementById("overtime").textContent = checker;
  }
}


function calculateOvertime(finalPunchOutTime) {
  var now = new Date();
  var finalPunchOutHours = finalPunchOutTime.getHours();
  var finalPunchOutMinutes = finalPunchOutTime.getMinutes();

  // Handling case when final punch-out time extends to the next day
  if (finalPunchOutTime < now) {
    // Calculate overtime using current time as the reference
    var overtimeMilliseconds = now - finalPunchOutTime;
    var overtimeHours = Math.floor(overtimeMilliseconds / 3600000);
    var overtimeMinutes = Math.floor((overtimeMilliseconds % 3600000) / 60000);

    return "(Overtime ~ " + overtimeHours + "hrs " + overtimeMinutes + "mins)";
  } else {
    // No overtime if final punch-out time is in the future
    return null;
  }
}


function displayPunchList() {
  var punchList = document.getElementById("punchList");
  punchList.innerHTML = "";

  var punchInList = document.createElement("ul");
  var punchOutList = document.createElement("ul");

  for (var i = 0; i < punchIns.length; i++) {
    var punchInItem = document.createElement("li");
    punchInItem.textContent = punchIns[i];
    punchInList.appendChild(punchInItem);

    if (punchOuts[i]) {
      var punchOutItem = document.createElement("li");
      punchOutItem.textContent = punchOuts[i];
      punchOutList.appendChild(punchOutItem);
    }
  }

  var punchInSection = document.createElement("div");
  punchInSection.innerHTML = "<h3 id='listIN'>Punch Ins:</h3>";
  punchInSection.appendChild(punchInList);
  punchList.appendChild(punchInSection);

  var punchOutSection = document.createElement("div");
  punchOutSection.innerHTML = "<h3 id='listOUT'>Punch Outs:</h3>";
  punchOutSection.appendChild(punchOutList);
  punchList.appendChild(punchOutSection);
}

function resetInput() {
  // Clear the punchIns and punchOuts arrays
  punchIns = [];
  punchOuts = [];

  // Clear the input fields for punch in and punch out
  document.getElementById("punchIn").value = '';
  document.getElementById("punchOut").value = '';

  // Enable punch in input and disable punch out input
  inInput.disabled = false;
  outInput.disabled = true;

  // Reset the display of punch lists
  displayPunchList();

  // Reset the display of total time worked and final completion time
  document.getElementById("result").textContent = '';
  document.getElementById("finalPunchOutTime").textContent = '';
  document.getElementById("overtime").textContent = '';

  document.getElementById("listIN").textContent = '';
  document.getElementById("listOUT").textContent = '';
}
