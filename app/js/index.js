import firebase from 'firebase';
import $ from 'jquery';

import NewHireWhiteboard from './components/NewHireWhiteboard';

const config = {
    apiKey: "AIzaSyA5BpNxkSG-XhK8Xl8cAH2-0qXQlaesPZU",
    authDomain: "newhirewhiteboard.firebaseapp.com",
    databaseURL: "https://newhirewhiteboard.firebaseio.com",
    projectId: "newhirewhiteboard",
    storageBucket: "newhirewhiteboard.appspot.com",
    messagingSenderId: "508532934852"
};

function initializeApp() {

    window.firebase = firebase.initializeApp(config); // initialize firebase

    // start the application on the element
    new NewHireWhiteboard({
        el: $(".new-hire-whiteboard")
    });
}

initializeApp();