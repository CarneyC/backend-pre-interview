import * as LinkReducer from "./LinkReducer";
import * as CoverMatrix from "../Functions/CoverMatrix";
import * as Matrix from "../Functions/Matrix";
import * as MatrixLink from "../Functions/MatrixLink";
import * as R from "fp-ts/lib/Reader";
import * as RE from "fp-ts/lib/ReaderEither";
import { head, pipe, sum, take } from "ramda";

// solveSudokuMatrix :: Matrix -> ReaderEither Config Matrix Error
export const solveSudokuMatrix: (
  sudokuMatrix: Matrix.Matrix
) => RE.ReaderEither<CoverMatrix.Config, Error, Matrix.Matrix> = pipe(
  CoverMatrix.makeInCoverMatrix,
  R.map(MatrixLink.makeMatrixLink),
  RE.rightReader,
  RE.chainEitherK(LinkReducer.reduceHeaderLink),
  RE.chain(pipe(MatrixLink.getMatrixFromLinks, RE.rightReader))
);

export interface PartialSumConfig {
  sumSize: number;
}

// getPartialSumOfSudokuMatrix :: Matrix -> Reader PartialSumConfig Int
export const getPartialSumOfSudokuMatrix: (
  sudokuMatrix: Matrix.Matrix
) => R.Reader<PartialSumConfig, number> = (sudokuMatrix) => ({ sumSize }) =>
  pipe(
    head as R.Reader<Matrix.Matrix, number[]>,
    take(sumSize) as R.Reader<number[], number[]>,
    sum
  )(sudokuMatrix);
