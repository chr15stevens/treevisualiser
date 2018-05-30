import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
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
    @ViewChild('dataContainer') dataContainer: ElementRef;
    @ViewChild('treeContainer') treeContainer: ElementRef;
    @ViewChild('separator') separator: ElementRef;
    private dragCount: number = 0;
    private percentageAccuracy = 0;

    @Input()
    set dataset(dataset: Data){
        this._dataset = dataset;
        this.model = new ID3(dataset.training, dataset.targetProperty, dataset.features);
        this.model.build();
        this.percentageAccuracy = this.model.calcPercentageAccuracy(this._dataset.test);
    }

    get dataset(): Data {
        return this._dataset;
    }

    constructor() { }

    ngOnInit() {
        // this.model = new ID3(this.dataset.training, this.dataset.targetProperty, this.dataset.features);
        // this.model.build();
    }

    onSeparatorDrag = (e: DragEvent) => {
        // if (this.dragCount%100 == 0) {
            let newSeparatorPosition = e.screenX;
            if( newSeparatorPosition != 0) {
                let browserWidth = window.innerWidth;
                let percentPosition = (newSeparatorPosition/browserWidth) * 100;
                console.log('drag', e, 'pp', percentPosition);
                this.dataContainer.nativeElement.style.width = percentPosition.toString() + "%";
                this.separator.nativeElement.style.left = (percentPosition + 1).toString() + "%";
                this.treeContainer.nativeElement.style.width = (97 - percentPosition).toString() + "%";
            }
        // }
        this.dragCount++;
    }

    predict = (datum: any) => {
        this.model.deselectAllNodes()
        console.log(datum);
        console.log(this.model.predict(datum))
    }
}
