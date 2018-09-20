var config = {
  apiKey: "AIzaSyAvndpmViJUKB170JcBskoayb4JHEjEB4o",
  authDomain: "train-scheduler-81205.firebaseapp.com",
  databaseURL: "https://train-scheduler-81205.firebaseio.com",
  projectId: "train-scheduler-81205",
  storageBucket: "train-scheduler-81205.appspot.com",
  messagingSenderId: "142760986941"
};

firebase.initializeApp(config);

var trainDB = firebase.database();

var name = "";
var destination = "";
var frequency = "";
var nextArrival = "";

$("#button").on("click", function () {

  event.preventDefault();

  name = $("#train-name").val().trim();
  destination = $("#train-destination").val().trim();
  nextArrival = $("#train-time").val().trim();
  frequency = $("#train-frequency").val().trim();

  trainDB.ref().push({
    name: name,
    destination: destination,
    frequency: frequency,
    nextArrival: nextArrival,
    timeAdded: firebase.database.ServerValue.TIMESTAMP
  });

  $("input").val("");
  return false;

});

trainDB.ref().on("child_added", function (childSnapshot) {
  // Log everything that's coming out of snapshot
  console.log(childSnapshot.val());
  console.log(childSnapshot.val().name);
  console.log(childSnapshot.val().destination);
  console.log(childSnapshot.val().frequency);
  console.log(childSnapshot.val().nextArrival);
  // Change the HTML to reflect
  $("#name-display").text(childSnapshot.val().name);
  $("#dest-display").text(childSnapshot.val().destination);
  $("#freq-display").text(childSnapshot.val().frequency);
  $("#time-display").text(childSnapshot.val().nextArrival);

  console.log("Name: " + name);
  console.log("Destination: " + destination);
  console.log("Frequency: " + frequency);
  console.log("Time: " + nextArrival);

  var timeFreq = parseInt(frequency);

  currentTime = moment();

  console.log("CURRENT TIME: " + moment().format('HH:mm'));
  //FIRST TIME: PUSHED BACK ONE YEAR TO COME BEFORE CURRENT TIME
  // var dConverted = moment(time,'hh:mm').subtract(1, 'years');
  var dConverted = moment(childSnapshot.val().nextArrival, 'HH:mm').subtract(1, 'years');
  console.log("DATE CONVERTED: " + dConverted);
  var trainTime = moment(dConverted).format('HH:mm');
  console.log("TRAIN TIME : " + trainTime);

  //DIFFERENCE B/T THE TIMES 
  var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
  var tDifference = moment().diff(moment(tConverted), 'minutes');
  console.log("DIFFERENCE IN TIME: " + tDifference);
  //REMAINDER 
  var tRemainder = tDifference % timeFreq;
  console.log("TIME REMAINING: " + tRemainder);
  //MINUTES UNTIL NEXT TRAIN
  var minsAway = timeFreq - tRemainder;
  console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
  //NEXT TRAIN
  var nextTrain = moment().add(minsAway, 'minutes');
  console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
 
  var tr = $('<tr>');
  var a = $('<td>');
  var b = $('<td>');
  var c = $('<td>');
  var d = $('<td>');
  var e = $('<td>');
  a.append(name);
  b.append(destination);
  c.append(frequency);
  d.append(nextArrival);
  e.append(minsAway);
  tr.append(a).append(b).append(c).append(d).append(e);
  $('#table-data').append(tr);

}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

trainDB.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function (snapshot) {
  // Change the HTML to reflect
  $("#name-display").html(snapshot.val().name);
  $("#dest-display").html(snapshot.val().dest);
  $("#freq-display").html(snapshot.val().frequency);
  $("#time-display").html(snapshot.val().nextArrival);
  $("away-display").html(snapshot.val().nextTrain);
});



