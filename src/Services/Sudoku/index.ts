import { Config as CoverMatrixConfig } from "../../Functions/CoverMatrix";
import * as Matrix from "../../Functions/Matrix";
import {
  getPartialSumOfSudokuMatrix,
  PartialSumConfig,
  solveSudokuMatrix,
} from "../../UseCases/SudokuSolver";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as IO from "fp-ts/lib/IO";
import * as R from "fp-ts/Reader";
import * as RT from "fp-ts/ReaderTask";
import * as RTE from "fp-ts/ReaderTaskEither";
import { addIndex, join, map, pipe, toString } from "ramda";
import fs from "fs";
import path from "path";

// getSudokuMatrices :: IO [Matrix]
export const getSudokuMatrices: IO.IO<Matrix.Matrix[]> = () => {
  return pipe(
    (file: string) => path.join(__dirname, file),
    fs.readFileSync,
    toString,
    Matrix.parseMatrices
  )("Sudoku.txt");
};

// displaySumOfSudokuMatrices :: [Matrix] -> ReaderEither Config String Error
const displaySumOfSudokuMatrices: (
  matrices: Matrix.Matrix[]
) => RTE.ReaderTaskEither<
  CoverMatrixConfig & PartialSumConfig,
  Error,
  string
> = pipe(
  map(solveSudokuMatrix),
  A.array.sequence(RTE.readerTaskEither),
  RTE.chainW(
    pipe(
      map(getPartialSumOfSudokuMatrix),
      A.array.sequence(R.reader),
      RTE.rightReader
    )
  ),
  RTE.map(
    pipe(
      addIndex(map)(
        (sum, index) =>
          `Grid ${(index + 1)
            .toString()
            .padStart(2, "0")} -> ${sum.toString().padStart(2, "0")}`
      ),
      join("\n")
    )
  )
);

// displaySumOfSudoku :: Config -> Task String
export const displaySumOfSudoku: RT.ReaderTask<
  CoverMatrixConfig & PartialSumConfig,
  string
> = pipe(
  RTE.rightIO,
  RTE.chain(displaySumOfSudokuMatrices),
  RT.map(E.getOrElse((error: Error) => error.message))
)(getSudokuMatrices);
