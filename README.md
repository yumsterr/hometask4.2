# hometask4.2
*Chat backend*


----------
**Install**

npm install
npm start
Server run on localhost:1234

---
# Route user

### /api/users/

 **GET** 
 
- Без параметров (/api/users/) - возвращает список всех пользователей
>[
    {
	        "id": 1,
	        "name": "Tony",
	        "nickname": "Iron man",
	        "email": "ceo@starkind.com"
    },
    {
	        "id": 2,
	        "name": "Steven Rogers",
	        "nickname": "Captain America",
	        "email": "frozen@shield.com"
	    }
	    ...
	]


- С параметром (/api/users/id/) - возвращает конкретного пользователя, если он есть в системе
Пример:
>{
    "id": 2,
    "name": "Steven Rogers",
    "nickname": "Captain America",
    "email": "frozen@shield.com"
}

----------

**POST** 
Принимает параметры нового пользователя:

- name: String
- nickname: String
- email: String

Возвращает объект созданного пользователя, если все поля были заполнены.

Пример:
>{
    "id": 5,
    "name": "Peter Parker ",
    "nickname": "Spider-man",
    "email": "spideyrullez@gmail.com"
}


----------


**PUT**
Обновляет опльзователя с указанным id  (/api/users/id/) и полями которые нужно изменить у пользователя. Если пользователь не найден, статус 400
Пример:
>nickname=Mighty Hulk
>{
    "id": 3,
    "name": "Bruce Banner",
    "nickname": "Mighty Hulk",
    "email": "angry@smash.com"
}


----------

**DELETE**
Удаляет опльзователя с указанным id  (/api/users/id/). В случае если такого пользователя нет - статус 400. Если удаление прошло успешно выводится сообщение "User deleted".

-------------------
 
 
# Route messages

### /api/messages

 **GET** 
 
- Без параметров (/api/messages/) - возвращает список всех сообщений.
Пример:
>[
    {
        "id": 1,
        "senderId": 2,
        "receiverId": 1,
        "date": "",
        "messBody": "Big man in a suit of armor. Take that off, what are you?"
    },
    {
        "id": 2,
        "senderId": 1,
        "receiverId": 2,
        "date": "",
        "messBody": "Uh...genius, billionaire, playboy, philanthropist"
    },
	    ...
	]

- С параметром (/api/messages/id/) - возвращает конкретное сообщение, если оно есть в системе
Пример:
>{
    "id": 3,
    "senderId": 1,
    "receiverId": 3,
    "date": "",
    "messBody": "Dr. Banner, your work is unparalleled. And I'm a huge fan of the way you lose control and turn into an enormous green rage monster..."
}


----------


**POST** 
Принимает параметры нового сообщения:

- senderId: Int
- receiverId: Int
- messBody: String

Возвращает объект сообщения , если все поля были заполнены.

Пример:
>{
    "id": 6,
    "senderId": "1",
    "receiverId": "4",
    "messBody": "Avengers assemble",
    "date": 1500208658207
}


----------


**PUT**
Обновляет сообщение с указанным id  (/api/messages/id/) и полями которые нужно изменить в сообщении. Если сообщение не найдено, статус 400.
Пример:
>messBody=Avengers assemble! Quickly!!!!!

Response
>saved


----------

**DELETE**
Удаляет сообщение с указанным id  (/api/messages/id/). В случае если таког пользователя нет - статус 400. Если удаление прошло успешно выводится сообщение "deleted".

-------------------


# Route receivers

### /api/receivers/

**GET**
- Запрос только с параметром (/api/receivers/id/) - возвращает список всех собеседников юзера
Пример:
>/api/receivers/1/

>[
    {
        "id": 2,
        "name": "Steven Rogers",
        "nickname": "Captain America",
        "email": "frozen@shield.com"
    },
    {
        "id": 3,
        "name": "Bruce Banner",
        "nickname": "Hulk",
        "email": "angry@smash.com"
    },
    {
        "id": 4,
        "name": "Thor",
        "nickname": "Thor",
        "email": "god@loreal.com"
    }
]
