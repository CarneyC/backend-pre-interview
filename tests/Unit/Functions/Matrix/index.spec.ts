import * as Sample from "./Sample";
import * as Matrix from "../../../../src/Functions/Matrix";
import chai from "chai";

const { expect } = chai;

describe("Matrix", function () {
  describe("#toString()", function () {
    it("should return a formatted string table when given a 3x3 matrix", function () {
      const expectedString = "301\n824\n567";

      const matrix = [
        [3, 0, 1],
        [8, 2, 4],
        [5, 6, 7],
      ];
      const actualString = Matrix.toString(matrix);

      expect(actualString).to.equal(expectedString);
    });
  });

  describe("#parseMatrix()", function () {
    it("should return a 9x9 matrix when given a 9x9 formatted string table", function () {
      const expectedMatrix = [
        [0, 0, 3, 0, 2, 0, 6, 0, 0],
        [9, 0, 0, 3, 0, 5, 0, 0, 1],
        [0, 0, 1, 8, 0, 6, 4, 0, 0],
        [0, 0, 8, 1, 0, 2, 9, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 8],
        [0, 0, 6, 7, 0, 8, 2, 0, 0],
        [0, 0, 2, 6, 0, 9, 5, 0, 0],
        [8, 0, 0, 2, 0, 3, 0, 0, 9],
        [0, 0, 5, 0, 1, 0, 3, 0, 0],
      ];

      const stringTable = Sample.getStringMatrix();
      const actualMatrix = Matrix.parseMatrix(stringTable);

      expect(actualMatrix).to.deep.equal(expectedMatrix);
    });
  });
});
