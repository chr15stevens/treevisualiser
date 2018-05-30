import { Component, OnInit, Input } from '@angular/core';
import { LeafNode } from '../../id3';

@Component({
    selector: 'app-leafnode',
    templateUrl: './leafnode.component.html',
    styleUrls: ['./leafnode.component.css']
})
export class LeafnodeComponent implements OnInit {

    @Input() leafNode: LeafNode;
    @Input() isRoot: Boolean = false;
    constructor() { }

    ngOnInit() {
        console.log(this.leafNode.type)
    }

    onClick1 = () => {
        console.log(this);
    }
}
