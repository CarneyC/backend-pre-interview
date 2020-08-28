import { displaySumOfSudoku } from "./Services/Sudoku";

const sudokuConfig = {
  gridSize: 9,
  numberOfValues: 9,
  sumSize: 3,
};

displaySumOfSudoku(sudokuConfig)().then(console.log);
