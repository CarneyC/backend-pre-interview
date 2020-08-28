import * as Matrix from "../../../../../src/Functions/Matrix";
import * as IO from "fp-ts/lib/IO";
import { pipe, toString } from "ramda";
import fs from "fs";
import path from "path";

const getMatrix: (file: string) => IO.IO<Matrix.Matrix> = pipe(
  (file) => () => fs.readFileSync(path.join(__dirname, file)),
  IO.map(pipe(toString, Matrix.parseMatrix))
);

export const getCellCoverMatrix: IO.IO<Matrix.Matrix> = getMatrix(
  "CellCoverMatrix.txt"
);

export const getRowCoverMatrix: IO.IO<Matrix.Matrix> = getMatrix(
  "RowCoverMatrix.txt"
);

export const getColumnCoverMatrix: IO.IO<Matrix.Matrix> = getMatrix(
  "ColumnCoverMatrix.txt"
);

export const getBlockCoverMatrix: IO.IO<Matrix.Matrix> = getMatrix(
  "BlockCoverMatrix.txt"
);
