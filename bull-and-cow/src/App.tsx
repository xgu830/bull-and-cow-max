import React from 'react';
import { useState } from 'react';
import './App.css';

function App() {
  const digitsAvailable:string = "0123456789";
  let userOneSecretCode:string, userTwoSecretCode:string;
  const [secretCodeSet, setSecretCodeSet] = useState<boolean>(false);
  const [userOneInput, setUserOneInput] = useState("");
  const [userTwoInput, setUserTwoInput] = useState("");
  const [userOneGuessArray, updateUserOneGuessArray] = useState<string[]>([]);
  const [userTwoGuessArray, updateUserTwoGuessArray] = useState<string[]>([]);

  return (
    <div>
      <div id="user-one-result">
        <p>{userOneInput}</p>
        
      </div>
      <div id="user-two-result"></div>
      <div id="user-input-zone">
        
        {!secretCodeSet ? (
          <h3>Please enter your secret code to start: </h3>) 
          : (
          <h3>Please enter your guess code: </h3>
        )}
        
        <input type="text" className='user-one-code' onChange={e => setUserOneInput(e.target.value)} /> <br />
        {inputCheck(userOneInput) ? (
          <button onClick={() => {
            if (!secretCodeSet) {
              userOneSecretCode = userOneInput;
              setSecretCodeSet(true);
            } else {
              updateUserOneGuessArray([...userOneGuessArray, userOneInput]);
            }
          }}>Done</button>
        ) : (
          <p>Please enter four different digits.</p>
        )}
      </div>
    </div>
  );

  function inputCheck(code:string) {
    let checkingDigits = digitsAvailable;
    let count = 0;
    if (code.length === 4) {
      for (let i = 0; i < 4; i++) {
        const element = code.charAt(i);

        if (checkingDigits.includes(element)) {
          checkingDigits = checkingDigits.replace(element,'');
          //console.log(checkingDigits);
          count++;
          console.log(count);
        } else {
          return false;
        }
      }

      if (count === 4) {
        return true;
      }
    } else {
      return false;
    }
  }

  function calcResult() {
    console.log(111);
  }
}

export default App;
