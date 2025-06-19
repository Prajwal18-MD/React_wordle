import { useState, useEffect} from "react"
import './App.css'

const WORD_LENGTH = 5
const TOTAL_GUESSES = 6

function App() {
  const [guessedwords, setGuessedWords] = useState(new Array(TOTAL_GUESSES).fill("     "))
  const [correctword, setCorrectWord] = useState("")
  const [wordcount, setWordCount] = useState(0)
  const [lettercount, setLetterCount] = useState(0)
  const [currentWord, setCurrentWord] = useState("     ")
  
  // Getting Correct Word
  useEffect(()=>{
   setCorrectWord("Apple")
  },[])

  function handleEnter (){
    if(lettercount !== WORD_LENGTH){
      alert("Words must be 5 letters")
      return
    }

    setGuessedWords((current) => {
      const updatedGuessedWords = [...current]
      updatedGuessedWords[wordcount] = currentWord
      return updatedGuessedWords

    })

    setWordCount(current => current + 1)
    setLetterCount(0)
    setCurrentWord("     ")

  }

  function handleBackspace (){
    if (lettercount === 0){
      return
    }

    setCurrentWord((currentWord) => {
      const currentWordArray = currentWord.split("")
      currentWordArray[lettercount - 1] = " "
      const newWord = currentWordArray.join("")
      return newWord
    })

    setLetterCount(currentCount => currentCount - 1)
    
  }

  function handleAplphabetical (key){
    if (lettercount === WORD_LENGTH){
      return
    }

    setCurrentWord((currentWord) => {
      const currentWordArray = currentWord.split("")
      currentWordArray[lettercount] = key
      const newWord = currentWordArray.join("")
      return newWord
    })

    setLetterCount(currentCount => currentCount + 1)
    
  }

  useEffect(() => {
  
  function handleKeyDown(e){
    if (e.key === "Enter"){
      handleEnter()

    } else if (e.key === "Backspace"){
      handleBackspace()
      
    } else if (/^[a-zA-Z]$/.test(e.key)){
      handleAplphabetical(e.key)

    } else {
      return
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  return () =>{document.removeEventListener('keydown',handleKeyDown)}
  },[handleEnter, handleBackspace, handleAplphabetical])

  useEffect(() => {
    console.log(currentWord)

  },[currentWord])

  return (
    <div>
      {guessedwords.map((word, index) =>{
        if (index === wordcount){
          return(
            <WordLine word={currentWord} key={index}/>
          )
        }
            
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
