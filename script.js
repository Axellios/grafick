"use strict";

function drawGrap() {
    let canvas = document.getElementById('myCanvas');

    let func = 'x+100';

    let isTriag = false;

    if (canvas.getContext) {

        let graph = new MyGraphic();
        graph.initPoints(func);

        let ctx = canvas.getContext('2d');

        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;

        let realHeight = window.screen.height / 2;

        let stepForY = (graph.getMaxY() - graph.getMinY()) / realHeight;
        if (graph.getMaxY() < 2000 || graph.getMinY() > -2000) {
            stepForY = 10;
        }

        drawGrid(stepForY, ctx, canvas);
        if (!isTriag) {
            drawCoordin(ctx, canvas, centerX, centerY);
        }


        ctx.strokSeStyle = '#05386B';
        ctx.lineWidth = 5;

        let lastPoint = graph.Points.length;
        let stepLoop = 1;

        if (isTriag) {
            stepLoop += 100;
            lastPoint -= stepLoop + 1;

        }
        let top = true;

        ctx.strokeStyle = '#86C232';

        for (let i = 0; i < lastPoint; i += (stepLoop + stepLoop)) {


            let x = graph.Points[i].x + MyGraphic.MAX_X;

            let y = graph.Points[i].y * (-1) + centerY;


            if (isTriag) {
                let x2 = graph.Points[i + stepLoop].x + MyGraphic.MAX_X;
                ctx.moveTo(x + (x2 - x)*2, centerY-graph.Points[i].y);

                ctx.arc(x + (x2 - x), centerY-graph.Points[i].y, x2 - x, 0, Math.PI, top);

                top = !top;

            } else {

                if (i != 0) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.moveTo(x, y);
                }
            }

        }

        ctx.stroke();

    }

}

function drawCoordin(ctx, canvas, centerX, centerY) {
    ctx.strokeStyle = '#474B4F';
    ctx.lineWidth = 7;
    ctx.strokeRect(-5, -5, centerX + 5, centerY + 5);
    ctx.strokeRect(centerX, centerY, centerX + 5, centerY + 5);
}

function drawGrid(stepY, ctx, canvas) {

    ctx.strokeStyle = '#61892F';
    ctx.lineWidth = 3;

    let height = canvas.height;
    let width = canvas.width;

    for (let i = 0; i < MyGraphic.MAX_X * 2; i += MyGraphic.STEP * 100) {
        ctx.strokeRect(i, 0, MyGraphic.STEP * 100, height);
    }

    for (let i = 0; i < canvas.height; i += stepY * 15) {
        ctx.strokeRect(0, i, width, stepY * 15);
    }
}


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
    initPoints(value) {
        let calc = new Calc();
        for (let i = MyGraphic.MIN_X; i <= MyGraphic.MAX_X; i += MyGraphic.STEP) {
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



MyGraphic.MIN_X = -2000;
MyGraphic.MAX_X = 2000;
MyGraphic.STEP = 1;

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

