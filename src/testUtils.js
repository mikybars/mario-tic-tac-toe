import { emptyBoard } from "./model/board";

export function createBoardFromSketch(sketchedBoard) {
  const decodedSquares = sketchedBoard
    .split("\n")
    .map((row) => row.trim())
    .join("")
    .replace(/\|/g, "");
  // => "x xo  oxo"
  //     012345678

  return emptyBoard().afterPlaying(
    ...[...decodedSquares].flatMap((symbol, i) =>
      symbol !== " " ? [{ symbol, square: i }] : [],
    ),
  );
}
