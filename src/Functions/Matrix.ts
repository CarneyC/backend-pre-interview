import {
  isEmpty,
  join,
  map,
  pipe,
  reject,
  split,
  concat as concatArray,
} from "ramda";

// Fixed size number array
export type Row = number[];
export type Matrix = Row[];

export const makeRow = (n: number, value = 0): Row => {
  const row = new Array(n);
  row.fill(value);
  Object.seal(row);
  return row;
};

export const makeMatrix = (m: number, n: number, value = 0): Matrix =>
  map((value) => makeRow(n, value), makeRow(m, value));

// toString :: Matrix -> String
export const toString: (matrix: Matrix) => string = pipe(
  map(join("")),
  join("\n")
);

// parseRow :: String -> Row
const parseRow: (value: string) => Row = pipe(pipe(split(""), map(parseInt)));

// parseMatrix :: String -> Matrix
export const parseMatrix: (value: string) => Matrix = pipe(
  split(/\r\n?|\n/),
  map(parseRow),
  reject(isEmpty)
);

// parseMatrices :: String -> [Matrix]
export const parseMatrices: (value: string) => Matrix[] = pipe(
  split(/^Grid.*$/m),
  reject(isEmpty),
  map(parseMatrix)
);

// concat :: Matrix -> Matrix -> Matrix
export const concat = (a: Matrix) => (b: Matrix): Matrix =>
  a.length < b.length
    ? concat(b)(a)
    : a.map((aRow, row) => concatArray(aRow, b[row] || []));
