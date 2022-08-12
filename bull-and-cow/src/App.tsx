import React from 'react';
import { useState } from 'react';
import './App.css';

function App() {
  const digitsAvailable:string = "0123456789";
  const [userOneSecretCode, setUserOneSecretCode] = useState("");
  const [userTwoSecretCode, setUserTwoSecretCode] = useState("");
  let userOneName:string = "userOne", userTwoName:string = "AI";
  const [secretCodeSet, setSecretCodeSet] = useState<boolean>(false);
  const [userOneInput, setUserOneInput] = useState("");
  const [userOneGuessArray, updateUserOneGuessArray] = useState<string[]>([]);
  const [userTwoGuessArray, updateUserTwoGuessArray] = useState<string[]>([]);
  const [userOneResultArray, updateUserOneResultArray] = useState<[number,number][]>([]);
  const [userTwoResultArray, updateUserTwoResultArray] = useState<[number,number][]>([]);
  const [userOneWin, setUserOneWin] = useState<boolean>(false);
  const [userTwoWin, setUserTwoWin] = useState<boolean>(false);

  return (
    <div id="game-zone">
      <div id="user-one-result">
        <h3>Player one:</h3>
        {displayResult(userOneGuessArray, userOneResultArray)}
      </div>
      <div id="user-two-result">
        <h3>AI:</h3>
        {displayResult(userTwoGuessArray, userTwoResultArray)}
      </div>

      <div id="input-and-instruction">
      {userOneWin || userTwoWin ? (
        <div id="game-result">
          {userOneWin ? (<h3>You Win!</h3>) : (<h3>AI Win!</h3>)}
        </div>
      ) : (
        <div id="user-input-zone">
        {!secretCodeSet ? (<h3>Please enter your secret code to start: </h3>) 
          : (<h3>Please enter your guess code: </h3>)}
        
        <input type="text" id='user-one-input' 
          value={userOneInput}
          onChange={e => {setUserOneInput(e.target.value)}} /> <br />

        {inputCheck(userOneInput) ? (
          <button onClick={() => {
            if (!secretCodeSet) {
              setUserOneSecretCode(userOneInput);
              setUserTwoSecretCode(generateAiCode(digitsAvailable));
              setSecretCodeSet(true);
            } else {
              updateUserOneGuessArray([...userOneGuessArray, userOneInput]);
              calcResult(userOneName, userOneInput);

              let userTwoGuessCode = aiGuessCode();
              updateUserTwoGuessArray([...userTwoGuessArray, userTwoGuessCode]);
              calcResult(userTwoName, userTwoGuessCode);
            }
            setUserOneInput("");
          }}>Done</button>
        ) : (
          <p>Please enter four different digits.</p>
        )}
        </div>
      )}
      <div id="instruction">
        <h3>Instructions</h3>
        <p>Choose four different digits from 0-9 as your secret code. <br />
        Try to guess another player's code. <br />
        Bulls = correct code, correct position. <br />
        Cows = correct code, wrong position. <br />
        Try to beat my AI =.=</p>
      </div>
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
          count++;
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

  function generateAiCode(digitsSource:string) {
    let result = "";
    for (let i = 0; i < 4; i++) {
      const element = digitsSource.charAt(Math.random() * (digitsSource.length - i));
      result += element;
      digitsSource = digitsSource.replace(element,'');
    }
    return result;
  }

  function aiGuessCode() {
    let digitsSource = digitsAvailable;
    let result:string = "";
    // narrow down the guess source if possible
    for (let i = 0; i < userTwoResultArray.length; i++) {
      if (userTwoResultArray[i][0] === 0 && userTwoResultArray[i][1] === 0) {
        for (let index = 0; index < 4; index++) {
          digitsSource = digitsSource.replace(userTwoGuessArray[i][index],'');
        }
      } else if (userTwoResultArray[i][0] + userTwoResultArray[i][1] === 4) {
        digitsSource = userTwoGuessArray[i];
      }
    }

    let flag = false;
    while (!flag) {
      let count = 0;
      result = generateAiCode(digitsSource);
      for (let i = 0; i < userTwoResultArray.length; i++) {
        let checkBullCount = 0;
        let checkCowCount = 0;
        for (let index = 0; index < 4; index++) {
          if (result.charAt(index) === userTwoGuessArray[i].charAt(index)) {
            checkBullCount++;
          }
          if (userTwoGuessArray[i].includes(result.charAt(index)) 
            && (index !== userTwoGuessArray[i].indexOf(result.charAt(index)))) {
            checkCowCount++;
          }
        }
        
        if (checkBullCount === userTwoResultArray[i][0] 
          && (checkCowCount === userTwoResultArray[i][1])) {
            count++;
        } else {
          break;
        }
      }

      if (count === userTwoResultArray.length) {
        flag = true;
      }
    }
    return result;
  }

  function calcResult(userName:string, inputCode:string) {
    let bullCount:number = 0;
    let cowCount:number = 0;
    
    if (userName === "userOne") {
      for (let i = 0; i < 4; i++) {
        if (inputCode.charAt(i) === userTwoSecretCode.charAt(i)) {
          bullCount++;
        }
        if (userTwoSecretCode.includes(inputCode.charAt(i)) 
        && (i!==userTwoSecretCode.indexOf(inputCode.charAt(i)))) {
          cowCount++;
        }
      }
      updateUserOneResultArray([...userOneResultArray,[bullCount,cowCount]]);
    } else {
      for (let i = 0; i < 4; i++) {
        if (inputCode.charAt(i) === userOneSecretCode.charAt(i)) {
          bullCount++;
        }
        if (userOneSecretCode.includes(inputCode.charAt(i)) 
        && (i!==userOneSecretCode.indexOf(inputCode.charAt(i)))) {
          cowCount++;
        }
      }
      updateUserTwoResultArray([...userTwoResultArray,[bullCount,cowCount]]);
    }
    if (bullCount === 4) {
      userName === "userOne" ? setUserOneWin(true) : setUserTwoWin(true);
    }
  }

  function displayResult(userGuessArray:string[], userGuessResult:[number,number][]) {
    const roundResult = userGuessArray.map((guessCode,index) => {
      return (
      <li key={index}>
        Round {index+1}: <br />
        Guess code: {guessCode} <br />
        Bull: {userGuessResult[index][0]}; Cow: {userGuessResult[index][1]} <br />
      </li>)
    })
    return (<ul>{roundResult}</ul>);
  }
}

export default App;