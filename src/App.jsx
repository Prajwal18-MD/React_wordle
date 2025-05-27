import { useState, useEffect} from "react"
import './App.css'

const WORD_LENGTH = 5
const TOTAL_GUESSES = 6

function App() {
  const [guessedwords, setGuessedWords] = useState(new Array(TOTAL_GUESSES).fill("     "))
  const [correctword, setCorrectWord] = useState("")
  const [wordcount, setWordCount] = useState(0)
  const [lettercount, setLetterCount] = useState(0)
  
  // Getting Correct Word
  useEffect(()=>{
   setCorrectWord("Apple")
  },[])

  return (
    <div>
      {guessedwords.map((word, index) =>{
        return(
          <WordLine word={word} key={index}/>
        )
      })}      
    </div>
  )
}

function WordLine({word}){
  return(
    <div className="flex flex-row space-x-2 m-4">
      {word.split("").map((letter, index) =>{
        return(
          <LetterBox letter={letter} key={index}/>
        )
      })}

    </div>
  )
}

function LetterBox({letter}){
  return(
    <div className="w-24 h-24 border-4 border-black bg-white">
      {letter}
    </div>
  )
}

export default App
