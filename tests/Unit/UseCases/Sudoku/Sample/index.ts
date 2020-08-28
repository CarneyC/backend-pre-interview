import { Matrix, parseMatrix } from "../../../../../src/Functions/Matrix";
import * as IO from "fp-ts/lib/IO";
import { pipe, toString } from "ramda";
import fs from "fs";
import path from "path";

export const getSudokuMatrix: IO.IO<Matrix> = () => {
  return pipe(
    (file) => path.join(__dirname, file),
    fs.readFileSync,
    toString,
    parseMatrix
  )("Sudoku.txt");
};

export const getSudokuMatrixSolution: IO.IO<Matrix> = () => {
  return pipe(
    (file) => path.join(__dirname, file),
    fs.readFileSync,
    toString,
    parseMatrix
  )("Solution.txt");
};
