import * as LinkReducer from "./LinkReducer";
import * as CoverMatrix from "../Functions/CoverMatrix";
import * as Matrix from "../Functions/Matrix";
import * as MatrixLink from "../Functions/MatrixLink";
import * as R from "fp-ts/lib/Reader";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import { head, pipe, sum, take } from "ramda";

// solveSudokuMatrix :: Matrix -> ReaderTaskEither Config Matrix Error
export const solveSudokuMatrix: (
  sudokuMatrix: Matrix.Matrix
) => RTE.ReaderTaskEither<CoverMatrix.Config, Error, Matrix.Matrix> = pipe(
  CoverMatrix.makeInCoverMatrix,
  R.map(MatrixLink.makeMatrixLink),
  RTE.rightReader,
  RTE.chainIOEitherK(LinkReducer.reduceHeaderLink),
  RTE.chain(pipe(MatrixLink.getMatrixFromLinks, RTE.rightReader))
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
