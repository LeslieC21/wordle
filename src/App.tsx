import { useEffect, useState, useRef } from "react";

import Word from "./Word";
import type { LetterProp } from "./Letter";
import { getWord } from "./API/wordApi";
import type { KeyboardRef } from "./Keyboard";
import { Keyboard } from "./Keyboard";

export default function App() {
  const classMap = {
    0: " bg-[#121213]",
    1: " bg-[#3a3a3c]",
    2: " bg-[#b59f3b]",
    3: " bg-[#538d4e]",
  };

  const allowedGuesses = 6;
  const allowedWordLength = 5;
  const [selectedWord, setWord] = useState("");
  const [gameboard, setGameboard] = useState(createGameBoard());
  const [guessCount, setGuessCount] = useState(0);
  const [guessLetterCount, setLetterCount] = useState(0);
  const [gameOver, setPlayerWon] = useState({ gameOver: false, won: true });
  const keyboardRef = useRef<KeyboardRef>(null);

  function fetchNewWord() {
    getWord()
      .then((word) => {
        const wordToUpper = word.toUpperCase();
        setWord(wordToUpper);
      })
      .catch((error) => {
        console.error("Failed to fetch word", error);
      });
  }

  // function checkIfWord(word: string) {
  //   checkWord(word).then((valid) => {
  //     if(valid) {
  //       invalidWord = false;
  //     } else {
  //       invalidWord = true;
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Failed to check word", error)
  //   })
  // }

  useEffect(() => {
    fetchNewWord();
  }, []);

  function createGameBoard() {
    const gameboard: LetterProp[][] = Array.from(
      { length: allowedGuesses },
      () =>
        Array(allowedWordLength).fill({
          letter: "",
          guess: 0,
        }),
    );
    return gameboard;
  }

  function handleSubmit() {
    // Check if any letters are empty
    const gb = gameboard[guessCount];
    const emptyValues = gb.some((obj) => {
      if (obj.letter === "") return true;
    });

    if (!emptyValues) {
      const keyboardUpdates: Record<string, string> = {};

      for (let i = 0; i < selectedWord.length; i++) {
        const letter = gb[i].letter;
        if (letter === selectedWord[i]) {
          // Set the letter guessed value to 3
          setGameboard((prevGB) =>
            prevGB.map((row, rowIndex) =>
              rowIndex === guessCount
                ? row.map((col, colIndex) =>
                    colIndex === i ? { ...col, guess: 3 } : col,
                  )
                : row,
            ),
          );
          keyboardUpdates[letter] = classMap[3];
        } else if (selectedWord.indexOf(gb[i].letter) !== -1) {
          // Set the letter guessed value to 2
          setGameboard((prevGB) =>
            prevGB.map((row, rowIndex) =>
              rowIndex === guessCount
                ? row.map((col, colIndex) =>
                    colIndex === i ? { ...col, guess: 2 } : col,
                  )
                : row,
            ),
          );
          keyboardUpdates[letter] = classMap[2];
        } else {
          // Set the letter guessed value to 1
          setGameboard((prevGB) =>
            prevGB.map((row, rowIndex) =>
              rowIndex === guessCount
                ? row.map((col, colIndex) =>
                    colIndex === i ? { ...col, guess: 1 } : col,
                  )
                : row,
            ),
          );
          keyboardUpdates[letter] = classMap[1];
        }
      }

      keyboardRef.current?.updateKeyGuess(keyboardUpdates);

      // Check if the word we guessed was correct or ran out of guesses
      let playerWon = true;
      for (const [index, obj] of gb.entries()) {
        if (obj.letter !== selectedWord[index]) {
          playerWon = false;
          break;
        }
      }
      if (guessCount === allowedGuesses - 1)
        setPlayerWon({ gameOver: true, won: false });
      else if (playerWon) setPlayerWon({ gameOver: true, won: true });
      else setPlayerWon({ gameOver: false, won: false });

      setGuessCount((prevGuessCnt) =>
        prevGuessCnt === allowedGuesses ? prevGuessCnt : prevGuessCnt + 1,
      );
      setLetterCount(0);
    }
  }

  function keySelected(key: string) {
    const isLetter = /^[a-zA-Z]$/.test(key);
    if (isLetter) {
      setGameboard((prevGB) =>
        prevGB.map((row, rowIndex) =>
          rowIndex === guessCount
            ? row.map((col, colIndex) =>
                colIndex === guessLetterCount
                  ? { ...col, letter: key.toUpperCase() }
                  : col,
              )
            : row,
        ),
      );
      setLetterCount((prev) => (prev === allowedWordLength ? prev : prev + 1));
    } else if (key === "Enter") {
      handleSubmit();
    } else if (key === "Backspace") {
      setGameboard((prevGB) =>
        prevGB.map((row, rowIndex) =>
          rowIndex === guessCount
            ? row.map((col, colIndex) =>
                colIndex === guessLetterCount - 1
                  ? { ...col, letter: "" }
                  : col,
              )
            : row,
        ),
      );
      setLetterCount((prev) => (prev === 0 ? prev : prev - 1));
    }
  }

  function playAgain() {
    fetchNewWord();
    setGuessCount(0);
    setLetterCount(0);
    setPlayerWon({ gameOver: false, won: false });
    setGameboard(createGameBoard());
    keyboardRef.current?.playAgain();
  }

  const rowElements = gameboard.map((word) => {
    return <Word word={word} />;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (event.repeat) return;

      keySelected(key);
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [guessCount, guessLetterCount, gameboard, selectedWord]);

  return (
    <>
      <h1 className="text-[3em] m-[1em] flex items-center justify-center">
        WORDLE
      </h1>
      <main className="bg-[#121213] h-full w-full flex flex-col items-center">
        <div className="flex flex-col">{rowElements}</div>
        {!gameOver.gameOver ? (
          <div className="flex justify-center w-full mt-[3em]">
            <Keyboard ref={keyboardRef} onKeyDown={keySelected} />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <p className="flex">WORD: {selectedWord}</p>
            <button
              className="bg-[#3a3a3c] flex text=[1em] font-bold text-[#fff] mt-[8em] p-[1em]"
              onClick={playAgain}
            >
              Play Again
            </button>
          </div>
        )}
      </main>
    </>
  );
}
