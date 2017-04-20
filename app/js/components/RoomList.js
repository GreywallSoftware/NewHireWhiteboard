import Backbone from 'backbone';
import $ from 'jquery';

export default Backbone.View.extend({

    initialize() {
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
    },

    onAuthStateChanged (user) {
        if (user) {
            if (this.roomsRef) {
                this.roomsRef.off();
            }

            this.$(".list").empty();

            // setup a firebase ref to all rooms
            this.roomsRef = firebase.database().ref('rooms');

            // setup listeners on the list of rooms
            this.roomsRef.on('child_added', this.handleRoomAdded.bind(this));
            this.roomsRef.on('child_changed', this.handleRoomChanged.bind(this));
            this.roomsRef.on('child_removed', this.handleRoomRemoved.bind(this));
        }
    },

    /**
     * renders a new room item in the list of rooms
     * @param data - firebase snapshot
     */
    handleRoomAdded (data) {
        let $newRoom = $(`<div class='item' data-key='${data.key}'></div>`)
            .append(`<div class='name'>${data.val().name}</div>`);
        this.$(".list").append($newRoom);
    },

    /**
     * removes the room from the list
     * @param data - firebase snapshot
     */
    handleRoomRemoved (data) {
        this.$(`.list > .item[data-key='${data.key}']`).remove();
    },

    /**
     * updates the name of the room
     * @param data
     */
    handleRoomChanged (data) {
        this.$(`.list > .item[data-key='${data.key}']`).text(data.val().name);
    },

    // backbone events hash
    events: {
        "click .create": "handleCreateRoomClick",
        "click .item": "handleItemClick"
    },

    /**
     * creates a new room
     */
    handleCreateRoomClick () {
        // get a new reference
        let newRoomRef = this.roomsRef.push();

        // set the data at the new ref
        // currently just using the timestamp as a room name
        // TODO: provide more advanced functionality for creating rooms
        newRoomRef.set({
            name: "Room " + new Date().getTime()
        });
    },

    /**
     * Selects the target room and sets it as the selectedRoom in the model
     * @param event - jQuery event
     */
    handleItemClick (event) {
        // get the firebase key from the element that was clicked
        let key = event.currentTarget.getAttribute('data-key');

        // find the currently selected room (if it exists) and remove the class 'selected'
        this.$('.item.selected').removeClass('selected');

        // mark this element as selected
        this.$(event.currentTarget).addClass('selected');

        // set the selectedRoom on the model to the value of the key
        this.model.set('selectedRoom', key);
    }
})