import Backbone from "backbone";
import firebase from "firebase";

let provider = new firebase.auth.GoogleAuthProvider();

export default Backbone.View.extend({
    initialize() {

        firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));

    },

    events: {
        "click .login-button": "_handleLoginButtonClick"
    },

    onAuthStateChanged (user) {
        if (user) {
            //user is logged in
            this.$el.addClass('hide');
        } else {
            //user is not logged in
            console.log('user is not logged in');
            this.$el.removeClass('hide');
        }
    },

    _handleLoginButtonClick(event) {
        let provider = event.currentTarget.getAttribute('data-provider');
        switch(provider) {
            case 'google':
                this.login(new firebase.auth.GoogleAuthProvider());
                break;
        }

    },

    login (provider) {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            debugger;
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            debugger;
        });
    }
})