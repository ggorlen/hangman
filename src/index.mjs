import readline from "readline";
import Hangman from "./hangman.mjs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

(async () => {
  const hangman = new Hangman();

  for (;;) {
    await hangman.newGame();

    while (hangman.isActive) {
      console.log("The word", hangman.hiddenWord);
      console.log("Guesses left", hangman.guesses);
      const letter = await prompt("Guess a letter: ");
      hangman.guess(letter);
    }
    
    console.log(`Game over! You ${hangman.isWon ? "won" : "lost"}`);
    console.log(`The word was ${hangman.revealedWord}`);
  }
})();
