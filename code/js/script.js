
let number = prompt();


const code = {
    r: '0', l: '1', d: '2', m: '3', c: '4', q: '4', k: '4', s: '5', z: '5', g: '6', t: '7', b: '8', v: '8', n: '9', ñ: 9
};


function wordToCode(word){
    let str = "";
    word = word.toLowerCase();
    for(let s of word){
        if(code[s] != undefined) str += code[s];
    }
    return str;
}

function makeDicc(dicc, arr){
    for (let word of arr){
        let str = wordToCode(word);
        if(dicc[str] == undefined){
            dicc[str] = word;
        }else {
            console.clear()
            console.log('word:', word)
            console.log('esta:', dicc[str])
            debugger
        }
    }
}


function bestWords(dicc, numeros){ //asume que para todo numero existe alguna solución
    // debugger;
    let n = numeros.length; // numeros es un string de numeros
    let dp = new Array(n+1);
    dp[0] = [];
    for(let i = 1; i <= n; ++i){
        dp[i] = [];
        let mn = Infinity;
        for(let j = 0; j < i; ++j) {
            let s = numeros.substring(j, i);
            if(dp[j].length + 1 < mn && dicc[s] != undefined){
                dp[i] = [...dp[j], dicc[s]];
                mn = dp[i].length
            }
        }
    }

    return dp[n];

}

let normal = {
    dicc: {}
}
makeDicc(normal.dicc, diccBase);
makeDicc(normal.dicc, agregados);


console.log(bestWords(normal.dicc, number))