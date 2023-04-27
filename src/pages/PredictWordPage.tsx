import {Component, createEffect, createSignal, onMount} from "solid-js";
import { NeuralNetwork } from "brain.js";
import { INeuralNetworkDatum, INeuralNetworkData } from "brain.js/dist/neural-network";

const PredictWordPage: Component = () => {
    let trainingData: INeuralNetworkDatum<Partial<INeuralNetworkData>, Partial<INeuralNetworkData>>[] = []
    const [inputValue, setInputValue] = createSignal("");
    const wordToIndex = new Map<string, number>();
    const indexToWord = new Map<number, string>();
    let nextPredictedWord = "";

    const getData = () => {
        const data = JSON.parse(sessionStorage.getItem("trainingData") ?? "[]");
        let index = 0;

        // Create dictionaries for words and their indices
        for (const word of data) {
            if (!wordToIndex.has(word)) {
                wordToIndex.set(word, index);
                indexToWord.set(index, word);
                index++;
            }
        }

        for (let i = 0; i < data.length - 1; i++) {
            const inputWord = data[i];
            const outputWord = data[i + 1];
            const inputIndex = wordToIndex.get(inputWord);
            const outputIndex = wordToIndex.get(outputWord);

            if (inputIndex !== undefined && outputIndex !== undefined) {
                const inputVector = Array.from({ length: wordToIndex.size }, (_, j) => (j === inputIndex ? 1 : 0));
                const outputVector = Array.from({ length: wordToIndex.size }, (_, j) => (j === outputIndex ? 1 : 0));
                trainingData.push({ input: inputVector, output: outputVector });
            }
        }
    };

    const net = new NeuralNetwork();

    const predictWord = (word: string) => {
        const inputIndex = wordToIndex.get(word);

        if (inputIndex === undefined) {
            console.log("Unknown word");
            return;
        }

        const inputVector:(1|0)[] = Array.from({ length: wordToIndex.size }, (_, j) => (j === inputIndex ? 1 : 0));
        const outputVector:number[] = net.run(inputVector) as number[];
        const maxIndex:number = outputVector.reduce((bestIndex, curr, i, arr) => (curr > arr[bestIndex] ? i : bestIndex), 0);
        const predictedWord:string = indexToWord.get(maxIndex)!;

        console.log(`Input: ${word}`);
        console.log(`Predicted word: ${predictedWord}`);
        nextPredictedWord = predictedWord;
        console.log(`predicted word: ${nextPredictedWord}`)
    };


    onMount(() => {
        getData();
        console.log(trainingData);
        console.log("Start page");

        if (trainingData.length > 0) {
            net.train(trainingData, {
                iterations: 1,
                errorThresh: 0.005,
                learningRate: 0.9,
                log: (stats) => console.log(stats),
            });
            // if (net.isRunnable) {
            //     predictWord("moon");
            // }
        }
    });


    const handleTextInput = (input: string) => {
        //after every space, train the network
        // if (input[input.length - 1] === " " && net.isRunnable) {
        //
        //     predictWord(input);
        // }
        predictWord(input);
    }

    createEffect(() => {
        handleTextInput(inputValue());
    });


    return (
        <>
            <textarea value={inputValue()}
                   onInput={(event) => {
                       const target = event.target as unknown as HTMLInputElement;
                       setInputValue(target.value);
                   }}
            />
            <div>{nextPredictedWord}</div>
        </>
    );
};

export default PredictWordPage;
