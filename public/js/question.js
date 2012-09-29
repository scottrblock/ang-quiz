function QuestionCtrl($scope, $http){
    $scope.types = [
      {val: 'rap', display: 'DC Rap'},
      {val: 'tech', display: 'DC Tech'}
    ]
  
    $scope.questions = [
      {text: 'Ambition is priceless. It\'s something that\'s in your veins.', correct_type: 'rap'},
      {text: 'I feel every day that I can conquer the world, and I have no qualms about that.', correct_type: 'tech'}
    ];
    
    //make each question initially incorrect and not tried
    $.each($scope.questions, function(){
      _.defaults(this, {
        correct: false, 
        tried: false,
        extra: ''
      });
    });
    
    $scope.getCorrectAnswers = function(){
      var count = 0;
      $.each($scope.questions, function(){
        if(this.correct == true){
          count++;
        }
      });
      
      return count;
    };
    
    $scope.checkAnswer = function(){
      var question = this.$parent.question;
      if(this.a.val == question.correct_type && question.tried == false){
        this.question.correct = true;
        this.question.tried = true;
      }
      this.question.tried = true;
      
      $scope.addExtra(this.$parent.$index, question)
      $scope.checkIfDone();
      
    };
    
    $scope.addExtra = function(index, question){
      var content = $($('#extras li').get(index)).html();
      question.extra = content;
    }
    
    $scope.checkIfDone = function(){
      var done = true;
      $.each($scope.questions, function(){
        if(this.tried == false){
          done = false;
        }
      });
      
      if(done){
        twttr.anywhere(function (T) {
          if(T.isConnected()){
            var user = T.currentUser;
            $scope.processUser(user);
          } else {
            T("#twitter-connect-placeholder").connectButton( {
              authComplete: function(user) {
                $scope.processUser(user)
              }
            });

          }
        });   
        $('#result-modal').modal('show');
      }
    
    };
    
    $scope.getPercent = function(a, b){
      return (a/b).toFixed(2) * 100;
    }

    $scope.processUser = function(user){
      console.log("IS NEW USER?");
      console.log($scope.isNewUser(user));
      if($scope.isNewUser(user) == true){
        $scope.saveUser(user);
      } else{
        //print already posted score message
      }
    }
    
    $scope.saveUser = function (user){
         var id = user.data('id');
         var name = user.screenName;
         var img_url = user.profileImageUrl;
         var score = $scope.getPercent($scope.getCorrectAnswers(), $scope.questions.length);
         
         var new_user = {
            id  :   id,
            score:  score,
            name:   name,
            img_url:    img_url
         }
         
         
         $http.post('/user/new', new_user).success(function(data, status){
            console.log('status: ' + status);
            console.log(data);
         });
    }

    $scope.isNewUser = function(user){
      var done_get = false;
      var done_each = false;

      var id = user.data('id');
      var new_user = true;

      $http.get('/user/list.json').success(function(data, status){
        done_get = true;

        _.each(data,i function(user, i){
           console.log(i);
          console.log(data.length);
          console.log("id " + id);
          console.log("new user: " + new_user);
          if(user.id == id){
            new_user = false;
          }

        });

      });


      return new_user;
    }
}







