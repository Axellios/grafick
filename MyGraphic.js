"use strict";
import MyPoint from '../js/MyPoint.js'
import Calc from '../js/Calc.js'

export default class MyGraphic {
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
}

MyGraphic.MIN_X = -10;
MyGraphic.MAX_X = 10;
MyGraphic.STEP = 0.0000001;