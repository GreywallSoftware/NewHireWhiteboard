import Backbone from 'backbone';

import '../../css/index.css';

import LoginPopup from './LoginPopup';
import RoomList from './RoomList';

export default Backbone.View.extend({
    initialize () {
        this.render();
    },

    render() {

        this.loginPopup = new LoginPopup({
            el: ".login-popup"
        });

        this.roomList = new RoomList({
            el: ".rooms"
        });

        return this;
    }
});

