//ID3 Decision Tree Algorithm
import * as _ from 'underscore';

//main algorithm and prediction functions
export class ID3 {

    features: string[];
    target: string;
    trainingData: object[];
    modelRoot: LeafNode;
    selectedNodes: LeafNode[] = [];

    constructor(trainingData: object[], target: string, features: string[]) {
        this.trainingData = trainingData;
        this.target = target;
        this.features = features;
    }

    build = () => {
        var targets = _.unique(_.pluck(this.trainingData, this.target));

        if (targets.length == 1) {
            console.log(`The target variable \'${targets[0]}\' only has one answer left therefore this is a terminal node!`);

            this.modelRoot = new LeafNode({
                type: "result",
                vals: [targets[0]],
                name: targets[0],
                alias: targets[0] + ID3.randomTag()
            });

            return;
        }

        if (this.features.length == 0) {
            console.log("0 features left for branch so taking most common target.");
            var mostCommonTarget = ID3.mostCommon(_.pluck(this.trainingData, this.target));
            this.modelRoot = new LeafNode({
                type:"result",
                vals: [],
                name: mostCommonTarget,
                alias: mostCommonTarget + ID3.randomTag()
            });

            return;
        }

        var bestFeature = ID3.maxGain(this.trainingData, this.target, this.features);
        var remainingFeatures = _.without(this.features, bestFeature);
        var possibleValues = _.unique(_.pluck(this.trainingData, bestFeature));

        console.log("Building node for the best feature " + bestFeature);
        this.modelRoot = new LeafNode({
            name: bestFeature,
            alias: bestFeature + ID3.randomTag(),
            type: "feature",
            vals: _.map(possibleValues, possibleValue => {
                console.log("Creating a branch for " + possibleValue);
                var _newS = this.trainingData.filter(x => { return x[bestFeature] == possibleValue; });

                var id3 = new ID3(_newS, this.target, remainingFeatures);
                id3.build();
                return new LeafNode({
                    name: possibleValue,
                    alias: possibleValue + ID3.randomTag(),
                    type: "feature_value",
                    vals:  [id3.modelRoot]
                });
            })
        });
    };

    predict = (testDatum: Object) => {
        let currentNode = this.modelRoot;
        while(currentNode !== undefined && currentNode.type != 'result') {
            currentNode.isSelected = true;
            this.selectedNodes.push(currentNode);

            var testValue = testDatum[currentNode.name];
            var childNode = _.detect(currentNode.vals, (x: any) => { 
                return x.name == testValue
            });
            childNode.isSelected = true;
            this.selectedNodes.push(childNode);
            currentNode = childNode.vals[0];
        }
        currentNode.isSelected = true;
        this.selectedNodes.push(currentNode);

        return currentNode.vals;
    };

    deselectAllNodes = () => {
        this.selectedNodes.forEach(node => {
            node.isSelected = false;
        });
        this.selectedNodes = [];
    }

    calcError = function(testData){
        var total = 0;
        var correct = 0;
        _.each(testData, testDatum => {
            total++;
            var pred = this.predict(testDatum);
            var actual = testDatum[this.target];
            if(pred == actual){
                correct++;
            }
        });
        return correct/total;
    }

    static entropy = function(vals) {
        var uniqueVals = _.unique(vals);
        var probs = uniqueVals.map( (x) => { return ID3.prob(x,vals); });
        var logVals = probs.map( (p) => { return -p * ID3.log2(p); });
        return logVals.reduce( (a, b) => { return a + b; }, 0);
    };

    static gain = function(_s, target, feature){
        var attrVals = _.unique(_.pluck(_s, feature));
        var setEntropy = ID3.entropy(_.pluck(_s, target));
        var setSize = _s.length;
        var entropies = attrVals.map(n => {
            var subset = _s.filter( (x) => { return x[feature] === n; });
            return (subset.length/setSize)*ID3.entropy(_.pluck(subset,target));
        });
        var sumOfEntropies =  entropies.reduce((a,b) => { return a+b },0);
        return setEntropy - sumOfEntropies;
    }

    static maxGain = function(_s, target, features: string[]): string {
        return _.max(features, function(e){
            return ID3.gain(_s,target,e)
        });
    }

    static prob = (val, vals) => {
        var instances = _.filter(vals,function(x) {return x === val}).length;
        var total = vals.length;
        return instances/total;
    }
    
    static log2 = function(n): number{
        return Math.log(n)/Math.log(2);
    }

    /**
     * Given a list of values returns the most common one in the list.
     */
    static mostCommon = function(values: string[]): string{
        return _.sortBy( values, a => {
            return ID3.count(a, values);
        }).reverse()[0];
    }

    /**
     * Counts the number of times a value appears in an array 
     */
    static count = function(value, valuesArray): number {
        return _.filter(valuesArray, b => { return b === value; }).length
    }

    static randomTag = function(): string {
        return "_r" + Math.round(Math.random()*1000000).toString();
    }


    //Display logic

    // drawGraph = function(id3Model,divId){
    //     var g = new Array();
    //     g = ID3.addEdges(id3Model,g).reverse();
    //     window.g = g;
    //     var data = google.visualization.arrayToDataTable(g.concat(g));
    //     var chart = new google.visualization.OrgChart(document.getElementById(divId));
    //     google.visualization.events.addListener(chart, 'ready',function(){
    //         _.each($('.google-visualization-orgchart-node'),function(x){
    //             var oldVal = $(x).html();
    //             if(oldVal){
    //                 var cleanVal = oldVal.replace(/_r[0-9]+/,'');
    //                 $(x).html(cleanVal);
    //             }
    //         }); 
    //     });
    //     chart.draw(data, {allowHtml: true});
    // }
    
    // addEdges = function(node,g){
    //     if(node.type == 'feature'){
    //     _.each(node.vals,function(m){
    //         g.push([m.alias,node.alias,'']);
    //         g = addEdges(m,g);
    //     });
    //     return g;
    //     }
    //     if(node.type == 'feature_value'){
    
    //     g.push([node.child.alias,node.alias,'']);
    //     if(node.child.type != 'result'){
    //         g = addEdges(node.child,g);
    //     }
    //     return g;
    //     }
    //     return g;
    // }
}

export class LeafNode {
    type: string;
    vals: any[];
    name: string;
    alias: string;
    isSelected: boolean;

    constructor(obj: any = {} as LeafNode) {
        let {
            type,
            vals = [],
            name = '',
            alias = '',
            isSelected = false
        } = obj;

        this.type = type;
        this.vals = vals;
        this.name = name;
        this.alias = alias;
        this.isSelected = false;
    }

}
