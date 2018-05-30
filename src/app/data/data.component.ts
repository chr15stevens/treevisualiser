import { Component, OnInit, Input } from '@angular/core';
import { Data } from './../../data'

@Component({
    selector: 'app-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
    @Input() data: Data;
    @Input() useTestData: boolean = false;
    @Input() onRowClick: Function;
    isCollapsed: Boolean = false;
    selected: Object = null;

    constructor() {
    }

    ngOnInit() {
    }

    toggleCollapse = () => {
        this.isCollapsed = !this.isCollapsed;
    }

    rowClick = (datum: Object) => {
        this.selected = datum;
        if (this.onRowClick) this.onRowClick(datum);
    }
}
