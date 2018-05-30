import { Component } from '@angular/core';
import { Data, PlayTennisData, VotingData, TicTacToeData } from './../data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Tree Visualiser';
    datasets: Data[] = [new PlayTennisData(), new VotingData(), new TicTacToeData()]; 
    selectedDataset: Data;

    constructor() {
        // document.body.style.margin = '0';
        this.selectedDataset = this.datasets[0];
    }

    selectDataset = (dataset: Data) => {
        this.selectedDataset = dataset;
    }
}
