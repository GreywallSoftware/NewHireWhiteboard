import Backbone from 'backbone';

import '../../css/index.css';

import LoginPopup from './LoginPopup';
import RoomList from './RoomList';
import Room from './Room';

export default Backbone.View.extend({
    initialize () {
        this.model = new Backbone.Model();

        this.render();
    },

    render() {

        this.loginPopup = new LoginPopup({
            el: ".login-popup"
        });

        this.roomList = new RoomList({
            el: ".rooms",
            model: this.model
        });

        this.room = new Room({
            el: ".room",
            model: this.model
        });

        return this;
    }
});

