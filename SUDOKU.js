var size = 4;
var GameTimeSet = 1; //in minutes
var row = 0;
var col = 0;
var checkResultFlag = 0;
var checkSum=0;
$(function() {
    chooseLevel();
}); //end of load

function chooseLevel() {
    $("#mainWrapper,#gameEnd").hide();
    $("#temporary").show();
    $("#startBtn").on("click", function() {
        $("#temporary").hide();
        switch ($("#levelSelection").val()) {
            case "1":
                size = 4;
                GameTimeSet = 3;
                break;
            case "2":
                size = 5;
                GameTimeSet = 5;
                break;
            case "3":
                size = 6;
                GameTimeSet = 10;
                break;
            case "4":
                size = 9;
                GameTimeSet = 15;
                break;
        }
        if ($("#timerSet").val() == 0) {
            timecount();
        } else {
            timer(GameTimeSet);
        }
        $("#mainWrapper").fadeIn(2000);
        startGame();
    });
}

function startGame() {
    drawTable();
    styleCurrent();
    $("body").on("keydown", function(e) {
        inputControl(e.key);
        checkBoundaries();
        styleCurrent();
        CheckForResult();
    }); //end of body keydown event
}

function styleCurrent() {
    $("td").removeClass("current");
    $("tr:eq(" + row + ") td:eq(" + col + ")").addClass("current");
}

function checkBoundaries() {
    if (row > size - 1) {
        row = 0;
    }
    if (row < 0) {
        row = size - 1;
    }
    if (col > size - 1) {
        col = 0;
    }
    if (col < 0) {
        col = size - 1;
    }
}

function drawTable() {
    for (var i = 0; i < size; i++) {
        $("#gameTable").append("<tr>");
        for (var n = 0; n < size; n++) {
            $("tr:eq(" + i + ")").append("<td>");
        } //end of inner For loop
    }; //end of outer FOR loop

    arr1 = createShuffledArr(size);
    arr2 = createShuffledArr(size);
    for (i = 0; i < size; i++) {
        arr2[i]++;
        checkSum+=arr2[i];
    }
    for (var n = 0; n < size; n++) {
        $("tr:eq(" + n + ") td:eq(" + arr1[n] + ")").addClass("locked");
        $("tr:eq(" + n + ") td:eq(" + arr1[n] + ")")[0].innerHTML = arr2[n];
    } //end of For loop
}

function createShuffledArr(arrLength) {
    var array = [];
    for (var i = 0; i < arrLength; i++) {
        array.push(i);
    }
    var tmp, current, top = array.length;
    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    return array;
};

function inputControl(key) {
    switch (key) {
        case "ArrowDown":
            row++;
            break;
        case "ArrowUp":
            row--;
            break;
        case "ArrowLeft":
            col--;
            break;
        case "ArrowRight":
            col++;
            break;
        default:
            if (key > 0 && key < size + 1 && (!$("tr:eq(" + row + ") td:eq(" + col + ")").hasClass("locked"))) {
                $("tr:eq(" + row + ") td:eq(" + col + ")")[0].textContent = key;
            }
            break;
    }
}

function CheckForResult() {
    checkResultFlag = 0;
    for (var r= 0 ; r<size ; r++) {
        var sumrows = 0;
        var sumcols = 0;
        for(var c=0 ; c<size ; c++){
            sumrows += Number($("tr:eq("+r+") td:eq("+c+")").text());
            sumcols += Number($("tr:eq("+c+") td:eq("+r+")").text());
        }
        if( sumcols!=checkSum || sumrows!=checkSum){
            checkResultFlag = 1;
        }
    }
    if (checkResultFlag == 0) {
        $("#gameEnd p").text("You Win ;D");
        gameEnd();
    }
}

function timer(GameTime) {
    minutes = GameTime;
    seconds = 00;
    $('#timer').text(minutes + " : " + seconds);
    intervalID = setInterval(function() {
        seconds--;
        if (seconds == -1) {
            seconds = 59;
            minutes--;
        }
        $('#timer').text(minutes + " : " + seconds);
    }, 1000)
    setTimeout(function() {
        clearInterval(intervalID);
        $('#timer').text(" Time Out ");
        CheckForResult();
        if (checkResultFlag == 1) {
            $("#gameEnd p").text("Sorry you loose");
            gameEnd();
        }
    }, (60 * 1000 * GameTime));
};

function timecount() {
    hours = 00;
    minutes = 00;
    seconds = 00;
    $('#timer').text(minutes + " : " + seconds);
    intervalID = setInterval(function() {
        seconds++;
        if (seconds == 60) {
            minutes++;
            seconds = 00;
        }
        if(minutes == 60){
            hours ++;
            minutes =00;
        }
        $('#timer').text(minutes + " : " + seconds);
    }, 1000)
};

function gameEnd() {
    $("#mainWrapper").css('opacity', 0.2);
    $("body").unbind("keydown");
    $("#gameEnd").fadeIn(2000);
    $("#gameEnd :button:eq(0)").on("click", function() {
        location.reload();
    }); //end of click handler on replay button
    $("#gameEnd :button:eq(1)").on("click", function() {
        $("#mainWrapper").css('opacity', '0.2');
        $("#gameEnd :button").hide();
        $("#gameEnd p").text("Good Bye :D");
        $("*").fadeOut(4000);
        self.close();
    }); //end of click handler on exit button
}
