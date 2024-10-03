window.onload = GetMultiplication(0);

document.getElementById("user-solution").addEventListener("keyup", CheckSolution);

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
    //! Temporary
    if(document.getElementById("timer").innerText == "00:00.00"){
        document.getElementById("timer").innerText == "00:00:01";
        setInterval(UpdateTimer, 67, (new Date).getTime());
    }
    var input = parseInt(document.getElementById("user-solution").value);
    var operation = document.getElementById("question-container").getAttribute("data-operation");
    var factors = operation.split(".");
    var product = 1;
    for(var i=0; i<factors.length; i++){
        product *= parseInt(factors[i]);
    }
    if(product === input){
        GetMultiplication(0);
        document.getElementById("user-solution").value = "";
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