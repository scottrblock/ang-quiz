function QuestionCtrl($scope){
    $scope.questions = [
      {text: 'DC Over Everything', possible_authors: ['Wale', 'Doug'], correct_author: 'Wale'},
      {text: 'Just Ship It', possible_authors: ['Wale', 'Doug'], correct_author: 'Doug'}
    ];
    
    //make each question initially incorrect and not tried
    $.each($scope.questions, function(){
      _.defaults(this, {correct: false, tried: false});
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
      if(this.a == question.correct_author && question.tried == false){
        this.question.correct = true;
        this.question.tried = true;
      }
      this.question.tried = true;
      
      $scope.checkIfDone();
      
    };
    
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







