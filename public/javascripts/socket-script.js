let authForm = document.querySelector('#authForm');
let chatForm = document.querySelector('#chatForm');
let logout = document.querySelector('#logout');
let loader = document.querySelector('.loader');
let messageField = document.querySelector('textarea#message');
let lastUpdateTime;
let userID = getCookie("userID") || false;
let userNick = getCookie("name");
let allUsers = {};
let onlineUsersList = {};
let query = {};
if(userID){
    query = {
        userID: userID
    };
}
let socket = io.connect({
    query: query
});


let chatUser = () => {
    "use strict";
    chatForm.classList.remove('hidden');
    document.querySelector('.userName').innerHTML = getCookie("name");
};

let authUser = () => {
    "use strict";
    document.querySelector('.my-modal.auth').classList.remove('hidden');
};

logout.addEventListener('click', function () {
    "use strict";
    if (userID) {
        deleteCookie("userID");
        deleteCookie("name");
    }
    // chatForm.classList.add('hidden');
    socket.emit('userLeftUs', userID);
    document.querySelector('.my-modal.auth').classList.remove('hidden');

});

authForm.addEventListener('submit', function (e) {
    "use strict";
    e.preventDefault();

    let userName = document.querySelector('input#name');
    let userNickName = document.querySelector('input#nickname');
    // let userMessage = document.querySelector('textarea#message').value;
    let userData = {
        name: userName.value,
        nickname: userNickName.value,
        // message: userMessage
    };
    let error = false;
    if (!userName.value) {
        userName.classList.add('invalid');
        error = true;
    } else {
        userName.classList.remove('invalid');
    }
    if (!userNickName.value) {
        userNickName.classList.add('invalid');
        error = true;
    } else {
        userNickName.classList.remove('invalid');
    }
    if (!error) {
        socket.emit('saveUser', userData);
    }


});

messageField.addEventListener('keypress', function () {
    "use strict";
    socket.emit('userTyping', userID);
});
//
chatForm.addEventListener('submit', function (e) {
    "use strict";
    e.preventDefault();

    let message = document.querySelector('textarea#message');

    let messageData = {
        userID: userID,
        message: message.value
        // message: userMessage
    };
    if (message.value) {
        socket.emit('message', messageData);
    }

    message.value = "";
});


let renderMessages = (messages, all) => {
    "use strict";
    let chatBody = document.querySelector('.mess-list');

    if (all) {
        chatBody.innerHTML = ""
    }

    // let onlineUsers = data.online;
    // let users = data.user;

    for (let ind in messages) {
        let currentMess = messages[ind];
        let newMess = document.createElement('div');
        newMess.classList.add('message');
        chatBody.appendChild(newMess);

        let author = document.createElement('div');
        let date = document.createElement('div');
        let text = document.createElement('p');

        author.classList.add('author');
        date.classList.add('date');
        text.classList.add('text');

        newMess.appendChild(author);
        newMess.appendChild(date);
        newMess.appendChild(text);

        if (currentMess.userID) {

            if (currentMess.userID === userID) {
                newMess.classList.add('my-mess');
            }
            if (allUsers[currentMess.userID]) {
                let nick = allUsers[currentMess.userID].nickname;
                if (nick.length > 0) {
                    author.innerHTML = nick;
                    //(@yumster)\b
                }
                else
                    author.innerHTML = "No name user (pituh)";
            }
        }
        if (currentMess.dateCreated) {
            let dateFormat = new Date(currentMess.dateCreated);
            date.innerHTML = dateFormat.toLocaleDateString() + ' ' + dateFormat.toLocaleTimeString();
        }
        if (currentMess.text) {
            text.innerHTML = currentMess.text;

            let regExp = new RegExp('@' + userNick + '\\b', 'ig');
            let direct = currentMess.text.match(regExp);
            if (direct) {
                newMess.classList.add('direct');
            }
        }

        //dateFormat.toLocaleDateString() + ' ' + dateFormat.toLocaleTimeString();
        // newMess
    }
    if (all) {
        document.body.scrollTop = document.body.scrollHeight;
    }
};

let onlineUsers = (users) => {
    "use strict";
    // console.log(users);
    let onlineNode = document.querySelector('.online-users .list');
    onlineNode.innerHTML = "";
    for (let i in users) {
        let onlineUserID = i;
        if (allUsers[i]) {
            let newUser = document.createElement('div');
            newUser.setAttribute('data-id', onlineUserID);
            onlineNode.appendChild(newUser);
            newUser.innerHTML = allUsers[i].name + " - " + allUsers[i].nickname;
            if(allUsers[i].status == 'new'){
                newUser.classList.add('new');
            }
        }
    }
};

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    })
}

function setCookie(name, value, options) {
    options = options || {};

    let expires = options.expires;

    if (typeof expires === "number" && expires) {
        let d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + "=" + value;

    for (let propName in options) {
        updatedCookie += "; " + propName;
        let propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

socket.on('setUserData', function (data) {
    data = JSON.parse(data);
    if (data._id) {
        let date = new Date;
        date.setDate(date.getDate() + 3);
        userID = data._id;
        userNick = data.nickname;
        document.cookie = "userID=" + data._id + "; path=/; expires=" + date;
        document.cookie = "name=" + data.nickname + "; path=/; expires=" + date;
        document.querySelector('.my-modal.auth').classList.add('hidden');
        allUsers[data._id] = data;
        onlineUsersList[data._id] = data;
        onlineUsers(onlineUsersList);
        chatUser();
    }
});
socket.on('addMessage', function (data) {
    data = JSON.parse(data);
    let messList = {};
    messList[data._id] = data;
    let userID = data.userID;
    if (!allUsers[userID]) {
        socket.emit('getUserInfo', userID);
    }
    renderMessages(messList, false);

});


socket.on('showHistory', function (data) {
    "use strict";
    let mess = data.mess;
    if (data.users)
        allUsers = Object.assign(allUsers, data.users);
    
    renderMessages(mess, true);
});

socket.on('setUsersOnline', function (data) {
    "use strict";
    data = JSON.parse(data);
    allUsers = Object.assign(allUsers, data);
    onlineUsers(data);
});

socket.on('tellAboutLeaving', function (data) {
    "use strict";

    data = JSON.parse(data);
    let offline = document.querySelector('.offline');
    offline.classList.add('active');
    offline.querySelector('p.userName').innerHTML = data.userName;
    setTimeout(function(){
        offline.classList.remove('active');
    }, 3000);
});



socket.on('userTyping', function (data) {
    "use strict";
    data = JSON.parse(data);

    let typingUser = document.querySelector('[data-id="' + data.userID + '"');
    if (typingUser) {
        if (!typingUser.classList.contains('typing')) {
            typingUser.classList.add('typing');
        }
        clearTimeout(typingUser.systemTimeout);
        typingUser.systemTimeout = setTimeout(() => {
            typingUser.classList.remove('typing');
        }, 2000);
    } else {
        socket.emit('getUserInfo', data.userID);
    }
});

socket.emit('getUsersOnline');

socket.emit('history');

window.onbeforeunload = function () {
    console.log('userLeftUs');
    socket.emit('userLeftUs', userID);
};
let loaderToggle = (state) => {
    if (state === 'show') {
        loader.classList.add('active');
    } else if (state === 'hide') {
        loader.classList.remove('active');
    }
};

if (userID) {
    chatUser();

} else {
    authUser();
}

// loadLastMessages();
loaderToggle('hide');
