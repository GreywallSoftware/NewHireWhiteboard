import Backbone from 'backbone';
import $ from 'jquery';

export default Backbone.View.extend({

    initialize() {
        // bind a listener to firebase auth state changed event
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
    },

    /**
     * Populates the rooms list when a user is logged in
     * @param user - firebase user
     */
    onAuthStateChanged (user) {
        // if there's a user then we can setup the listeners
        if (user) {
            // if there's already a ref (shouldn't be), then clear all listeners
            if (this.roomsRef) {
                this.roomsRef.off();
            }

            // empty the rooms list
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
            .append(`<div title="${data.val().name}" class='name'>${data.val().name}</div>`)
            .append(`<div class='edit' data-key='${data.key}'>edit</div>`);
            
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
        this.$(`.list > .item[data-key='${data.key}'] > .name` ).text(data.val().name);
        this.model.trigger('change:selectedRoom', this.model);
    },

    // backbone events hash
    events: {
        "click .create": "handleCreateRoomClick",
        "click .item": "handleItemClick",
        "keypress .roomUpdateContainer > input": "handleRoomNameInputKeypress",
        "click .edit": "updateItemClick",
        "click .cancel": "showAllItems"
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

        //reset all the items visibility
        this.showAllItems(event);

        // find the currently selected room (if it exists) and remove the class 'selected'
        this.$('.item.selected').removeClass('selected');

        // mark this element as selected
        this.$(event.currentTarget).addClass('selected');

        // set the selectedRoom on the model to the value of the key
        this.model.set('selectedRoom', key);
    },

    updateItemClick(event){
        event.stopPropagation();
        this.showAllItems(event);
        let key = event.currentTarget.getAttribute('data-key');
        let $editItem = this.$(`.list > .item[data-key='${key}']`);
        let $roomUpdateContainer = this.$(`.roomUpdateContainer`).removeClass('hide');
        let $roomNameInput = this.$(`.roomUpdateContainer > input`).attr('data-key', key);
        firebase.database().ref(`rooms/${key}`).once('value').
            then((data) => {
            let name = data.val().name;
            $roomNameInput.val(name);
            $editItem.addClass('hide');
            $editItem.after($roomUpdateContainer);
        });
    },

    handleRoomNameInputKeypress (event) {
        //TODO: what if a user actually wants to include a newline in their message
        // Then we need to use something like shift + enter?
        if (event.which === 13 || event.keyCode === 13) {
            this.updateRoomName(event);
        }
    }, 

    updateRoomName (event){
        let $roomNameInput = this.$(`.roomUpdateContainer > input`);
        let key = event.currentTarget.getAttribute('data-key');
        if($roomNameInput.val()){
            firebase.database().ref(`rooms/${key}`).set({
                name: $roomNameInput.val()
            });
        }
        this.$(`.roomUpdateContainer`).addClass('hide');
        this.$(`.list > .item[data-key='${key}']`).removeClass('hide');
    },

    showAllItems(){
        this.$(`.list > .item`).removeClass('hide');
        this.$(`.roomUpdateContainer`).addClass('hide')
    },

})