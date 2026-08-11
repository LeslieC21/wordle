import { useEffect, useState } from "react";
import Word from "./Word"
import type { LetterProp } from "./Letter";

export default function App() {
  const avaliableWords = [ "TABLE", "CHAIR" ];
  const [selectedWord, setWord] = useState(selectWord())

  const allowedGuesses = 6;
  const wordLength = selectedWord.length;
  const [gameboard, setGameboard] = useState(createGameBoard())
  const [guessCount, setGuessCount] = useState(0);
  const [guessLetterCount, setLetterCount] = useState(0);
  const [playerWon, setPlayerWon] = useState(false);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if(event.repeat) return;

      const isLetter = /^[a-zA-Z]$/.test(key);
      if (isLetter) {
        setGameboard((prevGB) =>
          prevGB.map((row, rowIndex) =>
            rowIndex === guessCount
              ? row.map((col, colIndex) => (colIndex === guessLetterCount ? { ...col, letter: key.toUpperCase()}: col))
              : row
          )
        );

        setLetterCount((prev) => prev + 1);
      } else if (key === "Enter") {
        // Check if any letters are empty
        const gb = gameboard[guessCount];
        const emptyValues = gb.some(obj => {
          if(obj.letter === "")
            return true;
        })

        if(!emptyValues) {
          for(let i=0; i < selectedWord.length; i++) {
            if(gb[i].letter === selectedWord[i]) {
              // Set the letter guessed value to 2
              setGameboard((prevGB) =>
                prevGB.map((row, rowIndex) =>
                  rowIndex === guessCount
                    ? row.map((col, colIndex) => 
                      (colIndex === i 
                        ? { ...col, guess: 3}
                        : col))
                    : row
                )
              );
            } else if (selectedWord.indexOf(gb[i].letter) !== -1){
              // Set the letter guessed value to 1
              setGameboard((prevGB) =>
                prevGB.map((row, rowIndex) =>
                  rowIndex === guessCount
                    ? row.map((col, colIndex) => 
                      (colIndex === i 
                        ? { ...col, guess: 2}
                        : col))
                    : row
                )
              );
            } else {
              // Set the letter guessed value to 0
              setGameboard((prevGB) =>
                prevGB.map((row, rowIndex) =>
                  rowIndex === guessCount
                    ? row.map((col, colIndex) => 
                      (colIndex === i 
                        ? { ...col, guess: 1}
                        : col))
                    : row
                )
              );
            }
          }
          // Check if the word we guessed was correct
          let playerWon = true;
          for(const [index, obj] of gb.entries()) {
            if(obj.letter !== selectedWord[index]) {
              playerWon = false
              break;
            }
          }
          setPlayerWon(playerWon);

          setGuessCount(prevGuessCnt => prevGuessCnt + 1);
          setLetterCount(0);
      }
      } else if (key === "Backspace") {
        setGameboard((prevGB) =>
          prevGB.map((row, rowIndex) =>
            rowIndex === guessCount
              ? row.map((col, colIndex) => (colIndex === (guessLetterCount - 1) ? { ...col, letter: ""}: col))
              : row
          )
        );

        setLetterCount((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [guessCount, guessLetterCount, gameboard, selectedWord])

  
  function createGameBoard() {
    const gameboard: LetterProp[][] = Array.from({ length: allowedGuesses}, () => Array(wordLength).fill({
      letter: "",
      guess: 0
    }));
    return gameboard;
  }

  function selectWord() {
    // Get a random index
    const selectedWordIndex = Math.floor(Math.random() * (avaliableWords.length));
    const selectedWord = avaliableWords[selectedWordIndex];

    return selectedWord;
  }

  function playAgain() {
    setWord(selectWord());
  }

  const rowElements = gameboard.map(
    word => {
      return <Word word={word} />
    }
  )
  
  return (
    <main className="bg-[#121213]">
      <div className="flex flex-col m-auto">
        {rowElements}
      </div>
      { 
      playerWon ? 
        <button className="bg-[#3a3a3c] flex items-center justify-center text=[1em] font-bold text-[#fff] m-[2px] p-[.8em]" onClick={playAgain}>Play Again</button> : <></>
      }
    </main>
  )
}