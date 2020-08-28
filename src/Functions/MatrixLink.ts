import * as CoverMatrix from "./CoverMatrix";
import * as Link from "./Link";
import * as Matrix from "./Matrix";
import * as R from "fp-ts/lib/Reader";
import { head, length, map, pipe } from "ramda";

// makeMatrixLink :: Matrix -> HeaderLink
export const makeMatrixLink = (matrix: Matrix.Matrix): Link.HeaderLink => {
  const rootLink = new Link.HeaderLink();

  const numberOfColumns = pipe(head, length)(matrix);

  // initialize all constraint headers
  const headerLinks = pipe(
    Matrix.makeRow,
    map(() => new Link.HeaderLink())
  )(numberOfColumns);

  // link headers with root
  headerLinks.reduce((prevLink, link) => {
    prevLink.linkRight(link);
    return link;
  }, rootLink);

  matrix.forEach((matrixRow, row) => {
    let prevLink: Link.Link = null;

    for (let column = 0; column < numberOfColumns; column++) {
      if (matrixRow[column] === 1) {
        const header = headerLinks[column];
        const link = new Link.Link(header, { row, column });

        if (prevLink !== null) {
          prevLink.linkRight(link);
        }
        prevLink = link;

        header.top.linkBottom(link);
      }
    }
  });

  return rootLink;
};

// getMatrixFromLinks :: [Link] -> Matrix
export const getMatrixFromLinks: (
  links: Link.Link[]
) => R.Reader<CoverMatrix.Config, Matrix.Matrix> = (links) => (config) => {
  const { gridSize } = config;
  const matrix = Matrix.makeMatrix(gridSize, gridSize);

  links.forEach((link) => {
    const index = link.metadata?.row ?? 0;
    const [row, column, n] = CoverMatrix.rowColumnNumberOfIndex(index)(config);

    matrix[row][column] = n + 1;
  });

  return matrix;
};
