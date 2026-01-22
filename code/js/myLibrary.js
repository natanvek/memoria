
//--------------------------------------------------------------------------------------------
function addDots(number){
    let stringNum = number.toString()
    for(let i =stringNum.length;i>3;i-=3){
       stringNum = stringNum.slice(0, i-3) + "." + stringNum.slice(i-3,stringNum.length); 
    }
    return stringNum
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
function clock() {
    let number = document.getElementById("clock").getElementsByTagName('span')[0].innerHTML;
    let mins = parseInt(number.charAt(0)) * 10 + parseInt(number.charAt(1))
    let secs = parseInt(number.charAt(3)) * 10 + parseInt(number.charAt(4))
    if (!mins && !secs) {
        //function
        return;
    }
    if (!secs) {
        mins -= 1;
        secs = 59;
    } else {
        secs -= 1;
    }
    document.getElementById("clock").getElementsByTagName('span')[0].innerHTML = ("00" + mins).slice(-2) + ":" + (
        "00" + secs).slice(-2)
}
//var clockInterval;
//clockInterval = setInterval(clock, 1000);
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
function copyArray(array) { //simple as that you give this function an array of arrays and it returns a copy of it
    let copy = []
    for (let i = 0; i < array.length; i++) {
        if (!(array[i] instanceof Array)) {
            copy.push(array[i]) //if the array its just a value not another array adds the value to the array
        } else { //if the element of the initial array is an array first creats a copy of the array element recursing
            copy.push(copyArray(array[i])) // and then it adds it to the initial array 
        }
    }
    return copy;
}
function copyMatrix(matrix) { //simple as that you give this function an array of arrays and it returns a copy of it
    let copy = []
    for (let i = 0; i < matrix.length; i++) {
            copy.push([...matrix[i]]) // and then it adds it to the initial array 
    }
    return copy;
}
//
//first one copies any array with anything it may have deep copy
//
//second copies arrays and matrixes but copies matrixes efficiently
//
//to copy simple arrays var new array = [...array]
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
function interval(whatItDoes) {
    var self = this;

    self.start = function (newTime) {
        self.stop() 
        self.interval = setInterval( function () { self.task(); }, newTime);
    };

    self.stop = function () {
        clearInterval(self.interval);
    }

    self.task = function () {
        whatItDoes();
    };
    
}
//
//-------------------------------------------------------------------------------
//    CREATE NEW INTERVAL:
//      -var (varName) = new interval(intervalDoThis);
//-------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------- 
//    START INTERVAL:      
//      -varName.start(timeYouChoose);
//-------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------- 
//    STOP INTERVAL: 
//      -varName.stop();
//-------------------------------------------------------------------------------
//    
//-------------------------------------------------------------------------------
//    CHANGE INTERVAL TASK:   
//      -varName.task = nowIntervalDoThis; //if you dont need a parameter
//      -varName.task = function(){ nowIntervalDoThis(parameter);} //if you need a parameter 
//-------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
function mixer(list) {
    for (let i = 0; i < list.length; i++) {
        let ran = Math.floor(Math.random() * list.length)
        let save = list[i];
        list[i] = list[ran];
        list[ran] = save;
    }
    return list;
}
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.loop = function () {
        this.sound.loop = true;
    }
    this.stop = function () {
        this.sound.pause();
    }
    this.load = function () {
        this.sound.load();
    }
}
//--------------------------------------------------------------------------------------------