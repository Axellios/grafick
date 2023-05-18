
//закрытие страницы
window.addEventListener('beforeunload', function (e) {
    localStorage.setItem('graphic', document.getElementById("exGraph").value);
    localStorage.setItem('func', document.getElementById('inputFormula').value);
    localStorage.setItem('start', document.getElementById('rangeStart').value);
    localStorage.setItem('end', document.getElementById('rangeEnd').value);
    
})

//загрузка страницы
window.addEventListener('load', function (e) {
    let g = localStorage.getItem('graphic');
    let f = localStorage.getItem('func');
    let st = localStorage.getItem('start');
    let en = localStorage.getItem('end');

    if (g != undefined){
        document.getElementById("exGraph").value = g;
        drawExGr();
    }

    if (f != undefined  && f !=''){ 
        document.getElementById('inputFormula').value = f;
    }

    if (st != undefined && st !=''){
        document.getElementById('rangeStart').value = st;
    }
    
    if ( en != undefined && en !=''){
        document.getElementById('rangeEnd').value = en;
    } 

    if (f != undefined && st != undefined && en != undefined && f !='' && st !='' && en !=''){ 
        calcPoints();
    }
})

function drawExGr() {

    let value = document.getElementById("exGraph").value;

    if (value != undefined && value != "") {
        let canvas = document.getElementById('myCanvas');
        if (canvas.getContext) {
            let ctx = canvas.getContext('2d');

            ctx.clearRect(0,0,2000,2000);

            ctx.beginPath();

            let centerX = canvas.width / 2;
            let centerY = canvas.height / 2;

            drawCoordin(ctx, centerX, centerY);

            ctx.strokeStyle = '#86C232';
            switch (value) {
                case "Парабола":
                    let startPoint = 1000;

                    ctx.moveTo(startPoint, startPoint);
                    ctx.quadraticCurveTo(900, 1000, 800, 0);
                    ctx.moveTo(startPoint, startPoint);
                    ctx.quadraticCurveTo(1100, 1000, 1200, 0);

                    break;
                case "Прямая":
                    ctx.moveTo(0, canvas.height);
                    ctx.lineTo(canvas.width, 0);
                    break;
                case "Синусоида":
                    let step = 1200;
                    ctx.moveTo(centerY, centerX);
                    for (let i = 0; i < 10; i++) {
                        if (i % 2 == 0) {
                            ctx.quadraticCurveTo(step - 100, 800, step, 1000);
                        } else {
                            ctx.quadraticCurveTo(step - 100, 1200, step, 1000);
                        }
                        step += 200;
                    }

                    ctx.moveTo(centerY, centerX);
                    step = 800;

                    for (let i = 0; i < 10; i++) {
                        if (i % 2 == 0) {
                            ctx.quadraticCurveTo(step + 100, 1200, step, 1000);
                        } else {
                            ctx.quadraticCurveTo(step + 100, 800, step, 1000);
                        }
                        step -= 200;
                    }
                   

                    break;
                default:
                    break;
            }

            ctx.moveTo(centerY, centerX);
            ctx.closePath();
            ctx.stroke();

        }
    }

}

function calcPoints() {
    let func = document.getElementById('inputFormula').value.replace(" ", "").toLowerCase();

    let start = Number.parseFloat(document.getElementById('rangeStart').value);
    let end = Number.parseFloat(document.getElementById('rangeEnd').value);
    let step = 1;

    if (func == "") {
        alert("Заполните функцию");
        return;
    }

    if (!isFinite(start) || !isFinite(end) || (start === 0 && end === 0)) {
        alert("Заполните корректно диапазон");
        return;
    }

    if (start > end) {
        alert("Заполните корректно диапазон. Значение ОТ не может быть больше ДО");
        return;
    }

    if (func.indexOf("x") == -1) {
        alert("В функции не обнаружен x");
        return;
    }

    let graph = new MyGraphic();
    try {
        graph.initPoints(func, start, end, step)
    } catch (e) {
        alert("Ошибка при создании точек.");
        return;
    }

    if (graph.Points.length == 0) {
        alert("Точки не были созданы.");
        return;
    }

    let table = document.getElementById('valuesFunc');
    table.innerHTML = ("<tr>" + "<td></td>".repeat(3) + "</tr>").repeat(graph.Points.length);


    let td = document.querySelectorAll('#valuesFunc td');

    td[0].textContent = "Номер точки";
    td[1].textContent = "Значение x";
    td[2].textContent = "Значение y";

    let numPoint = 0;

    for (let i = 3; i < graph.Points.length * 3; i++) {

        td[i].textContent = numPoint + 1;
        i++;
        td[i].textContent = graph.Points[numPoint].x;
        i++;
        td[i].textContent = graph.Points[numPoint].y;
        numPoint++;

    }
}

function drawCoordin(ctx, centerX, centerY) {
    ctx.strokeStyle = '#474B4F';
    ctx.lineWidth = 7;
    ctx.strokeRect(-5, -5, centerX + 5, centerY + 5);
    ctx.strokeRect(centerX, centerY, centerX + 5, centerY + 5);
}




