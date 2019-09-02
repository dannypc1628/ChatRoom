//"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

var app = new Vue({
    el: '#chatPage',
    data: {
        name: "",
        message: "",
        groupName:"",
        status:0,
        messageList: [],
        groupMessageList:[]
    },
    methods: {
        login: function () {
            console.log("按下login");
            
            connection
                .invoke("Login", this.name)
                .then(() => {
                    this.status = 1
                    //接收訊息
                    connection.on("收到訊息", (user, message) => {
                        if (app.status == 1)
                            pushMessageList(user, message);
                    });
                    connection.on("進入大廳事件", (user, message) => pushMessageList(user, message));
                })
                .catch(function (err) {
                    return console.error(err.toString());
                });

        },
        send: function () {
            
            console.log("按下送出訊息");
            connection
                .invoke("SendMessage", this.name, this.message)
                .then(() => {
                    this.message = "";
                })
                .catch(function (err) {
                    return console.error(err.toString());
                });
            
        },
        goRoom: function () {
            console.log("按下進入聊天室");
            connection
                .invoke("AddToGroup", this.groupName)
                .then(() => {
                    app.messageList.length = 0;
                })
                .catch(function (err) {
                    return console.error(err.toString());
                });
        }
        
    }

    
});


//Disable send button until connection is established
//document.getElementById("sendButton").disabled = true;

connection.start()
    .then(function () {
        console.log("連線到伺服器");
        //document.getElementById("sendButton").disabled = false;
    })
    .catch(function (err) {
        return console.error(err.toString());
    })




function setList (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " 說 " + msg;
    ;
    var li = document.createElement("li");

    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
}
function pushMessageList(user, message) {
    console.log("觸發pushMessageList")
    app.messageList.push({
        'user': user,
        'message': message
    })
}


//送出訊息
document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    console.log("按下送出訊息");
    connection
        .invoke("SendMessage", user, message)
        .catch(function (err) {
            return console.error(err.toString());
        });
    event.preventDefault();
});

