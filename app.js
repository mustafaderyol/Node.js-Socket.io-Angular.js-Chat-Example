angular.module('chatApplication', ['btford.socket-io']).
    factory('socket', function (socketFactory) {
        var myIoSocket = io.connect('http://192.168.1.54:8081');

        socket = socketFactory({
            ioSocket: myIoSocket
        });

        return socket;
    })
    .controller('messagePush', function ($scope, $rootScope, socket) {

        $scope.chatPanelMessages = [];
        $scope.chatPaneTyping = [];
        $rootScope.message = "";
        $rootScope.toggleEmojiIsShow = false;
        if(!localStorage.username)
        {
            $rootScope.username = prompt("Please enter your name", "");
            localStorage.setItem("username", $rootScope.username);
        }
        else
        {
            $rootScope.username = localStorage.username;
        }

        $rootScope.emojiClickFunc = function (data) {
            $scope.message = $scope.message+" "+data+" ";
            $( "#btn-input" ).focus();
        };

        $rootScope.textAreaSendKeypressFunction = function(event){
            if($scope.message.length>0 && event.which === 13)
            {
                this.pushMessageFunction();
            }

            var data =  {'username':$rootScope.username};
            socket.emit('typing:send',data,function (er) {
                console.log(er);
            });

        };

        $rootScope.dateFormat = function(getDate){
            var d = new Date(getDate);
            var dformat = [
                    d.getDate(),
                    d.getMonth()+1,
                    d.getFullYear()].join('/')+' '+
                [d.getHours(),
                    d.getMinutes()].join(':');
            return dformat;
        };

        $scope.pushMessageFunction = function(){
            $rootScope.message = $scope.message;

            var data =  {'username':$rootScope.username,'message':$rootScope.message,'date': Date()};
            socket.emit('messege:send',data);

            $scope.message = "";
        };

        socket.on('messege:get', function (data) {
            $scope.chatPanelMessages.push(data);

            var ses = new Audio('assets/zil.mp3');
            ses.play();

            $("html, body").animate({ scrollTop: $('.chat')[0].scrollHeight }, "fast");
        });

        socket.on('typing:get', function (data) {
            $('#typing').html(data.username+" yazıyor...");

            setTimeout(function(){
                $('#typing').html("");
            }, 2000);
        });


        $rootScope.isMe = function(deger){
            if(deger == $rootScope.username)
                return true;
            else
                return false;
        };
    });

