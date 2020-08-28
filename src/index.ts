import { Config as CoverMatrixConfig } from "./Functions/CoverMatrix";
import { Matrix } from "./Functions/Matrix";
import { getSudokuMatrices } from "./Services/Sudoku";
import {
  getPartialSumOfSudokuMatrix,
  PartialSumConfig,
  solveSudokuMatrix,
} from "./UseCases/SudokuSolver";
import * as A from "fp-ts/lib/Array";
import * as R from "fp-ts/lib/Reader";
import * as RE from "fp-ts/lib/ReaderEither";
import { addIndex, join, map, pipe } from "ramda";

// displaySumOfSudokuMatrices :: [Matrix] -> ReaderEither Config String Error
const displaySumOfSudokuMatrices: (
  matrices: Matrix[]
) => RE.ReaderEither<
  CoverMatrixConfig & PartialSumConfig,
  Error,
  string
> = pipe(
  map(solveSudokuMatrix),
  A.array.sequence(RE.readerEither),
  RE.chainW(
    pipe(
      map(getPartialSumOfSudokuMatrix),
      A.array.sequence(R.reader),
      RE.rightReader
    )
  ),
  RE.map(
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

function main() {
  const sudoku = getSudokuMatrices();
  const config = {
    gridSize: 9,
    numberOfValues: 9,
    sumSize: 3,
  };

  pipe(displaySumOfSudokuMatrices, RE.map(console.log))(sudoku)(config);
}

main();
