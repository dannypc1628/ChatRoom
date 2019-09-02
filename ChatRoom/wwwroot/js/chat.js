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
            if (this.name.length == 0)
                return;

            connection
                .invoke("Login", this.name)
                .then(() => {
                    this.status = 1
                    //接收訊息
                    
                })
                .catch(function (err) {
                    return console.error(err.toString());
                });

        },
        send: function () {
            
            console.log("按下送出訊息");
            if (this.message.length == 0 )
                return;
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


connection.start()
    .then(function () {
        console.log("連線到伺服器");
        //document.getElementById("sendButton").disabled = false;
    })
    .catch(function (err) {
        return console.error(err.toString());
    })
connection.on("收到訊息", (user, message,time) => {
    if (app.status == 1)
        pushMessageList(user, message,time);
});
connection.on("進入大廳事件", (user, message,time) => pushMessageList(user, message,time));


function pushMessageList(user, message,time) {
    console.log("觸發pushMessageList")
    app.messageList.push({
        'user': user,
        'message': message,
        'time':time
    })
}

