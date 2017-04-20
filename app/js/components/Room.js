import Backbone from "backbone";
import $ from 'jquery';

export default Backbone.View.extend({

    initialize() {

        this.listenTo(this.model, "change:selectedRoom", this.handleSelectedRoomChange.bind(this));
    },

    handleSelectedRoomChange (model) {

        if (this.messagesRef) {
            this.messagesRef.off();
        }

        let selectedRoom = model.get('selectedRoom');

        if (selectedRoom) {
            this.$(".stream").empty();

            this.$el.addClass('with-room');

            firebase.database().ref(`rooms/${selectedRoom}`).once('value').then((data) => {
                let name = data.val().name;
                this.$(".name").html(`<span>${name}</span>`);
            });

            this.messagesRef = firebase.database().ref(`messages/${selectedRoom}`);
            this.messagesRef.on('child_added', this.handleMessageAdded.bind(this));
            this.messagesRef.on('child_removed', this.handleMessageRemoved.bind(this));
            this.messagesRef.on('child_changed', this.handleMessageChanged.bind(this));
        } else {
            this.$el.removeClass('with-room');
        }

    },

    handleMessageAdded (data) {
        let $newMessage = $(`<div class='message' data-key="${data.key}"></div>`)
            .text(data.val().text);
        this.$('.stream').append($newMessage);
    },

    handleMessageRemoved (data) {

    },

    handleMessageChanged (data) {

    },

    events: {
        "keypress textarea": "handleTextareaKeypress"
    },

    handleTextareaKeypress (event) {
        if (event.which === 13 || event.keyCode === 13) {
            this.sendMessage();
        }
    },

    sendMessage () {
        let $textarea = this.$('textarea'),
            text = $textarea.val(),
            currentUser = firebase.auth().currentUser;

        if (text) {
            let newMessageRef = this.messagesRef.push();
            newMessageRef.set({
                text: text,
                user: {
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL
                },
                lastModified: {
                    '.sv': 'timestamp'
                }
            }).then(() => {
                $textarea.val("");
            });
        }
    }
});