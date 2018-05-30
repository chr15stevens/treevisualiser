import { Component, OnInit, Input } from '@angular/core';
import { Tree } from './tree';
import { ID3, LeafNode } from './../../id3';
import { Data } from './../../data'

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
    private _dataset: Data;
    model: ID3;

    @Input()
    set dataset(dataset: Data){
        this._dataset = dataset;
        this.model = new ID3(dataset.training, dataset.targetProperty, dataset.features);
        this.model.build();
    }

    get dataset(): Data {
        return this._dataset;
    }

    constructor() { }

    ngOnInit() {
        // this.model = new ID3(this.dataset.training, this.dataset.targetProperty, this.dataset.features);
        // this.model.build();
    }

    predict = (datum: any) => {
        this.model.deselectAllNodes()
        console.log(datum);
        console.log(this.model.predict(datum))
    }
}
