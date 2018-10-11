// * Train Name
    
// * Destination 
    
// * First Train Time -- in military time

// * Frequency -- in minutes

// * Code this app to calculate when the next train will arrive; this should be relative to the current time.
$(document).ready(function () {
   //  $("#form-submit-message").hide("");
   //  $("#form-submit-message").removeClass("alert alert success");
  
   //create login variables
   var trainsReturned;
   var userID;
   var userName;
   var trainNames = [];
 


// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyD5dQvWPPxXUdaqd_dyz-0VvLghEfRbOHI",
  authDomain: "train-time-a1bc7.firebaseapp.com",
  databaseURL: "https://train-time-a1bc7.firebaseio.com",
  projectId: "train-time-a1bc7",
  storageBucket: "train-time-a1bc7.appspot.com",
  messagingSenderId: "115613693349"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  //log in toggle variable
  var toggleBoolean = false;

  // 2. Button for adding Trains
  $("#add-train-btn").on("click", function(event) {

    var isvalidate = $("#trainForm")[0].checkValidity();
    if (isvalidate) {
      event.preventDefault();
  
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
  

  //This adds the chosen wine to the database
  function updateDatabase(userID, train, destination) {
    var updates = {
      name: trainName,
      destination: trainDestination,
      start: trainStart,
      frequency: trainFrequency
    };
    database.ref("users/" + userID + "/trains").push(updates);
  }




    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);
  
  
    $("#form-submit-message").text("Train successfully added!").addClass("alert alert-success");

    $("#form-submit-message").delay(2000).slideUp(200, function() {
        $(this).alert('close').removeClass("alert alert-success");
    });


    //Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");
    
  }
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
  
  $("#form-submit-message").text("");


 // begin login scripts
 firebase.auth().onAuthStateChanged(function (user) {
  if (user) {

      $("#schedule").show();
      $("#sign-in").hide();
      $("#create-user-form").hide();

  } else {

      $("#schedule").hide();
      $("#sign-in").show();
      $("#create-user-form").hide();

  }
});

function signInToggle() {
  if (toggleBoolean) {
      $("#schedule").hide();
      $("#sign-in").show();
      $("#create-user-form").hide();
      toggleBoolean = false;
  } else {
      $("#schedule").hide();
      $("#sign-in").hide();
      $("#create-user-form").show();
      toggleBoolean = true;
  }

}

function createUser() {
  var email = $("#inputEmailCreate").val();
  var password = $("#inputPasswordCreate").val();
  console.log(email, password);
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(errorMessage);
  });
}

function signIn() {
  var passwordSign = $("#inputPassword").val();
  var emailSign = $("#inputEmail").val();
  firebase.auth().signInWithEmailAndPassword(emailSign, passwordSign).catch(function (error) {
      // Handle Errors here.
      var errorCode2 = error.code;
      var errorMessage2 = error.message;
      window.alert(errorMessage2);
  });
}



function logOut() {
  firebase.auth().signOut();
}


$("#user-login").on("click", signIn);
$("#create-user").on("click", signInToggle);
$("#user-create").on("click", createUser);
$("#sign-in-page").on("click", signInToggle);
$("#logout").on("click", logOut);

})