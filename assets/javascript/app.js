var game = {
    // get question list from external JS file
    questions: getQuestions(),
    currentQuestionIndex: 0,
    incorrectAnswers: 0,
    correctAnswers: 0,
    // 30 second timer on each question
    timePerQuestion: 3000,
    // Time to display correct answer details
    answerSummaryTime: 2000,
    // handle for the timeout functions
    questionTimeoutHandle: undefined,
    clockTickHandle: undefined,
    startGame: function () {
        this.showQuestion(this.currentQuestionIndex);

    },
    showQuestion: function (questionIndex) {
        this.currentQuestionIndex = questionIndex;
        // Start timer for each question displayed
        screenHandler.displayQuestionDetails(this.questions[questionIndex]);
        this.questionTimeoutHandle = setTimeout(function () {
            // No answer selected on timeout
            game.evaluateAnswer();
        }, this.timePerQuestion);


    },
    evaluateAnswer: function (answerId) {
        console.log("Showing answer summary");
        // remove click functions from answers
        screenHandler.disableAnswerSelection();
        // remove timeout if user selects answer
        clearTimeout(this.questionTimeoutHandle);

        var currentQuestion = this.questions[this.currentQuestionIndex];

        // Update correct/incorrect count for game summary
        if (answerId && currentQuestion.answers[answerId].isCorrectAnswer) {
            this.correctAnswers++;
        } else {
            // No answer selected - question timeout
            this.incorrectAnswers++;
        }

        // Get index of correct answer for the current question
        var correctAnswerId = currentQuestion.answers.findIndex(ans => ans.isCorrectAnswer);
        console.log("Correct answer: " + correctAnswerId);
        screenHandler.displayAnswerSummary(Number(answerId), correctAnswerId);
        this.currentTimeoutHandle = setTimeout(function () {
            game.nextQuestion();
        }, this.answerSummaryTime);
    },
    nextQuestion: function () {
        console.log("On to next question");
        this.currentQuestionIndex++;
        // If questions remain, continue game
        if (this.currentQuestionIndex < this.questions.length) {
            this.showQuestion(this.currentQuestionIndex);
        } else {
            // End game and show the summary
            this.showGameSummary();
        }
    },
    showGameSummary: function () {
        console.log("Showing game summary");
        screenHandler.displayGameSummary();
    },
    reset: function(){
        screenHandler.resetGame();
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.questions = getQuestions();
        this.currentQuestionIndex = 0;
        console.log("Restting game");
        this.startGame();


    }
}

var screenHandler = {
    answerOrder: ["A", "B", "C", "D"],
    displayQuestionDetails: function (question) {
        // Display question text
        $(".question-text").text(question.questionText);
        // Clear answers from previous questions
        var answerDiv = $(".answers").empty();
        // Display each answer
        for (var i = 0; i < question.answers.length; i++) {
            // Format answer as "A.) Answer Text"
            var answerText = `${this.answerOrder[i]}.) ${question.answers[i].answerText}`;
            // Add data attribute to track answer number
            var answerChoice = $("<div>").text(answerText).addClass("answer-choice").attr("data-answer", i);
            answerChoice.on("click", this.answerClicked);
            answerDiv.append(answerChoice);
        }
    },
    answerClicked: function () {
        // check answer ID against current question
        var answerId = $(this).attr("data-answer");
        game.evaluateAnswer(answerId);
    },
    displayAnswerSummary: function (selectedId, correctId) {
        if (selectedId !== correctId) {
            // Highlight incorrect answer
            $(`.answer-choice[data-answer="${selectedId}"`).addClass("incorrect-answer");
        }
        // Highlight correct answer
        $(`.answer-choice[data-answer="${correctId}"`).addClass("correct-answer");
    },
    disableAnswerSelection: function () {
        $(".answer-choice").off("click");
    },
    displayGameSummary: function() {
        $(".answers").empty();
        $(".question-text").empty();
        // Show screen overlay with game results
        $("#correct").text(game.correctAnswers);
        $("#incorrect").text(game.incorrectAnswers);
        // Calculate percentage score
        var score = (game.correctAnswers / game.questions.length) * 100;
        $("#score").text(score);
        $("#summary-modal").show();

        // bind click events to play again button
        $("#play-again").on("click", function() {
            game.reset();
        });
    },
    resetGame: function() {
        $("#summary-modal").hide();
        $("#play-again").off("click");        
    }
}


console.log(game.questions);
game.startGame();





