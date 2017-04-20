import Backbone from "backbone";
import $ from "jquery";

export default Backbone.View.extend({

    initialize() {

        // listen for when the selectedRoom changes in order to appropriately
        // setup and teardown any firebase references/listeners
        this.listenTo(
            this.model,
            "change:selectedRoom",
            this.handleSelectedRoomChange.bind(this) // bind to this just to make sure the context is correct
        );
    },

    /**
     * sets up and tears down any firebase references/listeners
     * - additionally renders the appropriate data into the DOM elements such as:
     * - - room name
     * - - message lists
     * - - etc.
     * @param model
     */
    handleSelectedRoomChange (model) {

        // if a message ref has already been created (i.e., this isn't the first room we've selected)
        // then we need to remove the listeners first
        if (this.messagesRef) {

            // removes all event listeners for this reference
            this.messagesRef.off();
        }

        // get the current selected room from the model
        let selectedRoom = model.get('selectedRoom');

        // if there is a room, then handle it, otherwise we want to show some sort of message
        // telling the user to select a room
        if (selectedRoom) {

            // empty the html stream first
            this.$(".stream").empty();

            // add the class 'with-room' which basically hides the message telling the user to
            // select a room first before they can see/send messages
            this.$el.addClass('with-room');

            // read the name of the room and render it's value
            firebase.database().ref(`rooms/${selectedRoom}`)
                .once('value').then((data) => {
                    let name = data.val().name;
                    this.$(".name").html(`<span>${name}</span>`);
                });

            // create a fireabse reference to the selected rooms messages node
            this.messagesRef = firebase.database().ref(`messages/${selectedRoom}`);

            // setup the listeners for the data at this reference node
            this.messagesRef.on('child_added', this.handleMessageAdded.bind(this));
            this.messagesRef.on('child_removed', this.handleMessageRemoved.bind(this));
            this.messagesRef.on('child_changed', this.handleMessageChanged.bind(this));

        } else {
            this.$el.removeClass('with-room');
        }

    },

    /**
     * creates a jquery element and appends to the the message stream for data provided
     * @param data - firebase data snapshot
     */
    handleMessageAdded (data) {
        let $newMessage = $(`<div class='message' data-key="${data.key}"></div>`)
            .text(data.val().text);
        this.$('.stream').append($newMessage);
    },

    // TODO: handle messages being removed
    handleMessageRemoved (data) {

    },

    // TODO: handle messages being changed
    handleMessageChanged (data) {

    },

    // backbone events hash, simply listens to events and calls the respective function
    events: {
        "keypress textarea": "handleTextareaKeypress"
    },

    /**
     * handles the kepress event and calls sendMessage if the key was an enter
     * @param event - jQuery event
     */
    handleTextareaKeypress (event) {
        //TODO: what if a user actually wants to include a newline in their message
        // Then we need to use something like shift + enter?
        if (event.which === 13 || event.keyCode === 13) {
            this.sendMessage();
        }
    },

    /**
     * Reads the value from the textarea and creates a new message on firebase
     * with the text and some of the current user's information
     */
    sendMessage () {
        let $textarea = this.$('textarea'),
            text = $textarea.val(),
            currentUser = firebase.auth().currentUser;

        // only write the data if there was actually text in the textarea
        if (text) {
            // create a new message ref
            let newMessageRef = this.messagesRef.push(); // push generates a unique key/reference for us

            // then we want to set the data at the returned ref/key
            newMessageRef.set({
                text: text,
                user: {
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL
                },
                lastModified: {
                    '.sv': 'timestamp' // server value for timestamp
                }
            }).then(() => {
                // upon a successful write, we clear the value of the textarea
                $textarea.val("");
            });

            //TODO: probably should handle error conditions
        }
    }
});