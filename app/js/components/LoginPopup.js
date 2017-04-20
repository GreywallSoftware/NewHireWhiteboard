import Backbone from "backbone";
import firebase from "firebase";

let provider = new firebase.auth.GoogleAuthProvider();

export default Backbone.View.extend({

    initialize() {

        // start listening for any auth state changes
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));

    },

    //backbone events hash
    events: {
        "click .login-button": "_handleLoginButtonClick"
    },

    /**
     * handles auth state changes
     * @param user - firebase user object
     */
    onAuthStateChanged (user) {
        if (user) {
            //user is logged in, so hide the login-popup
            this.$el.addClass('hide');
        } else {
            //user is not logged in, so show the login-popup
            this.$el.removeClass('hide');
        }
    },

    /**
     * Handles login click by passing a firebase provider to the login method
     * @param event - jQuery event
     * @private
     */
    _handleLoginButtonClick(event) {
        let provider = event.currentTarget.getAttribute('data-provider');

        // currently we only have on provider
        // TODO: handle multiple providers (i.e., facebook)
        switch (provider) {
            case 'google':
                this.login(new firebase.auth.GoogleAuthProvider());
                break;
        }
    },

    /**
     * calls firebase's siginInWithPopup with a passed in provider
     * @param provider - firebase auth provider
     */
    login (provider) {

        firebase.auth().signInWithPopup(provider)
            // successful login
            .then(function (result) {
                let user = result.user; // the user that's logged in

                // write some data to a "public" profile object
                firebase.database().ref(`profiles/${user.uid}`).set({
                    name: user.displayName,
                    photoURL: user.photoURL
                });

            })
            // handle errors
            .catch(function (error) {
                // TODO: actually handle the errors
            });
    }
})