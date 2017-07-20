let authForm = document.querySelector('#authForm');
let chatForm = document.querySelector('#chatForm');
let logout = document.querySelector('#logout');
let loader = document.querySelector('.loader');
let lastUpdateTime;
let userID = getCookie("userID");
let userNick = getCookie("name");
let alUsers = {};


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
        sendData("/api/users", userData, "POST", function (data) {
            if (data._id) {
                let date = new Date;
                date.setDate(date.getDate() + 3);
                userID = data._id;
                userNick = userNickName.value;
                document.cookie = "userID=" + data._id + "; path=/; expires=" + date;
                document.cookie = "name=" + data.nickname + "; path=/; expires=" + date;
                document.querySelector('.my-modal.auth').classList.add('hidden');
                chatUser();
            }
        });
    }
});

chatForm.addEventListener('submit', function (e) {
    "use strict";
    e.preventDefault();
    pauseInterval = true;
    // let userNickName = document.querySelector('input#nickname').value;
    let message = document.querySelector('textarea#message');

    let messageData = {
        userID: userID,
        message: message.value,
        date: lastUpdateTime
        // message: userMessage
    };
    if (message.value) {
        sendData("/api/messages", messageData, "POST", function (data) {
            renderMessages(data, false);
            lastUpdateTime = Date.now();
            document.body.scrollTop = document.body.scrollHeight;

            pauseInterval = false;
            //loadLastMessages(lastUpdateTime);
        });
        message.value = "";
    }
});

let sendData = (path, data, method, callback) => {
    "use strict";
    var myParams = {
        method: method,
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-type': 'application/json'
        },
        mode: 'cors',
    };
    if (data) {
        myParams.body = JSON.stringify(data);
    }
    fetch(path, myParams)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (data) {
                callback(data);
            }
        })
};


let loadLastMessages = (date) => {
    "use strict";
    // loaderToggle('show');
    if (!date) {
        sendData("/api/messages?count=100&userID=" + userID, false, "GET", function (data) {
            renderMessages(data, true);
        });
    } else {
        sendData("/api/messages?date=" + date + "&userID=" + userID, false, "GET", function (data) {
            renderMessages(data, false);
        });
    }
    lastUpdateTime = Date.now();
    loaderToggle('hide');
};

let renderMessages = (data, all) => {
    "use strict";
    let chatBody = document.querySelector('.mess-list');
    let onlineNode = document.querySelector('.online-users .list');

    if (all) {
        chatBody.innerHTML = ""
    }
    let onlineUsers = data.online;
    let messList = data.mess;
    let users = data.user;
    alUsers = Object.assign(alUsers, users);
    for (let ind in messList) {
        let currentMess = messList[ind];
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
            let nick = users[currentMess.userID].nickname;
            if (currentMess.userID === userID) {
                newMess.classList.add('my-mess');
            }
            if (nick.length > 0) {
                author.innerHTML = nick;

                //(@yumster)\b
            }

            else
                author.innerHTML = "No name user (pituh)";
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
    onlineNode.innerHTML = "";
    for (let i in onlineUsers) {
        let onlineUserID = i;
        if (alUsers[i]) {
            let newUser = document.createElement('div');
            // newUser.classList.add('message');
            onlineNode.appendChild(newUser);
            newUser.innerHTML = alUsers[i].name + " - " + alUsers[i].nickname;
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

let pauseInterval = false;

setInterval(function () {
    "use strict";
    if (!pauseInterval) {
        loadLastMessages(lastUpdateTime);
    }
}, 1000);
let loaderToggle = (state) => {
    if (state === 'show') {
        loader.classList.add('active');
    } else if (state === 'hide') {
        loader.classList.remove('active');
    }
};

if (userID !== undefined) {
    chatUser();

} else {
    authUser();
}

loadLastMessages();
