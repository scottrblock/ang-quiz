function UserCtrl($scope, $http){
  
  $http.get('/user/list.json').success(function(data, status){
    console.log("data " + data);
    new_users = data;

    sorted_users = _.sortBy(new_users, function(user){
      return (0 - user.score); 
    });
    $scope.users = sorted_users;      
  });
    
}







