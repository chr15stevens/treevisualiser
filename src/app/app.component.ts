import { Component } from '@angular/core';
import { Data, PlayTennisData, VotingData, TicTacToeData } from './../data';
import { ITreeAlgorithm, ID3, C45 } from './../id3'
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Tree Visualiser';
    datasets: Data[] = [new PlayTennisData(), new VotingData(), new TicTacToeData()];
    algorithmNames: string[] = ['ID3', 'C4.5']; //, 'CART', 'RANDOM FOREST'];
    selectedDataset: Data;
    selectedAlgorithmName: string;

    constructor() {
        this.selectedDataset = this.datasets[0];
        this.selectedAlgorithmName = 'ID3';
    }

    selectDataset = (dataset: Data) => {
        this.selectedDataset = dataset;
    }

    selectAlgorithm = (algorithmName: string) => {
        this.selectedAlgorithmName = algorithmName;
    }
}
