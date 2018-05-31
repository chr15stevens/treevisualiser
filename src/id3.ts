import * as _ from 'underscore';

/**
 * Tree algorithm base class.
 */
export abstract class TreeAlgorithm implements ITreeAlgorithm {
    abstract name: string;
    abstract description: string;
    features: string[];
    target: string;
    trainingData: object[];
    /**
     * The root leaf node and the first feature data is split on. Undefined until build is ran.
     */
    modelRoot: LeafNode;
    selectedNodes: LeafNode[] = [];
    /**
     * Builds your tree and sets the modelRoot value.
     */
    abstract build: () => void;
    
    constructor(trainingData: object[], target: string, features: string[]) {
        this.trainingData = trainingData;
        this.target = target;
        this.features = features;
    }

    predict = (testDatum: object) => {
        if (!this.modelRoot) throw new Error("You need to build a model before you can predict.");
        
        let currentNode = this.modelRoot;
        while(currentNode !== undefined && currentNode.type != 'result') {
            currentNode.isSelected = true;
            this.selectedNodes.push(currentNode);

            let testValue = testDatum[currentNode.name];
            let childNode = _.detect(currentNode.vals, (x: any) => { 
                return x.name == testValue
            });
            if (childNode) {
                childNode.isSelected = true;
                this.selectedNodes.push(childNode);
                currentNode = childNode.vals[0];
            } else{
                console.log(`Missing ${testValue} value in child node.`)
                currentNode = childNode;
            }
        }

        if (currentNode){
            currentNode.isSelected = true;
            this.selectedNodes.push(currentNode);
            return currentNode.vals;
        }
        return [];
    };

    deselectAllNodes = () => {
        this.selectedNodes.forEach(node => {
            node.isSelected = false;
        });
        this.selectedNodes = [];
    }

    calcPercentageAccuracy = (testData: object[]): number => {
        let total = 0;
        let correct = 0;
        _.each(testData, testDatum => {
            total++;
            let pred = this.predict(testDatum);
            let actual = testDatum[this.target];
            if(pred == actual){
                correct++;
            }
        });
        this.deselectAllNodes();

        return (correct/total) * 100;
    }

    randomTag = (): string => {
        return "_r" + Math.round(Math.random()*1000000).toString();
    }
}

export class ID3 extends TreeAlgorithm {
    name: string = 'ID3';
    description: string = '';
    modelRoot: LeafNode;

    constructor(trainingData: object[], target: string, features: string[]) {
        super(trainingData, target, features);
    }

    build = () => {
        let targets = _.unique(_.pluck(this.trainingData, this.target));

        if (targets.length == 1) {
            console.log(`The target variable \'${targets[0]}\' only has one answer left therefore this is a terminal node!`);

            this.modelRoot = new LeafNode({
                type: "result",
                vals: [targets[0]],
                name: targets[0],
                alias: targets[0] + this.randomTag()
            });

            return;
        }

        if (this.features.length == 0) {
            console.log("0 features left for branch so taking most common target.");
            let mostCommonTarget = MathHelper.mostCommon(_.pluck(this.trainingData, this.target));
            this.modelRoot = new LeafNode({
                type:"result",
                vals: [],
                name: mostCommonTarget,
                alias: mostCommonTarget + this.randomTag()
            });

            return;
        }

        let bestFeature = MathHelper.maxGain(this.trainingData, this.target, this.features);
        let remainingFeatures = _.without(this.features, bestFeature);
        let possibleValues = _.unique(_.pluck(this.trainingData, bestFeature));

        console.log("Building node for the best feature " + bestFeature);
        this.modelRoot = new LeafNode({
            name: bestFeature,
            alias: bestFeature + this.randomTag(),
            type: "feature",
            vals: _.map(possibleValues, possibleValue => {
                console.log("Creating a branch for " + possibleValue);
                let _newS = this.trainingData.filter(x => { return x[bestFeature] == possibleValue; });

                let id3 = new ID3(_newS, this.target, remainingFeatures);
                id3.build();
                return new LeafNode({
                    name: possibleValue,
                    alias: possibleValue + this.randomTag(),
                    type: "feature_value",
                    vals:  [id3.modelRoot]
                });
            })
        });
    };
}

export class C45 extends TreeAlgorithm {
    name = 'C4.5';
    description: string = '';
    features: string[];
    target: string;
    trainingData: object[];
    modelRoot: LeafNode;
    selectedNodes: LeafNode[] = [];

    constructor(trainingData: object[], target: string, features: string[]) {
        super(trainingData, target, features);
    }

