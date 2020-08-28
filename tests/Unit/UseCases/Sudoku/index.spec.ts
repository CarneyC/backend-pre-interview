import * as Sample from "./Sample";
import * as SudokuSolver from "../../../../src/UseCases/SudokuSolver";
import chai from "chai";
import * as TE from "fp-ts/lib/TaskEither";

const { expect } = chai;

describe("SudokuSolver", function () {
  describe("#solveSudokuMatrix()", function () {
    it("should return a solved Sudoku matrix", async function () {
      const expectedMatrix = Sample.getSudokuMatrixSolution();

      const sudokuMatrix = Sample.getSudokuMatrix();

      const solvedEither = SudokuSolver.solveSudokuMatrix(sudokuMatrix)({
        gridSize: 9,
        numberOfValues: 9,
      });

      const actualMatrix = await TE.getOrElse(() => null)(solvedEither)();

      expect(actualMatrix).to.deep.equal(expectedMatrix);
    });
  });

  describe("#getPartialSumOfSudokuMatrix()", function () {
    it("should return the sum of first 3 digits in the top row of the given Sudoku Matrix", function () {
      const expectedSum = 15;

      const sudokuMatrix = Sample.getSudokuMatrixSolution();
      const actualSum = SudokuSolver.getPartialSumOfSudokuMatrix(sudokuMatrix)({
        sumSize: 3,
      });

      expect(actualSum).to.equal(expectedSum);
    });
  });
});
