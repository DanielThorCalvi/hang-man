import './App.css'
import { useState, useEffect } from 'react'
import { Grid2, Button, Box } from '@mui/material';

function App() {
  const alphabet: string = "ABCDEÉFGHIÍJKLMNOÓPQRSTUÚVWXYÝZÞÆÖ"
  const wordString: string = "DOG"
  const [word, _] = useState<string[]>(wordString.split(""))
  const [displayWord, setDisplayWord] = useState<string>("")
  const [guessCount, setGuessCount] = useState<number>(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [win, setWin] = useState<boolean>(false);
  const [loss, setLoss] = useState<boolean>(false);

  useEffect(() => {
    let temp = ""
    word.forEach(letter => {
      if(alphabet.includes(letter)){
        temp += "_"
      }
      else {
        temp += letter
      }
    })
    setDisplayWord(temp)
    return () => {
      console.log("Component unmounted!");
    };
  }, []);

  useEffect(() => {
    if(guessCount === 6){
      setLoss(true)
    }
  }, [guessCount])

  const handleGuess = (letter: string) => {
    if(loss || win) return; 
    if(!guesses.includes(letter)) { 
      setGuesses((prevGuesses) => [...prevGuesses, letter])   
      if(word.includes(letter)) {
        showLetter(letter)       
      }
      else{
        setGuessCount(guessCount + 1)       
      }
    }
  }

  const showLetter = (letter: string) => {
    let temp = displayWord.split("")
    word.forEach((l, i) => {
      if (l === letter) {
        temp[i]= letter
      }
    });
    setDisplayWord(temp.join(""))
    console.log(temp, word)
    if(word.join("") === temp.join("")){
      setWin(true)
    }
  }
  
  return (  
    <>
      <h1>Hengimann</h1>
      {win && <h2>Þú vannst! 🥳</h2>}
      {loss && <h2>Þú tapaðir! 💩</h2>}
      <Box 
        component="img"
        src={`/${guessCount}.jpg`} 
        alt="Random"
        sx={{
          width: "100%",
          maxWidth: 500,
          height: "auto",
          borderRadius: 2,
          boxShadow: 3,
        }}
      />
      <h2 style={{letterSpacing: 5}}>{displayWord}</h2>
      <h1>{guessCount}</h1>
      <div className="card">
        <Grid2 
          container 
          spacing={1}
        >
        {alphabet.split("").map(letter => (
          <Grid2>
            <Button 
              variant="contained"
              color="primary"
              fullWidth
              disabled={guesses.includes(letter)}
              onClick={() => handleGuess(letter)}
            >
              {letter}
            </Button>
          </Grid2>
        ))}
        </Grid2>
      </div>
    </>
  )
}

export default App
