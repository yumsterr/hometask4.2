/**
 * Created by Yumster on 7/16/17.
 */
const messList = [{
    id: 1,
    senderId: 2,
    receiverId: 1,
    date: "",
    messBody: "Big man in a suit of armor. Take that off, what are you?"
}, {
    id: 2,
    senderId: 1,
    receiverId: 2,
    date: "",
    messBody: "Uh...genius, billionaire, playboy, philanthropist"
}, {
    id: 3,
    senderId: 1,
    receiverId: 3,
    date: "",
    messBody: "Dr. Banner, your work is unparalleled. And I'm a huge fan of the way you lose control and turn into an enormous green rage monster..."
}, {
    id: 4,
    senderId: 3,
    receiverId: 1,
    date: "",
    messBody: "Thanks."
}, {
    id: 5,
    senderId: 4,
    receiverId: 1,
    date: "",
    messBody: "Thanks."
}
];

class Messages {
    constructor(messages) {
        this.messages = messages
    }

    find() {
        return this.messages;
    }

    findOne(id) {
        let messInd = false;
        let err = false;
        let mess = this.messages.find(function (el, ind) {
            if (el.id === id) {
                messInd = ind;
                return true;
            }
            return false;
        });
        if (!mess) {
            err = new Error('Message not Found');
            err.status = 400;
        }
        return {mess, messInd, err};
    }

    findBySender(id) {
        let messInd = false;
        let resieversIDs = [];
        let err = false;
        let mess = this.messages.filter(function (el, ind) {
            if (el.senderId === id) {
                resieversIDs.push(el.receiverId);
                return true;
            } else if (el.receiverId === id){
                resieversIDs.push(el.senderId);
                return true;
            }
            return false;
        });
        resieversIDs = Array.from(new Set(resieversIDs));
        if (!resieversIDs.length) {
            err = new Error('Recievers not found');
            err.status = 400;
        }

        return {mess, resieversIDs, err};
    }

    add(data) {
        let err = false;
        if (data.senderId && data.receiverId && data.messBody) {
            let messagesCount = this.messages.length - 1;
            let lastId = this.messages[messagesCount].id;
            let newMessage = {
                id:lastId + 1,
                senderId: data.senderId,
                receiverId: data.receiverId,
                messBody: data.messBody,
                date: Date.now()
            };
            this.messages.push(newMessage);
        } else {
            err = new Error('Wrong data');
            err.status = 400;
        }
        return {err};
    }

    delete(id) {
        let {messInd, err} = this.findOne(id);
        if (messInd) {
            this.messages.splice(messInd, 1);
            return true;
        } else {
            return {err};
        }
    }

    update(id, data) {
        let {messInd, err} = this.findOne(id);
        if (messInd) {
            this.messages[messInd] = Object.assign(this.messages[messInd], data);
            return true;
        } else {
            return {err};
        }
    }


}


module.exports = new Messages(messList);
