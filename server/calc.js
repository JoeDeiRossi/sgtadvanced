
function doMath(num1, op, num2) {
    switch (op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            return num1 / num2;
    }
}

var n1 = parseInt(process.argv[2]);
var op = process.argv[3];
var n2 = parseInt(process.argv[4]);

var answer = doMath(n1, op, n2);
console.log(answer);