    build = () => {
        let targets = _.unique(_.pluck(this.trainingData, this.target));

        if (targets.length == 1) {
            console.log(`The target variable \'${targets[0]}\' only has one answer left therefore this is a terminal node!`);

            this.modelRoot = new LeafNode({
                type: "result",
                vals: [targets[0]],
                name: targets[0],
                alias: targets[0] + this.randomTag()
            });

            return;
        }

        if (this.features.length == 0) {
            console.log("0 features left for branch so taking most common target.");
            let mostCommonTarget = MathHelper.mostCommon(_.pluck(this.trainingData, this.target));
            this.modelRoot = new LeafNode({
                type:"result",
                vals: [],
                name: mostCommonTarget,
                alias: mostCommonTarget + this.randomTag()
            });

            return;
        }

        let bestFeature = MathHelper.maxGainRatio(this.trainingData, this.target, this.features);
        let remainingFeatures = _.without(this.features, bestFeature);
        let possibleValues = _.unique(_.pluck(this.trainingData, bestFeature));

        console.log("Building node for the best feature " + bestFeature);
        this.modelRoot = new LeafNode({
            name: bestFeature,
            alias: bestFeature + this.randomTag(),
            type: "feature",
            vals: _.map(possibleValues, possibleValue => {
                console.log("Creating a branch for " + possibleValue);
                let _newS = this.trainingData.filter(x => { return x[bestFeature] == possibleValue; });

                let childModel = new C45(_newS, this.target, remainingFeatures);
                childModel.build();
                return new LeafNode({
                    name: possibleValue,
                    alias: possibleValue + this.randomTag(),
                    type: "feature_value",
                    vals:  [childModel.modelRoot]
                });
            })
        });
    };
}

export interface ITreeAlgorithm {
    name: string;
    description: string;
    /**
     * The root leaf node and the first feature data is split on. Undefined until build is ran.
     */
    modelRoot: LeafNode;

    selectedNodes: LeafNode[];
    /**
     * Builds your tree and sets the modelRoot value.
     */
    build: () => void;
    predict: (testDatum: object) => any[];
    calcPercentageAccuracy: (testData: object[]) => number;
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

class MathHelper {
    /**
     * Finds the feature with the maximum gain ratio.
     */
    static maxGainRatio = (dataset: object[], target: string, features: string[]): string => {
        return _.max(features, feature => {
            return MathHelper.gainRatio(dataset, target, feature)
        });
    }

    /**
     * Calculates the gain ration for a given feature
     */
    static gainRatio = (dataset: object[], targetProperty: string, feature: string) => {
        return MathHelper.informationGain(dataset, targetProperty, feature) / 
            MathHelper.splitInformation(dataset, feature);
    }

    /**
     * Calculates the split information for the given feature
     */
    static splitInformation = (dataset: object[], feature: string): number => {
        let featureValues = _.unique(_.pluck(dataset, feature));

        let splitInfos = featureValues.map(n => {
            let featureValuesSubset = dataset.filter( (x) => { return x[feature] === n; });
            return (featureValuesSubset.length/dataset.length) * MathHelper.log2(featureValuesSubset.length/dataset.length);
        });

        return (-1) * MathHelper.sum(splitInfos);
    }

    /**
     * Finds the feature with the maximum gain.
     */
    static maxGain = (dataset: object[], target: string, features: string[]): string => {
        return _.max(features, feature => {
            return MathHelper.informationGain(dataset, target, feature)
        });
    }

    /**
     * Calculates the information gain of a feature.
     */
    static informationGain = (dataset: object[], targetProperty: string, feature: string): number => {
        let featureValues = _.unique(_.pluck(dataset, feature));
        let setEntropy = MathHelper.entropy(_.pluck(dataset, targetProperty));

        let entropies = featureValues.map(n => {
            let featureValuesSubset = dataset.filter( (x) => { return x[feature] === n; });
            return (featureValuesSubset.length/dataset.length) * MathHelper.entropy(_.pluck(featureValuesSubset, targetProperty));
        });
        let sumOfEntropies = MathHelper.sum(entropies);
        return setEntropy - sumOfEntropies;
    }

    /**
     * Calculates the entropy of a set of property values.
     */
    static entropy = (propertyValues: any[]): number => {
        let uniqueVals = _.unique(propertyValues);
        let valueProbabilities = uniqueVals.map( uniquePropertyVal => { return MathHelper.probability(uniquePropertyVal, propertyValues); });
        let logVals = valueProbabilities.map( p => { return -p * MathHelper.log2(p); });
        return MathHelper.sum(logVals);
    };

    /**
     * Given a value and an array, calculates the probability of occurences in that array.
     */
    static probability = (propertyVal: any, allPropertyValues: any[]) => {
        let countPropertyValues = _.filter(allPropertyValues, x => { return x === propertyVal; }).length;
        return countPropertyValues / allPropertyValues.length;
    }

    static log2 = (n): number => {
        return Math.log(n)/Math.log(2);
    }

    /**
     * Given a list of values returns the most common one in the list.
     */
    static mostCommon = (values: string[]): string => {
        return _.sortBy( values, a => {
            return MathHelper.count(a, values);
        }).reverse()[0];
    }

    /**
     * Counts the number of times a value appears in an array 
     */
    static count = (value, valuesArray): number => {
        return _.filter(valuesArray, b => { return b === value; }).length
    }

    /**
     * Sums an array of numbers
     */
    static sum = (array: number[]): number => {
        return array.reduce( (a, b) => { return a + b; }, 0)
    }
}
