import { useState, useEffect } from 'react'
import axios from 'axios';
import { Grid2, Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, LinearProgress } from '@mui/material';
function Game() {
  const BASE_URL = import.meta.env.BASE_URL;
  const alphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [word, setWord] = useState<string[]>([]);
  const [displayWord, setDisplayWord] = useState<string>("");
  const [guessCount, setGuessCount] = useState<number>(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [win, setWin] = useState<boolean>(false);
  const [loss, setLoss] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const gameOver = loss || win;

  useEffect(() => { 
    return () => {
      init()   
    }
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

  const init = async () => {
    setIsLoading(true)
    const response = await axios.get("https://random-word-api.herokuapp.com/word")
    let word: string[] = response.data[0].toUpperCase().split("")
    setWord(word)
    let temp = ""
    for(var letter of word) {
      if(alphabet.includes(letter)){
        temp += "_"
      }
      else {
        temp += letter
      }
    }
    setDisplayWord(temp)
    setIsLoading(false)
  }

  const restart = () => {
    setWin(false)
    setLoss(false)
    setGuessCount(0)
    setGuesses([])
    setDisplayWord("")
    init()
  }
  
  return (
    <>
      <Box 
        component="img"
        src={`${BASE_URL}${guessCount}.jpg`} 
        alt="Random"
        sx={{
        width: "300",
        maxWidth: 350,
        height: "auto",
        borderRadius: 2,
        boxShadow: 3,
        }}
      />
      <div>
      {isLoading ? ( <LinearProgress />) 
      : <h1 style={{letterSpacing: 5}}>{displayWord}</h1>       
      }
      </div>
      <div className="card">
        <Grid2 
        container 
        spacing={0.5}
        columns={13}
        >
        {alphabet.split("").map(letter => (
          <Grid2 size={{xs: 4, sm: 2, md: 1}}>
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
      <Dialog open={gameOver} >
        <DialogTitle align='center'>{win ? "Winner!" : "Loser"}</DialogTitle>
        <DialogContent>
          <Grid2 container>
            <Grid2 justifyItems={'center'} size={12} >
              <div style={{fontSize: 100}}>{win ? "🥳" : "💩"} </div>
            </Grid2>
          </Grid2>
          <DialogContentText>
            The word was <strong>{word.join("")}</strong>
          </DialogContentText>
        </DialogContent>
        <Button 
          onClick={restart}
          variant="contained"
          color="primary"
          fullWidth>
          Play again
        </Button>
      </Dialog>
    </>
  )
}
export default Game