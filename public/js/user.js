function UserCtrl($scope, $http){

  $scope.users = function(){
    console.log("hi");
    var users = [];
    $http.get('/user/list.json').success(function(data, status){
      console.log("data " + data);
      new_users = data;
      console.log("new_users " + new_users);

      sorted_users = _.sortBy(new_users, function(user){
        return (0 - user.score); 
      });
      console.log("sorted_users " + sorted_users);
      
      users = sorted_users;
    });
    console.log(users);
    console.log("hello");
    return users;
  }
   
}







