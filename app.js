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

        $scope.pushMessageFunction = function(){
            $rootScope.message = $scope.message;

            // $rootScope.chatPanelMessages.push({'username':$rootScope.username,'message':$rootScope.message,'date': Date()});

            var data =  {'username':$rootScope.username,'message':$rootScope.message,'date': Date()};
            socket.emit('gonder',data);

            $scope.message = "";
        };

        socket.on('alici', function (data) {
            $scope.chatPanelMessages.push(data);
        });

        $rootScope.isMe = function(deger){
            if(deger == $rootScope.username)
                return true;
            else
                return false;
        };
    });

