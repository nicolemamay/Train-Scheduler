// Initialize Firebase
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC-XPemKbKd2S4_SRCrlfzmlHDiDDZ8wvk",
    authDomain: "train-schedule-e661d.firebaseapp.com",
    databaseURL: "https://train-schedule-e661d.firebaseio.com",
    projectId: "train-schedule-e661d",
    storageBucket: "",
    messagingSenderId: "355769796299"
  };

firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

// Initial Values
var train = "";
var destination = "";
var time = 0;
var freq = 0;
var minutes = 0;

//  At the page load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());
  console.log(childSnapshot.val().train);

    if(childSnapshot.child("train").exists()) { 
        train = childSnapshot.val().train;
    }

    if(childSnapshot.child("destination").exists()) { 
        destination = childSnapshot.val().destination;
    }

    if(childSnapshot.child("freq").exists()) { 
        freq = childSnapshot.val().freq;
    }


    // First Time (pushed back 1 year to make sure it comes before current time)
    var newTimeConverted = moment(time, "hh:mm").subtract(1, "years");
    console.log(newTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(newTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % freq;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextTrainConverted = moment().add(tMinutesTillTrain, "minutes")

    // Convert next train time format
    nextTrainConverted = moment(nextTrainConverted).format("hh:mm");
    console.log("ARRIVAL TIME: " + nextTrainConverted);


    // Convert next train time to military time to set AM/PM displays
    nextTrain = moment(nextTrain).format("HH");
    console.log("military time train: ", nextTrain);

    if(nextTrain > 11) {
      var amPM = "PM";
    }
    else if(nextTrain <= 11) { 
      var amPM = "AM";
    }


    // Change the HTML to reflect the stored values
    $("#train-schedule").append("<tr class='trainNumber'><td>" + train + "</td><td>" + destination + "</td><td>" + freq + "</td><td>" + nextTrainConverted + " " + amPM + "</td><td>" + tMinutesTillTrain + "</td></tr>")

    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);

    });



// When the user clicks the submit button to add a train, get input values
$("#add-train").on("click", function(event) {
  event.preventDefault();

  var newTrain = $("#train-name").val().trim();
  var newDestination = $("#destination").val().trim();
  var newTime = $("#time").val().trim();
  var newFreq = parseInt($("#freq").val().trim());


  console.log("Train: " + newTrain);
  console.log("Destination: " + newDestination);
  console.log("Time: " + newTime);
  console.log("Frequency: " + newFreq);

  // Save the new train information in Firebase
    database.ref().push({
      train: newTrain,
      destination: newDestination,
      freq: newFreq
    });

   clearTrainInput();

});


  // Empty the values of the input fields
  function clearTrainInput() {
    $("#train-name").val(" ");
    $("#destination").val(" ");
    $("#time").val(" ");
    $("#freq").val(" ");
  }


