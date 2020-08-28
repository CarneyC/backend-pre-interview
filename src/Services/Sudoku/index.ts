import * as Matrix from "../../Functions/Matrix";
import * as IO from "fp-ts/lib/IO";
import { pipe, toString } from "ramda";
import fs from "fs";
import path from "path";

// getSudokuMatrices :: IO [Matrix]
export const getSudokuMatrices: IO.IO<Matrix.Matrix[]> = () => {
  return pipe(
    (file) => path.join(__dirname, file),
    fs.readFileSync,
    toString,
    Matrix.parseMatrices
  )("Sudoku.txt");
};
