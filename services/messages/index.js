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
        let mess = this.messages.find(function (el, ind) {
            if (el.id === id) {
                messInd = ind;
                return true;
            }
            return false;
        });

        return {mess, messInd};
    }
    findBySender(id) {
        let messInd = false;
        let resieversIDs = [];
        let mess = this.messages.filter(function (el, ind) {
            if (el.senderId === id) {
                resieversIDs.push(el.receiverId);
                return true;
            }
            return false;
        });

        return {mess, resieversIDs};
    }

    add(data) {
        let messagesCount = this.messages.length - 1;
        let lastId = this.messages[messagesCount].id;
        data.id = lastId + 1;
        this.messages.push(data);
        return true;
    }

    delete(id) {
        let {messInd} = this.findOne(id);
        if (messInd) {
            this.messages.splice(messInd, 1);
            return true;
        } else {
            return false;
        }
    }

    update(id, data) {
        let {messInd} = this.findOne(id);
        if (messInd) {
            this.messages[messInd] = Object.assign(this.messages[messInd], data);
            return true;
        } else {
            return false;
        }
    }


}


module.exports = new Messages(messList);
