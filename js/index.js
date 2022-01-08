class Dictionary {
    #hashTable;

    constructor(){
        this.#hashTable = new Array(17).fill(null);
    }// constructor


    /* #hashFunction(key)
     * returns the index in the hash table where the given key/value pair should be
     */
    #hashFunction(key){
        if(typeof(key) == "number"){
            return key % this.#hashTable.length;
        }
        else {
            return key.charCodeAt(0) % this.#hashTable.length;
        }
    }// #hashFunction


    /* add(key, value)
     * add the key-value pair to the dictionary if it hasn't already been added
     */
    add(key, value){
        let index = this.#hashFunction(key);
        if(this.get(key)==null){
            if(this.#hashTable[index]!=null){
                this.#hashTable[index].push([key,value]);
            }
            else{
                this.#hashTable[index] = new Array([key,value]);
            }
        }
    }// add


    /* get(key)
     * given a key returns the value the key corresponds to
     * or returns null if the key is not in the table
     */
    get(key){
        let val = null;
        let index = this.#hashFunction(key);

        if(this.#hashTable[index]!=null){
            let found = false;
            for(let i = 0; i < this.#hashTable[index].length && !found; i++){
                if(this.#hashTable[index][i][0]==key){
                    found = true;
                    val = this.#hashTable[index][i][1];
                }
            }
        }

        return val;
    }// get

}// Dictionary Class

let numberCharacters = new Dictionary();
let baseCharacters = new Dictionary();
let valToSymbol = new Dictionary();
let keys=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','A','B','C','D','E','F'];
let vals=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,10,11,12,13,14,15];

for(let i = 0; i < keys.length; i++){
    numberCharacters.add(keys[i], vals[i]);
}

for(let i = 0; i < 10; i++){
    baseCharacters.add(keys[i], vals[i]);
}

for(let i = 0; i < 16; i++){
    valToSymbol.add(vals[i], keys[i]);
}

document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('calculate').addEventListener('click',begin);
});


const begin = (ev)=>{
    ev.preventDefault();
    let number = document.getElementById('num').value;
    let inBase = document.getElementById('inp-base').value;
    let outBase = document.getElementById('out-base').value;

    let output = ""
    let text = document.querySelector("#result");

    if(valid(number, inBase, outBase)){
        output = base10toX(parseInt(number, parseInt(inBase)), parseInt(outBase));
    }
    else{
        output = "error: invalid number, input base, or output base"
    }
    text.textContent = output;

} // begin


/* valid(number, inBase, outBase)
 * verify that the input number, inBase, and outBase are all in the right format:
 * all are non-empty strings containing valid symbols, 
 * number is a valid number in base inBase, 
 * 2 <= inBase, outBase <= 16, etc.
 * return true if all inputs are valid and false otherwise
 */
function valid(number, inBase, outBase){
    let allValid = true;

    if(typeof(number) == 'string' && typeof(inBase)=='string' && typeof(outBase)=='string'){
        if(number.length == 0 || inBase.length==0 || outBase.length==0){
            allValid = false;
        }
        else{
                // check if the input number contains only the allowed characters
                for(let i = 0; i < number.length && allValid; i++){
                    if(numberCharacters.get(number.charAt(i)) == null){
                        allValid = false;
                    }
                }
    
                // check if the input base contains only the allowed characters
                for(let i = 0; i < inBase.length && allValid; i++){
                    if(baseCharacters.get(inBase.charAt(i))==null){
                        allValid = false;
                    }
                }
    
                let inBaseInt;
                let outBaseInt;
                // check that base is between 2-16 inclusive
                if(allValid){
                    inBaseInt = parseInt(inBase);
                    if (inBaseInt < 2 || inBaseInt > 16){
                        allValid = false;
                    } 
                }
    
                // check that 'number' is a valid integer in base 'inBase'
                if(allValid){
                    for(let i = 0; i <number.length && allValid; i++){
                        if(numberCharacters.get(number.charAt(i)) >= inBaseInt){
                            allValid = false;
                        }
                    }
                }
                
                // check if the output base contains only the allowed character
                if(allValid){
                    for(let i = 0; i < outBase.length && allValid; i++){
                        if(baseCharacters.get(outBase.charAt(i))==null){
                            allValid = false;
                        }
                    }
                }
                
                // check that base is between 2-16 inclusive
                if(allValid){
                    outBaseInt = parseInt(outBase);
                    if (outBaseInt < 2 || outBaseInt > 16){
                        allValid = false;
                    }
                }
        }
    }
    else{
        allValid=false;
    }

    return allValid;
} // valid


/* base10toX(num, base)
 * convert a number (num) in base 10 to the given base (base) and return the result
 */
function base10toX(num, base){
    output = "0";
    if(num!=0){
        quotient = num;
        output = "";

        while(quotient != 0){
            remainder = quotient % base;
            quotient = Math.floor(quotient/base);
            output = valToSymbol.get(remainder) + output;
        }
    }
    
    return output;
} // base10toX