import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import characters from "../characters";
import { TURN } from "../components/Board";
import { Board } from "./Board";
import { Player as PlayerModel } from "../model/player";

describe("<Board 2-players />", () => {
  let user;
  let squares;
  const twoPlayersBoard = {
    initialTurn: TURN.X,
    players: new Map([
      [
        TURN.X,
        new PlayerModel({ character: characters.Mario, name: "Jugador 1" }),
      ],
      [
        TURN.O,
        new PlayerModel({ character: characters.Bowser, name: "Jugador 2" }),
      ],
    ]),
  };
  const clickInSequence = (...moves) =>
    Promise.all(moves.map((i) => user.click(squares[i])));

  beforeEach(() => {
    twoPlayersBoard.onGameOver = vi.fn();
    render(<Board {...twoPlayersBoard} />);
    squares = document.querySelectorAll(".square");

    user = userEvent.setup();
  });

  test("players take turns", async () => {
    await clickInSequence(0, 1);

    screen.getByTitle("Mario");
    screen.getByTitle("Bowser");
  });

  test("players cannot take other player's squares", async () => {
    await clickInSequence(0, 1, 0);

    expect(screen.queryAllByRole("img")).toHaveLength(2);
    screen.getByTitle("Mario");
    screen.getByTitle("Bowser");
  });

  test("X wins", async () => {
    await clickInSequence(0, 3, 1, 4, 2);

    await vi.waitFor(
      () => {
        expect(twoPlayersBoard.onGameOver).toBeCalledWith({
          winner: {
            symbol: TURN.X,
            combo: [0, 1, 2],
            numberOfMoves: 3,
          },
        });
      },
      { timeout: 1500 },
    );
  });

  test("game ends in draw", async () => {
    await clickInSequence(4, 0, 8, 2, 6, 7, 1, 3, 5);

    await vi.waitFor(() => {
      expect(twoPlayersBoard.onGameOver).toBeCalledWith({ draw: true });
    });
  });
});
