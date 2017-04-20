import Backbone from 'backbone';
import $ from 'jquery';

export default Backbone.View.extend({

    initialize() {

        this.roomsRef = firebase.database().ref('rooms');

        this.roomsRef.on('child_added', this.handleRoomAdded.bind(this));
        this.roomsRef.on('child_changed', this.handleRoomChanged.bind(this));
        this.roomsRef.on('child_removed', this.handleRoomRemoved.bind(this));
    },

    handleRoomAdded (data) {
        let $newRoom = $(`<div class='item' data-key='${data.key}'></div>`)
            .append(`<div class='name'>${data.val().name}</div>`);

        this.$(".list").append($newRoom);
    },

    handleRoomRemoved (data) {
        this.$(`.list > .item[data-key='${data.key}']`).remove();
    },

    handleRoomChanged (data) {
        this.$(`.list > .item[data-key='${data.key}']`).text(data.val().name);
    },

    events: {
        "click .create": "handleCreateRoomClick",
        "click .item": "handleItemClick"
    },

    handleCreateRoomClick () {
        let newRoomRef = this.roomsRef.push();
        newRoomRef.set({
            name: "Room " + new Date().getTime()
        });
    },

    handleItemClick (event) {
        let key = event.currentTarget.getAttribute('data-key');
        this.$('.item.selected').removeClass('selected');
        this.$(event.currentTarget).addClass('selected');
        this.model.set('selectedRoom', key);
    }
})