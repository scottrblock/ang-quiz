function QuestionCtrl($scope){
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
        $('#result-modal').modal('show');
      }
    
    };
    
    $scope.getPercent = function(a, b){
      return (a/b).toFixed(2) * 100;
    }
}







