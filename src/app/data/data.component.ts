import * as _ from 'underscore';
import { Component, OnInit, Input } from '@angular/core';
import { Data } from './../../data'

@Component({
    selector: 'app-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
    private _data: Data;
    @Input() useTestData: boolean = false;
    @Input() onRowClick: Function;
    isCollapsed: Boolean = false;
    selected: Object = null;
    testPredictions: { wasPredicted: boolean, wasCorrect: boolean }[];

    @Input()
    set data(data: Data){
        this._data = data;
        this.testPredictions = _.pluck(this.data.test, this.data.targetProperty).map((targetVal) => {
            return {
                wasPredicted: false,
                wasCorrect: false
            }
        });
    }
    
    get data(): Data {
        return this._data;
    }

    constructor() {
    }

    ngOnInit() {
    }

    toggleCollapse = () => {
        this.isCollapsed = !this.isCollapsed;
    }

    rowClick = (datum: Object, index: number) => {
        this.selected = datum;
        if (this.onRowClick) {
            let testPrediction = this.testPredictions[index];
            testPrediction.wasCorrect = this.onRowClick(datum)[0] === datum[this.data.targetProperty];
            testPrediction.wasPredicted = true;
        }
    }
}
