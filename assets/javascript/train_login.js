// Initialize Firebase
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

// create vars
var trainName = "";
var destination = "";
var firstTime = "";
var intervalTime = "";
var nextTrain = "";
var minutesAway = "";
var rowCount = 0;
var toggleBoolean = false;
console.log("anything");

$("#submit").click(function (event) {
    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTime = $("#first-time").val().trim();
    intervalTime = $("#frequency").val().trim();

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    var remainder = diffTime % intervalTime;

    minutesAway = intervalTime - remainder;

    nextTrain = moment().add(minutesAway, "minutes");
    console.log(trainName, destination, intervalTime, nextTrain, minutesAway);

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTime: firstTime,
        frequency: intervalTime,
        nextTrain: nextTrain.format("hh:mm"),
        minutesAway: minutesAway.toString(),
        row: rowCount
    });

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-time").val("");
    $("#frequency").val("");
});

database.ref().on("child_added", function (snapshot) {
    var thisTrainName = snapshot.val().trainName;
    var thisDestination = snapshot.val().destination;
    var thisFrequency = snapshot.val().frequency;
    var thisUpcomingTime = snapshot.val().nextTrain;
    var thisMinutesAway = snapshot.val().minutesAway;

    var newRow = $("<tr>").append(
        $("<td>").text(thisTrainName),
        $("<td>").text(thisDestination),
        $("<td>").text(thisFrequency),
        $(`<td id='next-train${rowCount}'>`).text(thisUpcomingTime),
        $(`<td id='minutes-away${rowCount}'>`).text(thisMinutesAway)
    )
    newRow.addClass("table-row");
    newRow.attr("row-number", rowCount);

    $("#train-table-body").prepend(newRow);
    rowCount++;

});

// to update each minute: loop through each existing row and update to current time
// need data from the database
// need to access each row's 4th and 5th elements
// use a value change, change the data in the database and use that to trigger the update to the page
// this was a fucking challenge :)
var updateInterval = setInterval(updateTime, 60000);

function updateTime() {
    var query = firebase.database().ref().orderByKey();
    query.once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var thisFirstTime = childSnapshot.val().firstTime;
                var thisFrequency = childSnapshot.val().frequency;
                // var thisFirstConverted = moment(thisFirstTime, "HH:mm").subtract(1, "years");
                var thisDiffTime = moment().diff(moment(thisFirstTime, "HH:mm").subtract(1, "years"), "minutes");
                // console.log(thisFirstTime, thisFrequency, thisDiffTime);
                var thisRemainder = thisDiffTime % thisFrequency;
                var newMinutes = thisFrequency - thisRemainder;
                var newTime = moment().add(newMinutes, "minutes").format("hh:mm");
                var key = childSnapshot.key;
                database.ref(key).update({
                    nextTrain: newTime,
                    minutesAway: newMinutes,
                });
                var thisRow = childSnapshot.val().row;
                var idNameNext = "next-train" + thisRow;
                var idNameMinutes = "minutes-away" + thisRow;
                $("#" + idNameNext).text(newTime);
                $("#" + idNameMinutes).text(newMinutes);
            });
        });
}

// login tutorial 
// https://www.youtube.com/watch?v=iKlWaUszxB4

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

function googleLogin() {
    var googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(googleProvider);
}

function githubLogin() {
    var githubProvider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithRedirect(githubProvider);
    // firebase.auth().getRedirectResult().then(function (result) {
    //     if (result.credential) {
    //         // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    //         var token = result.credential.accessToken;
    //         // ...
    //     }
    //     // The signed-in user info.
    //     var user = result.user;
    // }).catch(function (error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     // The email of the user's account used.
    //     var email = error.email;
    //     // The firebase.auth.AuthCredential type that was used.
    //     var credential = error.credential;
    //     // ...
    // });
}

function logOut() {
    firebase.auth().signOut();
}


$("#user-login").on("click", signIn);
$("#create-user").on("click", signInToggle);
$("#user-create").on("click", createUser);
$("#sign-in-page").on("click", signInToggle);
$("#logout").on("click", logOut);
$("#google-login").on("click", googleLogin);
$("#github-login").on("click", githubLogin);