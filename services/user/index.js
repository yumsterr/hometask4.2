/**
 * Created by Yumster on 7/16/17.
 */
var UserS = require('./../../models/user').User;
var mongoose = require('./../../lib/mongoose');
var objID = mongoose.Types;


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

    findOne(ID, callback) {
        let userInd = false;
        let err = false;
        let users = UserS.findOne({_id: objID.ObjectId(ID)});
        users.exec(function (err, users) {
            if (err) throw err;
            let data = [];
            for(let prop in users) {
                data[users[prop]['_id']] = users[prop];
            }
            callback(err, Object.assign({}, data));
        });
    }

    findByID(IDs, callback){
        let err = false;
        // console.log(Object.assign({}, IDs));
        let obj_ids = IDs.map(function(id) { if(id.length>0){return objID.ObjectId(id)} });
        let users = UserS.find({_id: {$in: obj_ids}});
        users.exec(function (err, users) {
            if (err) throw err;
            let data = [];
            for(let prop in users) {
                data[users[prop]['_id']] = users[prop];
            }
            callback(err, Object.assign({}, data));
        });
    }

    add(data, userData) {
        let err = false;
        let userId;
        var newUser = new UserS({
            nickname: data.nickname,
            name: data.name
        });
        newUser.save(function (err, user, affected) {
            if(err) throw err;
            // userId = {id: user._id};
            userData(err, JSON.stringify(user));
        });

        //id = newUser._id;
        // let newUser = {};
        // if (data.name && data.nickname && data.email) {
        //     let usersCount = this.users.length - 1;
        //     let lastId = this.users[usersCount].id;
        //     newUser = {
        //         id: lastId + 1,
        //         name: data.name,
        //         nickname: data.nickname,
        //         email: data.email,
        //     };
        //     this.users.push(newUser);
        // } else {
        //     err = new Error('Wrong data');
        //     err.status = 400;
        // }
    }

    checkUserStatus(users){
        for (let i in users){
            if((Date.now() - users[i].wasActive) > 300000){
                delete users[i];
            }
        }
        return users;
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