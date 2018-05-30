import { Component } from '@angular/core';
import { Data, PlayTennisData, VotingData, TicTacToeData } from './../data';
import { TreeAlgorithm, ID3 } from './../id3'
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Tree Visualiser';
    datasets: Data[] = [new PlayTennisData(), new VotingData(), new TicTacToeData()];
    algorithmNames: string[] = ['ID3', 'C4.5', 'CART', 'RANDOM FOREST'];
    selectedDataset: Data;
    selectedAlgorithm: TreeAlgorithm;

    constructor() {
        this.selectedDataset = this.datasets[0];
        this.selectedAlgorithm = this.getAlgoClassFromName(this.algorithmNames[0])
    }

    selectDataset = (dataset: Data) => {
        this.selectedDataset = dataset;
    }

    selectAlgorithm = (algorithmName: string) => {
        this.selectedAlgorithm = this.getAlgoClassFromName(algorithmName);
    }

    private getAlgoClassFromName = (name: string) => {
        if (name === 'ID3') 
            return new ID3(this.selectedDataset.training, this.selectedDataset.targetProperty, this.selectedDataset.features); 
    }
}
