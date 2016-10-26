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
        $rootScope.message = null;
        $rootScope.username = prompt("Please enter your name", "");

        $rootScope.textAreaSendKeypressFunction = function(event){
            if($scope.message.length>0 && event.which === 13)
            {
                this.pushMessageFunction();
            }
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

        $rootScope.isMe = function(deger){
            if(deger == $rootScope.username)
                return true;
            else
                return false;
        };
    });

