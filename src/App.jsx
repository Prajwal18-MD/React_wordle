import { useState, useEffect } from "react";
import axios from "axios";

const WORD_LENGTH = 5;
const TOTAL_GUESSES = 6;

function App() {
  const [guessedWords, setGuessedWords] = useState(
    new Array(TOTAL_GUESSES).fill("     ")
  );
  const [correctWord, setCorrectWord] = useState("");
  const [correctLetterObject, setCorrectLetterObject] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [currentWord, setCurrentWord] = useState("     ");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // fetch a random 5‑letter word
  async function fetchWord() {
    const response = await axios.get(
      "https://api.datamuse.com/words?sp=?????&max=1000"
    );
    const words = response.data.map((w) => w.word).filter((w) => w.length === 5);
    const word = words[Math.floor(Math.random() * words.length)].toLowerCase();

    // build frequency map
    const freq = {};
    for (let l of word) freq[l] = (freq[l] || 0) + 1;

    setCorrectWord(word);
    setCorrectLetterObject(freq);
  }

  // on mount
  useEffect(() => {
    fetchWord();
  }, []);

  function handleEnter() {
    if (letterCount !== WORD_LENGTH) {
      alert("Words must be 5 letters");
      return;
    }

    // check win/loss
    if (currentWord === correctWord) {
      setGameOver(true);
      setWon(true);
      return;
    }
    if (wordCount === TOTAL_GUESSES - 1) {
      setGameOver(true);
      setWon(false);
      return;
    }

    // commit the guess
    setGuessedWords((cur) => {
      const upd = [...cur];
      upd[wordCount] = currentWord;
      return upd;
    });
    setWordCount((c) => c + 1);
    setLetterCount(0);
    setCurrentWord("     ");
  }

  function handleBackspace() {
    if (!letterCount) return;
    setCurrentWord((cur) => {
      const arr = cur.split("");
      arr[letterCount - 1] = " ";
      return arr.join("");
    });
    setLetterCount((c) => c - 1);
  }

  function handleAlphabetical(key) {
    if (letterCount === WORD_LENGTH) return;
    setCurrentWord((cur) => {
      const arr = cur.split("");
      arr[letterCount] = key.toLowerCase();
      return arr.join("");
    });
    setLetterCount((c) => c + 1);
  }

  // keyboard listener
  useEffect(() => {
    function onKey(e) {
      if (gameOver) return;
      if (e.key === "Enter") handleEnter();
      else if (e.key === "Backspace") handleBackspace();
      else if (/^[a-zA-Z]$/.test(e.key)) handleAlphabetical(e.key);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [currentWord, letterCount, gameOver]);

  function resetGame() {
    setGuessedWords(new Array(TOTAL_GUESSES).fill("     "));
    setWordCount(0);
    setLetterCount(0);
    setCurrentWord("     ");
    setGameOver(false);
    setWon(false);
    fetchWord();
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-extrabold text-white mb-8">WORDLE</h1>

      {/* board */}
      <div className="space-y-2">
        {guessedWords.map((w, i) => {
          const isActive = i === wordCount && !gameOver;
          return (
            <WordLine
              key={i}
              word={isActive ? currentWord : w}
              correctWord={correctWord}
              correctLetterObject={correctLetterObject}
              revealed={i < wordCount || gameOver}
            />
          );
        })}
      </div>

      {/* reset */}
      <button
        onClick={resetGame}
        className="mt-8 px-6 py-3 border-2 border-white text-white text-xl rounded-lg hover:bg-white hover:text-black transition"
      >
        RESET GAME
      </button>

      {/* loss overlay */}
      {gameOver && !won && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center space-y-4 max-w-xs">
            <p className="text-2xl font-bold">You Lost!</p>
            <p className="text-xl">
              The word was{" "}
              <span className="font-mono text-green-600">{correctWord}</span>
            </p>
            <button
              onClick={resetGame}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* win overlay */}
      {gameOver && won && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center space-y-4 max-w-xs">
            <p className="text-2xl font-bold text-green-600">You Won! 🎉</p>
            <button
              onClick={resetGame}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function WordLine({ word, correctWord, correctLetterObject, revealed }) {
  return (
    <div className="flex space-x-2">
      {word.split("").map((l, idx) => {
        const correctPos = l === correctWord[idx];
        const existsElsewhere = correctWord.includes(l);
        return (
          <LetterBox
            key={idx}
            letter={l}
            green={revealed && correctPos}
            yellow={revealed && !correctPos && existsElsewhere}
          />
        );
      })}
    </div>
  );
}

function LetterBox({ letter, green, yellow }) {
  const bg = green
    ? "bg-green-500"
    : yellow
    ? "bg-yellow-500"
    : "bg-gray-900";
  return (
    <div
      className={`${bg} w-16 h-16 sm:w-20 sm:h-20 border-4 border-gray-700 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white`}
    >
      {letter}
    </div>
  );
}

export default App;
