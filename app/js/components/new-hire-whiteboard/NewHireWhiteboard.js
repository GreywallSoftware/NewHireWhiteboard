import Backbone from 'backbone';
import firebase from 'firebase';
import $ from 'jquery';

import '../../../css/index.css';

import LoginPopup from '../login/LoginPopup';

export default Backbone.View.extend({
    initialize () {
        this.render();
    },

    render() {

        this.loginPopup = new LoginPopup({
            el: ".login-popup"
        });

        return this;
    }
});

