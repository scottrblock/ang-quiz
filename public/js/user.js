function UserCtrl($scope, $http){
  
  $scope.users = function(){
    var users = [];
    $http.get('/user/list.json').success(function(data, status){
      users = data;
      sorted_users = _.sortBy(users, function(user){
        return (0 - user.score); 
      });
      
      return sorted_users;
    });

  }
   
}







