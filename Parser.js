"use strict";

export default class Parser {
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