import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Tree } from './tree';
import { ID3, C45, LeafNode, TreeAlgorithm } from './../../id3';
import { Data } from './../../data'

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
    private _dataset: Data;
    private _algorithmName: string;
    model: TreeAlgorithm;
    @ViewChild('dataContainer') dataContainer: ElementRef;
    @ViewChild('treeContainer') treeContainer: ElementRef;
    @ViewChild('separator') separator: ElementRef;
    private dragCount: number = 0;
    private percentageAccuracy = 0;

    @Input()
    set dataset(dataset: Data){
        this._dataset = dataset;
        if (this._algorithmName) {
            this.model = this.getAlgoClassFromName(this._algorithmName)
            this.initializeModel();
        }
    }

    get dataset(): Data {
        return this._dataset;
    }

    @Input()
    set algorithmName(algoName: string){
        this._algorithmName = algoName;
        this.model = this.getAlgoClassFromName(algoName)
        if (this.dataset) {
            this.initializeModel();
        }
    }

    constructor() { }

    ngOnInit() {
    }

    initializeModel = () => {
        this.model.build();
        this.percentageAccuracy = this.model.calcPercentageAccuracy(this._dataset.test);
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
        return this.model.predict(datum)
    }

    // todo: make this a cache
    private getAlgoClassFromName = (name: string): TreeAlgorithm => {
        if (name === 'ID3') 
            return new ID3(this._dataset.training, this._dataset.targetProperty, this._dataset.features);
        else if(name === 'C4.5')
            return new C45(this._dataset.training, this._dataset.targetProperty, this._dataset.features);
    }
}
