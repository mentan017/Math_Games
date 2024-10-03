var timerInterval;
var solved = 0;

document.getElementById("start-btn").addEventListener("click", StartGame);

function DisplayStart(){
    document.getElementById("question-super-container").innerHTML = `
    <div id="start-btn">Start <span style="font-size: 1.6rem;">&#9654;</span></div>`;
    document.getElementById("start-btn").addEventListener("click", StartGame);
}

function StartGame(){
    console.log("test");
    if(timerInterval){
        clearInterval(timerInterval);
        solved = 0;
        document.getElementById("timer").innerText= "00:00.00";
    }
    StartCountdown(3);
}

function StartCountdown(num){
    if(num > 0){
        document.getElementById("question-super-container").innerHTML = `<div class="countdown">${num}</div>`;
        setTimeout(StartCountdown, 1000, num-1)
    }else if(num == 0){
        document.getElementById("question-super-container").innerHTML = `<div class="countdown">GO!</div>`;
        setTimeout(StartCountdown, 400, num-1)
    }else{
        document.getElementById("question-super-container").innerHTML = `
        <div id="question-container">
            <div>x</div>
            <div>
            </div>
        </div>
        <div id="solution-container">
            <input type="text" placeholder="000000" id="user-solution">
        </div>`;
        document.getElementById("question-super-container").classList.add("playing");
        GetMultiplication(0);
        timerInterval = setInterval(UpdateTimer, 67, (new Date).getTime());
        document.getElementById("user-solution").addEventListener("keyup", CheckSolution);
    }
}

function GetMultiplication(mode){
    var min = 10;
    var max = 20;
    if(mode == 1){
        min = 20;
        max = 50;
    }
    var val1 = Math.floor(Math.random()*(max-min+1)+min);
    var val2 = Math.floor(Math.random()*(max-min+1)+min);
    document.getElementById("question-container").setAttribute("data-operation", `${val1}.${val2}`);
    document.getElementById("question-container").innerHTML = `<div>x</div><div>${val1}<br>${val2}</div>`;
}

function CheckSolution(){
    var input = parseInt(document.getElementById("user-solution").value);
    var operation = document.getElementById("question-container").getAttribute("data-operation");
    var factors = operation.split(".");
    var product = 1;
    for(var i=0; i<factors.length; i++){
        product *= parseInt(factors[i]);
    }
    if(product === input){
        solved++;
        if(solved == 5){
            clearInterval(timerInterval);
            document.getElementById("question-super-container").classList.remove("playing");
            document.getElementById("question-super-container").innerHTML = `
            <div class="finish-screen">
                <p>Congrats! You time is<br><span style="color: #aca916; line-height: 4rem;">${document.getElementById("timer").innerText}</span></p>
                <p id="play-again-btn">Play again &#8634;</p>
            </div>`;
            document.getElementById("play-again-btn").addEventListener("click", DisplayStart);
        }else{
            GetMultiplication(0);
            document.getElementById("user-solution").value = "";    
        }
    }
}

async function UpdateTimer(startTime){
    var elapsedTime = (new Date).getTime() - startTime;
    var centiseconds = Math.floor(elapsedTime/10);
    var seconds = (centiseconds-(centiseconds%100))/100;
    var minutes = (seconds-(seconds%60))/60;
    document.getElementById("timer").innerHTML = (`${Format(minutes, 2)}:${Format(seconds%60, 2)}.${Format(centiseconds%100, 2)}`);
}

function Format(num, digits){
    numLength = 1;
    if(num != 0) numLength = Math.floor(Math.log10(num)) + 1;
    var str = "";
    for(var i=0; i<(digits-numLength); i++){
        str += "0";
    }
    return(str+num.toString())
}