#include "/home/natanvek/0-COMPUTER/0-PROGRAMACION/8-COMPETENCIA/Template/macros.cpp"
#include <locale>


// considerar y = "ll" y cosas como j = "98"
map<char, char> code = { 
    {'r', '0'},
    {'l', '1'},
    {'d', '2'},
    {'m', '3'},
    {'c', '4'},
    {'k', '4'},
    {'q', '4'},
    {'s', '5'},
    {'z', '5'},
    {'g', '6'},
    {'t', '7'},
    {'b', '8'},
    {'v', '8'},
    {'n', '9'},
    {'\303', '9'}
};


string wordToCode(string word) {
    string rta;
    if(word == "PIÑATA") {
        int popo = 34;
    }
    for(char c : word) {
        c = tolower(c);
        if(code.count(c)) rta.pb(code[c]);
    }
    return rta;
}


realint main() {
    string palabrasFileName = "palabras.txt";
    ifstream palabrasFile(palabrasFileName); assert(palabrasFile.is_open());
    palabrasFile.imbue(std::locale("es_ES.UTF-8"));

    vs palabras;
    string palabra;
    while(palabrasFile >> palabra) 
        palabras.pb(palabra);
    

    map<string, string> dic;
    for(string p : palabras) {
        string codigo = wordToCode(p);
        if(dic.count(codigo)) {
            put("che en el diccionario están", p, "y", dic[codigo]);
        } else {
            dic[codigo] = p;
        } 
    }


    
    string numero; cin >> numero;
    int n = len(numero);
    vvs dp(n+1);
    forn(i, 1, n+1){
        int mn = infll;
        forn(j, 0, i){
            string s = numero.substr(j, i-j);
            if(dic.count(s) && mineq(mn, len(dp[j]) + 1)){
                dp[i] = dp[j];
                dp[i].pb(dic[s]);
            }
        }
    }

    put(dp[n]);


    return 0;
}