//===============================
class Calc {
    //Открытый метод для расчетов
    //Принимает в себя строку для парсинга/расчета в дальнейшем
    //Возвращает результат расчетов
    calculate(value) {
        //парсим
        let parser = new Parser();
        let array = parser.parse(value);
        //считаем
        let res = this.findRes(array);
        return res;
    }
    //Расчет тригонометрических функций
    calcTriag(value) {
        let triag = ['sin', 'cos', 'tg', 'ctg'];
        for (let i = 0; i < triag.length; i++) {
            if (value.indexOf(triag[i]) != -1) {
                let buf = value.slice(triag[i].length + 1, value.length - 1);
                switch (triag[i]) {
                    case 'sin':
                        return Math.sin(parseInt(buf));
                    case 'cos':
                        return Math.cos(parseInt(buf));
                    case 'tg':
                        return Math.tan(parseInt(buf));
                    case 'ctg':
                        return Math.PI / 2 - Math.atan(parseInt(buf));
                    default:
                        console.log('Неизвестня функция');
                        break;
                }
            }
        }
        return 0;
    }
    //Находит результат по входному массиву
    //Возвращает число итоговое
    findRes(parseArrays) {
        let symbols = ['^', '*', '/', '+', '-']; //массив действий в порядке приоритета
        let numbersParse = new Array();
        //сюда пришли строки, поэтому делаем числа
        for (let i = 0; i < parseArrays[0].length; i++) {
            let buf = this.getNumber(parseArrays[0][i]);
            if (Number.isNaN(buf)) {
                numbersParse.push(this.calcTriag(parseArrays[0][i]));
            }
            else {
                numbersParse.push(buf);
            }
        }
        let symbolsParse = parseArrays[1];
        for (let i = 0; i < symbols.length; i++) { //Приоритетный массив
            if (i != 0) {
                for (let j = 0; j < symbolsParse.length; j++) {
                    if (symbols[i - 1] === symbolsParse[j]) {
                        i--;
                        break;
                    }
                }
            }
            for (let j = 0; j < symbolsParse.length; j++) { //Распарсшенный массив (символы из примера)
                if (symbols[i] === symbolsParse[j]) {
                    //запоминаем числа для манипуляций
                    let number1 = numbersParse[j];
                    let number2 = numbersParse[j + 1];
                    let res = 0;
                    //рещаем что делать с этими числами
                    switch (symbols[i]) {
                        case '^':
                            res = Math.pow(number1, number2);
                            break;
                        case '*':
                            res = number1 * number2;
                            break;
                        case '/':
                            res = number1 / number2;
                            break;
                        case '+':
                            res = number1 + number2;
                            break;
                        case '-':
                            res = number1 - number2;
                            break;
                        default:
                            console.log('Неизвестный символ');
                    }
                    symbolsParse.splice(j, 1); //убираем использованный символ
                    numbersParse[j] = res; //сейвим наш результат
                    let buf = new Array(); //буфер для массива чисел
                    for (let bufI = 0; bufI < numbersParse.length; bufI++) { //Для удаления ненужного числа (splice криво работает)
                        if (bufI != j + 1) {
                            buf.push(numbersParse[bufI]);
                        }
                    }
                    numbersParse = buf; //подставляем буфер как новый массив чисел
                    j = 0; //Распарсшенные символы начинаем смотреть с самого начала
                }
            }
        }
        return numbersParse[0]; //В первой ячейке у нас результат
    }
    //Преобразует строки в числа
    getNumber(value) {
        return Number.parseInt(value);
    }
}

class MyGraphic {
    constructor() {
        this.points = new Array();
    }
    get Points() {
        return this.points;
    }
    initPoints(value, start, end, step) {
        let calc = new Calc();
        for (let i = start; i <= end; i += step) {
            let point = new MyPoint(0, 0);
            let newLine = value.replace('x', i.toString());
            point.X = i;
            point.Y = calc.calculate(newLine);
            this.points.push(point);
        }
    }
    getMaxY() {
        let max = this.points[0].y;
        for (let i = 0; i < this.Points.length; i++) {
            if (max < this.points[i].y) {
                max = this.points[i].y;
            }
        }
        return max;
    }

    getMinY() {
        let min = this.points[0].y;
        for (let i = 0; i < this.Points.length; i++) {
            if (min > this.points[i].y) {
                min = this.points[i].y;
            }
        }
        return min;
    }
}


class MyPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get X() {
        return this.X;
    }
    set X(x) {
        this.x = x;
    }
    get Y() {
        return this.y;
    }
    set Y(y) {
        this.y = y;
    }
}


class Parser {
    //Принимает в себя строку и возвращает массив
    //В первой ячейке числа, во второй - символы
    parse(value) {
        let sep = ['+', '-', '*', '/', '^']; //для обнаружения символов
        //let reg = new RegExp('[\+\-\/\*\^]');  //используем для того что бы получить числа
        //let numbersArray = value.split(reg);
        let symbolsArray = new Array();
        let numbersArray = new Array();
        let bufNum = '';
        for (let i = 0; i < value.length; i++) { //начинаем с 1-ого т.к. возможно пример начинается с минуса
            let buf = value.charAt(i);
            let isSymbol = false;
            if (undefined != sep.find(el => buf === el)) {
                if (value.charAt(i - 1) != '(' && i != 0) {
                    symbolsArray.push(buf);
                    isSymbol = true;
                }
            }
            if (isSymbol && buf != '') {
                numbersArray.push(bufNum);
                bufNum = '';
            }
            else {
                bufNum += value.charAt(i);
            }
        }
        if (bufNum != '') {
            numbersArray.push(bufNum);
        }
        let result = new Array(); //результирующий массив
        result.push(numbersArray);
        result.push(symbolsArray);
        return result;
    }
}

