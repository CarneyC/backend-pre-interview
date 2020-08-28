import * as Matrix from "./Matrix";
import * as A from "fp-ts/lib/Array";
import * as R from "fp-ts/lib/Reader";
import { pipe, reduce } from "ramda";

export interface Config {
  gridSize: number;
  numberOfValues: number;
}

// numberOfCellCombinations :: Reader Config Int
export const numberOfCellCombinations: R.Reader<Config, number> = ({
  gridSize,
  numberOfValues,
}) => gridSize * gridSize * numberOfValues;

// makeCellCoverMatrix :: Reader Config Matrix
// Each cell can only contain one number
export const makeCellCoverMatrix: R.Reader<Config, Matrix.Matrix> = (
  config
): Matrix.Matrix => {
  const { gridSize, numberOfValues } = config;

  const numberOfRows = numberOfCellCombinations(config);
  const numberOfColumns = gridSize * gridSize;

  const matrix = Matrix.makeMatrix(numberOfRows, numberOfColumns);

  for (let column = 0; column < numberOfColumns; column++) {
    for (let rowDelta = 0; rowDelta < numberOfValues; rowDelta++) {
      const row = column * numberOfValues + rowDelta;
      matrix[row][column] = 1;
    }
  }
  return matrix;
};

type IndexFunctor = (
  row: number,
  column: number,
  n: number
) => R.Reader<Config, number>;

// indexInCoverMatrix :: (Int Int Int) -> Reader Config Int
export const indexInCoverMatrix: IndexFunctor = (row, column, n) => ({
  gridSize,
  numberOfValues,
}) => row * gridSize * numberOfValues + column * numberOfValues + n;

// rowColumnNumberOfIndex :: Int -> Reader Config (Int Int Int)
export const rowColumnNumberOfIndex = (index: number) => ({
  gridSize,
  numberOfValues,
}): [number, number, number] => {
  const row = Math.floor(index / (gridSize * numberOfValues));

  const column = Math.floor(
    (index - row * gridSize * numberOfValues) / numberOfValues
  );

  const n = index - (row * gridSize * numberOfValues + column * numberOfValues);

  return [row, column, n];
};

// makeIndexedCoverMatrixWith :: IndexFunctor -> Reader Config Matrix
export const makeIndexedCoverMatrixWith: (
  getColumnIndex: IndexFunctor
) => R.Reader<Config, Matrix.Matrix> = (getColumnIndex) => (
  config
): Matrix.Matrix => {
  const { gridSize, numberOfValues } = config;

  const numberOfRows = numberOfCellCombinations(config);
  const numberOfColumns = gridSize * numberOfValues;

  const matrix = Matrix.makeMatrix(numberOfRows, numberOfColumns);

  for (let rowOnGrid = 0; rowOnGrid < gridSize; rowOnGrid++) {
    for (let n = 0; n < numberOfValues; n++) {
      for (let columnOnGrid = 0; columnOnGrid < gridSize; columnOnGrid++) {
        const row = indexInCoverMatrix(rowOnGrid, columnOnGrid, n)(config);
        const column = getColumnIndex(rowOnGrid, columnOnGrid, n)(config);
        matrix[row][column] = 1;
      }
    }
  }
  return matrix;
};

// makeRowCoverMatrix :: Reader Config Matrix
// Each row can only contain one of each number
export const makeRowCoverMatrix: R.Reader<
  Config,
  Matrix.Matrix
> = makeIndexedCoverMatrixWith((row, _column, n) => ({ numberOfValues }) =>
  row * numberOfValues + n
);

// makeColumnCoverMatrix :: Reader Config Matrix
// Each column can only contain one of each number
export const makeColumnCoverMatrix: R.Reader<
  Config,
  Matrix.Matrix
> = makeIndexedCoverMatrixWith((_row, column, n) => ({ numberOfValues }) =>
  column * numberOfValues + n
);

// makeBlockCoverMatrix :: Reader Config Matrix
// Each block can only contain one of each number
export const makeBlockCoverMatrix: R.Reader<Config, Matrix.Matrix> = (
  config
): Matrix.Matrix => {
  const { gridSize, numberOfValues } = config;

  const numberOfRows = numberOfCellCombinations(config);

  const numberOfBlocks = (gridSize * gridSize) / numberOfValues;
  const numberOfColumns = numberOfBlocks * numberOfValues;

  const blockSize = Math.sqrt(numberOfValues);
  const blockPerRow = Math.sqrt(numberOfBlocks);

  const matrix = Matrix.makeMatrix(numberOfRows, numberOfColumns);

  for (let rowOfBlock = 0; rowOfBlock < blockPerRow; rowOfBlock++) {
    for (let columnOfBlock = 0; columnOfBlock < blockPerRow; columnOfBlock++) {
      for (let rowDelta = 0; rowDelta < blockSize; rowDelta++) {
        for (let columnDelta = 0; columnDelta < blockSize; columnDelta++) {
          const rowOnGrid = rowOfBlock * blockSize + rowDelta;
          const columnOnGrid = columnOfBlock * blockSize + columnDelta;
          const block = rowOfBlock * blockPerRow + columnOfBlock;

          for (let n = 0; n < numberOfValues; n++) {
            const row = indexInCoverMatrix(rowOnGrid, columnOnGrid, n)(config);
            const column = block * numberOfValues + n;
            matrix[row][column] = 1;
          }
        }
      }
    }
  }
  return matrix;
};

// makeExactCoverMatrix :: Reader Config Matrix
export const makeExactCoverMatrix: R.Reader<Config, Matrix.Matrix> = pipe(
  A.array.sequence(R.reader)([
    makeCellCoverMatrix,
    makeRowCoverMatrix,
    makeColumnCoverMatrix,
    makeBlockCoverMatrix,
  ]),
  reduce<Matrix.Matrix, Matrix.Matrix>(
    (acc, elem) => Matrix.concat(acc)(elem),
    []
  )
);

// makeInCoverMatrix :: Matrix -> Reader Config Matrix
// In cover values from Sudoku puzzle
export const makeInCoverMatrix: (
  matrix: Matrix.Matrix
) => R.Reader<Config, Matrix.Matrix> = (matrix) => (config) => {
  const { numberOfValues } = config;

  const inCoverMatrix = makeExactCoverMatrix(config);

  matrix.forEach((matrixRow, row) =>
    matrixRow.forEach((n, column) => {
      if (n > 0) {
        for (let value = 0; value < numberOfValues; value++) {
          if (value !== n - 1) {
            const index = indexInCoverMatrix(row, column, value)(config);
            inCoverMatrix[index].fill(0);
          }
        }
      }
    })
  );

  return inCoverMatrix;
};
