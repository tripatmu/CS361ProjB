$(()=>{
   // bindButtons();
   search();
    
});

function search() {
    daURL = "http://localhost:3000/getquestions";
//	$("#results-template").fadeOut(1000);
		$("#results-template").html("");
		$("#results-template").text("");

    $.ajax({
	type: "GET",
	url: daURL,
    }).done((data)=>{
	var response = JSON.parse(data);
	showQuestion(response);
    });

}


function shuffle(a) {
    var currentIndex = a.length;
    var tempVal, randomIndex;

    while(0 != currentIndex) {
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -=1;
	tempVal = a[currentIndex];
	a[currentIndex] = a[randomIndex];
	a[randomIndex] = tempVal;
    }
    return a;

}

function showQuestion(results) {
    var template = "";
    var a = results.data[0];
    var correct = a.answer;

    var questions = [];
    questions.push(a.answer, a.incorrect_1, a.incorrect_2, a.incorrect_3);
    questions = shuffle(questions);
    if(a) {
	for(i = 0; i < questions.length; i++) {
	template += '<div class="q btn-lg"><dl>' +
	    '<dt class="answer">' + questions[i] + '</dt></br></div>';
	}
    }
    
    $('#results-template').parent().removeClass("hidden").fadeIn(500);
    $('#results-template').append(template);
    $('dt').each((index, record)=>{
	console.log($(record).text() + ' vs ' + correct);
	if($(record).text() == correct)
	$(record).parent().data('foo', a.id);
    });
    $(".q, .btn-lg").on("click", (event)=>{
	checkAnswer(event, a.id);
    });
}

function checkAnswer(event, id) {
    var corr = ($(event.target).parent().data('foo') > 0 ? 1 : 0);
    showCorrect(corr);
   // var q = { 'id' : id,
//	      'correct' : corr
//	    }
    daURL = "http://localhost:3000/checkanswer?id=" + id + "&correct=" + corr;
    $.ajax({
	type: "GET",
	url: daURL,
    }).done((data)=>{
	search();
    });

}

function showCorrect(corr) {

    $("#results-template").fadeOut(500).html("");
    $("#results-template").text("");
    var display = (corr ? "CORRECT!! Nice Job" : "INCORRECT! Better luck next time!");
    var template = '<div><h1>' + display + '</h1></div';
    $('#results-template').append(template).fadeIn(500);
}