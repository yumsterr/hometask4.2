/**
 * Created by Yumster on 7/16/17.
 */
const userList = [{
    id: 1,
    name: "Tony",
    nickname: "Iron man",
    email: "ceo@starkind.com"
}, {
    id: 2,
    name: "Steven Rogers",
    nickname: "Captain America",
    email: "frozen@shield.com"
}, {
    id: 3,
    name: "Bruce Banner",
    nickname: "Hulk",
    email: "angry@smash.com"
}, {
    id: 4,
    name: "Thor",
    nickname: "Thor",
    email: "god@loreal.com"
},
];

class User {
    constructor(users) {
        this.users = users
    }

    find() {
        return this.users;
    }

    findOne(id) {
        let userInd = false;
        let err = false;
        let user = this.users.find(function (el, ind) {
            if (el.id === id) {
                userInd = ind;
                return true;
            }
            return false;
        });
        if (!user) {
            err = new Error('User not Found');
            err.status = 400;
        }
        return {user, userInd, err};
    }

    add(data) {
        let err = false;
        if (data.name && data.nickname && data.email) {
            let usersCount = this.users.length - 1;
            let lastId = this.users[usersCount].id;
            let newUser = {
                id: lastId + 1,
                name: data.name,
                nickname: data.nickname,
                email: data.email,
            };
            this.users.push(newUser);
        } else {
            err = new Error('Wrong data');
            err.status = 400;
        }
        return {err};
    }

    delete(id) {
        let {userInd, err} = this.findOne(id);
        if (userInd) {
            this.users.splice(userInd, 1);
            return true;
        } else {
            return {err};
        }
    }

    update(id, data) {
        let {userInd, err} = this.findOne(id);
        if (userInd) {
            this.users[userInd] = Object.assign(this.users[userInd], data);
            let user = this.users[userInd];
            return {user};
        } else {
            return {err};
        }
    }


}


module.exports = new User(userList);