import * as Sample from "./Sample";
import * as Constraint from "../../../../src/Functions/CoverMatrix";
import chai from "chai";

const { expect } = chai;

describe("CoverMatrix", function () {
  describe("#makeCellCoverMatrix()", function () {
    it("should return the cell cover matrix of a 9x9 grid", function () {
      const expectedMatrix = Sample.getCellCoverMatrix();

      const actualMatrix = Constraint.makeCellCoverMatrix({
        gridSize: 9,
        numberOfValues: 9,
      });
      expect(actualMatrix).to.deep.equal(expectedMatrix);
    });
  });

  describe("#rowColumnNumberOfIndex()", function () {
    it("should return row ,column and n values of the provided index", function () {
      const expectedResult: [number, number, number] = [4, 2, 8];

      const config = {
        gridSize: 9,
        numberOfValues: 9,
      };

      const index = Constraint.indexInCoverMatrix(...expectedResult)(config);
      const actualResult = Constraint.rowColumnNumberOfIndex(index)(config);
      expect(actualResult).to.deep.equal(expectedResult);
    });
  });

  describe("#makeRowCoverMatrix()", function () {
    it("should return the row cover matrix of a 9x9 grid", function () {
      const expectedMatrix = Sample.getRowCoverMatrix();

      const actualMatrix = Constraint.makeRowCoverMatrix({
        gridSize: 9,
        numberOfValues: 9,
      });
      expect(actualMatrix).to.deep.equal(expectedMatrix);
    });
  });

  describe("#makeColumnCoverMatrix()", function () {
    it("should return the column cover matrix of a 9x9 grid", function () {
      const expectedMatrix = Sample.getColumnCoverMatrix();

      const actualMatrix = Constraint.makeColumnCoverMatrix({
        gridSize: 9,
        numberOfValues: 9,
      });
      expect(actualMatrix).to.deep.equal(expectedMatrix);
    });
  });

  describe("#makeBlockCoverMatrix()", function () {
    it("should return the block cover matrix of a 9x9 grid", function () {
      const expectedMatrix = Sample.getBlockCoverMatrix();

      const actualMatrix = Constraint.makeBlockCoverMatrix({
        gridSize: 9,
        numberOfValues: 9,
      });
      expect(actualMatrix).to.deep.equal(expectedMatrix);
    });
  });
});
