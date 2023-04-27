import {Component, createEffect, createSignal} from "solid-js";
import { render } from "solid-js/web";

const SaveWordsPage: Component = () => {
    const [inputValue, setInputValue] = createSignal("");
    const currentGivenInput: string[] = [];

    const logWords = () => {
        console.log(currentGivenInput);
    };

    const  setTrainingData = () => {
        // sessionStorage.setItem("trainingData", JSON.stringify(currentGivenInput));
        let data:string[] = []
        fetch("https://raw.githubusercontent.com/powerlanguage/word-lists/master/1000-most-common-words.txt")
            .then(response => response.text())
            .then(dataFromSource => {
                console.log(dataFromSource);
                const words:string[] = dataFromSource.split("\n");
                const randomWords:string[] = [];
                for (let i = 0; i < 1000; i++) {
                    randomWords.push(words[Math.floor(Math.random() * words.length)]);
                }
                data = randomWords;
                sessionStorage.setItem("trainingData", JSON.stringify(data));
            });
    }

    const handleTextInput = (input: string) => {
        let words: string[] = [];
        let currentWord = "";

        for (let i = 0; i < input.length; i++) {
            if (input[i] === " ") {
                words.push(currentWord);
                currentWord = "";
            } else {
                currentWord += input[i];
            }
        }
        words.push(currentWord);

        currentGivenInput.length = 0;
        currentGivenInput.push(...words);

        console.log(currentGivenInput);
    };

    createEffect(() => {
        handleTextInput(inputValue());
    });



    return (
        <>
      <textarea
          value={inputValue()}
          onInput={(event) => {
              const target = event.target as unknown as HTMLInputElement;
              setInputValue(target.value);
          }}
      ></textarea>
            <button onClick={() => logWords()}>log</button>
            <button onClick={() => setTrainingData()}>set</button>
        </>
    );
};
export default SaveWordsPage;
