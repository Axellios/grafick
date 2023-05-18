"use strict";

import Parser from '../js/Parser.js'

export default class Calc {
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



