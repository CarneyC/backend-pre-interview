import * as Link from "../Functions/Link";
import { HeaderLink } from "../Functions/Link";
import * as E from "fp-ts/lib/Either";
import { concat } from "ramda";

// getSmallestHeaderLink :: HeaderLink -> HeaderLink;
export const getSmallestHeaderLink = (
  rootLink: Link.HeaderLink
): HeaderLink => {
  let minLink: Link.HeaderLink = null;

  for (
    let link: Link.HeaderLink = rootLink.right;
    link !== rootLink;
    link = link.right
  ) {
    if (link.size === 0) {
      return link;
    }

    if (minLink === null || link.size < minLink.size) {
      minLink = link;
    }
  }

  return minLink ?? rootLink;
};

// reduceHeaderLink :: HeaderLink -> Either [Link] Error
export const reduceHeaderLink = (
  rootLink: Link.HeaderLink
): E.Either<Error, Link.Link[]> => {
  if (rootLink.right === rootLink) {
    return E.right([]);
  } else {
    let header = getSmallestHeaderLink(rootLink);

    if (header.size > 0) {
      header.cover();

      const partialSolution: Link.Link[] = [];

      for (
        let link: Link.Link = header.bottom;
        link !== header;
        link = link.bottom
      ) {
        partialSolution.push(link);

        for (
          let linkToCover: Link.Link = link.right;
          linkToCover !== link;
          linkToCover = linkToCover.right
        ) {
          linkToCover.header.cover();
        }

        const reducedSolution = reduceHeaderLink(rootLink);

        if (E.isRight(reducedSolution)) {
          return E.map(concat(partialSolution))(reducedSolution);
        } else {
          const link = partialSolution.pop();
          header = link.header;

          for (
            let linkToCover: Link.Link = link.left;
            linkToCover !== link;
            linkToCover = linkToCover.left
          ) {
            linkToCover.header.uncover();
          }
        }
      }

      header.uncover();
    }

    return E.left(new Error("No solution found."));
  }
};
