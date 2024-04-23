/**
 * Represents a Hangman word guessing game.
 */
export default class Hangman {
  /**
   * The URL of the API used to fetch words.
   * @type {string}
   */
  #apiUrl = "https://random-word-api.herokuapp.com/word";

  /**
   * The character used to represent a blank space in the hidden word.
   * @type {string}
   */
  #blankSpace = "_";

  /**
   * The number of extra attempts allowed in the game.
   * @type {number}
   */
  #extraAttempts = 5;

  /**
   * The array of words to choose from.
   * @type {string[]}
   */
  #words = [];

  /**
   * The number of guesses left.
   * @type {number}
   */
  #guesses = 0;

  /**
   * The current word being guessed.
   * @type {string[]}
   */
  #word = [];

  /**
   * The hidden representation of the word being guessed.
   * @type {string[]}
   */
  #hiddenWord = [];

  /**
   * Constructs a new Hangman instance.
   */
  constructor() {}

  /**
   * Fetches words if necessary and initializes game state.
   * @throws {Error} If fetching fails.
   */
  async newGame() {
    if (this.#words.length === 0) {
      this.#words = await this.#fetchWords();
    }

    this.#word = [...(this.#words.pop() ?? [])];
    this.#guesses = this.#word.length + this.#extraAttempts;
    this.#hiddenWord = [...this.#blankSpace.repeat(this.#word.length)];
  }

  /**
   * Returns the revealed word after the game is over.
   * @returns {string} The revealed word.
   * @throws {Error} If called with an active game.
   */
  get revealedWord() {
    if (this.isActive) {
      throw new Error("Cannot show the hidden word until the game is over");
    }

    return this.#word.join("");
  }

  /**
   * Returns the hidden word. Letters the player has guessed so far
   * are displayed; the rest of the letters are hidden.
   * @returns {string} The partially or fully hidden word.
   */
  get hiddenWord() {
    return this.#hiddenWord.join("");
  }

  /**
   * Returns whether the game is won. A game is considered won if the
   * player has revealed all letters in the word.
   * @returns {boolean} True if the game is won, false otherwise.
   */
  get isWon() {
    return this.#hiddenWord.every((e) => e !== this.#blankSpace);
  }

  /**
   * Returns whether the game is lost. A game is considered lost if the
   * player has exhausted their guesses and there are still unrevealed letters.
   * @returns {boolean} True if the game is lost, false otherwise.
   */
  get isLost() {
    return (
      this.#guesses <= 0 && this.#hiddenWord.some((e) => e === this.#blankSpace)
    );
  }

  /**
   * Returns whether the game is active. An active game has
   * a word selected and is not lost or won.
   * @returns {boolean} True if the game is active, false otherwise.
   */
  get isActive() {
    return this.hiddenWord.length > 0 && !this.isWon && !this.isLost;
  }

  /**
   * Returns the number of guesses.
   * @returns {number} The number of guesses.
   */
  get guesses() {
    return this.#guesses;
  }

  /**
   * Guesses a letter. All matching locations (if there are any)
   * for the letter in the hidden word will be revealed.
   * @param {string} letter - The letter to guess.
   * @returns {boolean} True if the guess was correct, false otherwise.
   * @throws {Error} If the player has no guesses remaining.
   */
  guess(letter) {
    if (this.#guesses <= 0) {
      throw new Error("No guesses remaining");
    }

    this.#word.forEach((e, i) => {
      if (e === letter) {
        this.#hiddenWord[i] = e;
      }
    });

    if (this.#hiddenWord.includes(letter)) {
      return false;
    }

    this.#guesses--;
    return true;
  }

  /**
   * Fetches n random words from a word API.
   * @param {number} [n=100] - The number of words to pull.
   * @returns {Promise<string[]>} A promise resolving to an array of words.
   * @throws {Error} If word fetching fails.
   */
  async #fetchWords(n = 100) {
    const response = await fetch(`${this.#apiUrl}?number=${n}`);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  }
}
