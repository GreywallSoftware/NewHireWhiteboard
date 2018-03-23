import Backbone from 'backbone';
import moment from 'moment';
import '../../css/index.css';

import LoginPopup from './LoginPopup';
import RoomList from './RoomList';
import Room from './Room';

// TODO: show the currently logged in user somewhere
// TODO: add logout functionality

export default Backbone.View.extend({
    initialize () {
        // create a new basic empty model which controls the "state"
        // of the application. It's currently only being used for
        // maintaining which rooms is currently selected
        this.model = new Backbone.Model();

        // create a new view to manage the login popup functionality
        this.loginPopup = new LoginPopup({
            el: ".login-popup"
        });

        // create a new view to manage the room list functionality
        this.roomList = new RoomList({
            el: ".rooms",
            model: this.model
        });

        // create a new view to manage the room functionality
        this.room = new Room({
            el: ".room",
            model: this.model
        });
    }
});

