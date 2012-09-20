function UserCtrl($scope, $http){

  $scope.users = function(){
    var users = [];
    $http.get('/user/list.json').success(function(data, status){
      new_users = data;
      sorted_users = _.sortBy(new_users, function(user){
        return (0 - user.score); 
      });
      
      users = sorted_users
    });

    return sorted_users;
  }
   
}







