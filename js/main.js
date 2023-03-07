window.onload = function() {
  loadMessages();
}
var userModal = new bootstrap.Modal($(".user-modal"), {
  keyboard: false
})
userModal.show();

var infoModal = new bootstrap.Modal($(".info-modal"));
$(".info-btn").on("click", function() {
  infoModal.show();
});
$(".close-btn").on("click", function() {
  infoModal.hide();
});

$(".user-btn").click(function() {
  if ($(".username").val() == "") {
    $(".modal-body").addClass("was-validated");
  } else {
    $(".message-input").attr("placeholder", `Type as ${$(".username").val()}`);
    $(".user-name").html($(".username").val())
    userModal.hide()
  }
});

function switchMode(check) {
  if (check.checked) {
    $("body").attr("data-bs-theme", "dark")
    $(".check-title").html("Light");

  } else {
    $(".check-title").html("Dark");
    $("body").removeAttr("data-bs-theme")
  }
}


const firebaseConfig = {
  apiKey: "AIzaSyA6Q9R6IeM3V0d7GTLSA5kd_t7k21myiOU",
  authDomain: "qasimchat-41847.firebaseapp.com",
  databaseURL: "https://qasimchat-41847-default-rtdb.firebaseio.com",
  projectId: "qasimchat-41847",
  storageBucket: "qasimchat-41847.appspot.com",
  messagingSenderId: "251244625276",
  appId: "1:251244625276:web:d0911f8c44b839a22b38f9",
  measurementId: "G-V58QP8G6L6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase database reference
var messagesRef = firebase.database().ref('messages');

var chatBox = document.querySelector('.messages');

// Save message to Firebase database
function saveMessage(username, message) {
  var newMessageRef = messagesRef.push();
  newMessageRef.set({
    username: $(".username").val(),
    message: message,
    msgTime: new Date().toLocaleTimeString()
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}
/*
$(".message-input").on("keyup", function(e) {
  if ($(this).val().length > 1) {
    $("form .btn-primary").removeAttr("disabled");
  } else {
    $("form .btn-primary").attr("disabled", "disabled");
  }
})*/


// Load messages from Firebase database

function loadMessages() {
  messagesRef.on('value',
    function(snapshot) {
      chatBox.innerHTML = '';
      snapshot.forEach(function(childSnapshot) {
        var username = childSnapshot.val().username;
        var message = childSnapshot.val().message;
        var time = childSnapshot.val().msgTime;
        var id = childSnapshot.key;
        displayMessage(username, message, time, id);
      });
    });
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Display message on page
function displayMessage(username, message, time, id) {
  var messageElement = document.createElement('div');
  messageElement.setAttribute("class", "w-100 py-2 px-3 rounded shadow-sm my-2 bg-primary text-light");
  if (username == $(".username").val()) {
    messageElement.innerHTML = `<div id="message-${id}" class="d-flex w-100 mb-2 justify-content-between align-items-center"><div class="d-flex align-items-center"><span class="ico h3">account_circle</span><b class="ml-2">${username}</b></div><span data-id="${id}" class="ico" onclick="deleteMessage(this)">delete</span></div>`+`<p class="m-0 p-0 w-100">${message}</p><i>${time}</i>`;
  } else {
    $(messageElement).addClass("bg-info").removeClass("bg-primary");
    messageElement.innerHTML = `<div class="d-flex w-100 mb-2 justify-content-between align-items-center"><div class="d-flex align-items-center"><span class="ico h3 p-0 m-0">account_circle</span><b class="d-block my-0 py-0 ml-2">${username}</b></div></div>`+`<p class="m-0 p-0 w-100">${message}</p><i>${time}</i>`;
  }
  chatBox.appendChild(messageElement);
}

function deleteMessage(b) {
  messagesRef.child($(b).data("id")).remove();
}
messagesRef.on("child_removed", function(snapshot) {
  $(`message-${snapshot.key}`).html("<i>This message was deleted</i>")
})

// Get the chat form element
var chatForm = document.querySelector('form');

// Add a submit event listener to the form
chatForm.addEventListener('submit', function(event) {
  event.preventDefault();
  if ($(".message-input").val() == "") {
    $("form").addClass("was-validated");
  } else {
    saveMessage($(".username").val(), $(".message-input").val());
    chatForm.reset();
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});