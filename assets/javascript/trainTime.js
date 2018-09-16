// * Train Name
    
// * Destination 
    
// * First Train Time -- in military time

// * Frequency -- in minutes

// * Code this app to calculate when the next train will arrive; this should be relative to the current time.
$(document).ready(function () {
    // $("#train-name-input").val("");
    // $("#train-name-input").removeClass("alert alert success");


// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAA89Se884k_LhKKY9GFcVOpRqFZp9aCEE",
    authDomain: "july2018uofr.firebaseapp.com",
    databaseURL: "https://july2018uofr.firebaseio.com",
    projectId: "july2018uofr",
    storageBucket: "july2018uofr.appspot.com",
    messagingSenderId: "266739656289"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding Trains
  $("#add-train-btn").on("click", function() {
   // event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainStart = moment($("#train-time-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        start: trainStart,
        frequency: trainFrequency
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);
  
   // alert("train successfully added");
  
    $("#form-submit-message").text("Train successfully added!").addClass("alert success alert");

    //Clears all of the text-boxes
 
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");
    $("#form-submit-message").text("");
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().frequency;
  
    // train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainStart);
    console.log(trainFrequency);
  
    // calculate train schedule

// First Time (pushed back 1 year to make sure it comes before current time)
var trainStartConverted = moment(trainStart, "HH:mm").subtract(1, "years");
console.log(trainStartConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(trainStartConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % trainFrequency;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = trainFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


  
    //Create the new row

    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(moment(nextTrain).format("hh:mm A")),
      $("<td>").text(tMinutesTillTrain)
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  

})