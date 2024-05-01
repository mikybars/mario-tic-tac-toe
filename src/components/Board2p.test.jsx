import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import characters from "../characters";
import { TURN } from "../components/Board";
import { Board } from "./Board";
import { Player as PlayerModel } from "../model/player";

describe("<Board 2-players />", () => {
  let component;
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

  beforeEach(() => {
    user = userEvent.setup();
    twoPlayersBoard.onGameOver = vi.fn();
    component = render(<Board {...twoPlayersBoard} />);
    squares = component.container.querySelectorAll(".square");
  });

  test("players take turns", async () => {
    await user.click(squares[0]);
    await user.click(squares[1]);

    screen.getByTitle("Mario");
    screen.getByTitle("Bowser");
  });

  test("players cannot take other player's squares", async () => {
    await Promise.all([
      user.click(squares[0]),
      user.click(squares[1]),
      user.click(squares[0]),
    ]);

    expect(component.queryAllByRole("img")).toHaveLength(2);
    screen.getByTitle("Mario");
    screen.getByTitle("Bowser");
  });

  test("player 1 wins", async () => {
    await Promise.all([
      user.click(squares[0]),
      user.click(squares[3]),
      user.click(squares[1]),
      user.click(squares[4]),
      user.click(squares[2]),
    ]);

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
    const squares = component.container.querySelectorAll(".square");

    await Promise.all(
      [4, 0, 8, 2, 6, 7, 1, 3, 5].map((i) => {
        user.click(squares[i]);
      }),
    );

    await vi.waitFor(() => {
      expect(twoPlayersBoard.onGameOver).toBeCalledWith({ draw: true });
    });
  });

  test("game does not end in draw when all squares are taken but there is a winner", async () => {
    const squares = component.container.querySelectorAll(".square");

    await Promise.all(
      [4, 1, 0, 3, 2, 5, 7, 6, 8].map((i) => {
        user.click(squares[i]);
      }),
    );

    await vi.waitFor(
      () => {
        expect(twoPlayersBoard.onGameOver).toBeCalledWith({
          winner: {
            symbol: TURN.X,
            combo: [0, 4, 8],
            numberOfMoves: 5,
          },
        });
        expect(twoPlayersBoard.onGameOver).toBeCalled();
      },
      { timeout: 1500 },
    );
  });
});
