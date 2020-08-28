import * as IO from "fp-ts/lib/IO";
import { pipe, toString } from "ramda";
import fs from "fs";
import path from "path";

export const getStringMatrix: IO.IO<string> = () => {
  return pipe(
    (file) => path.join(__dirname, file),
    fs.readFileSync,
    toString
  )("Matrix.txt");
};
