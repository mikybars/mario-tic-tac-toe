import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import characters from "../characters";
import { Board, TURN } from "./Board";

describe("<Board 2-players />", () => {
  let component;
  let user;
  let squares;
  const twoPlayersBoard = {
    onWinner: vi.fn(),
    onDraw: vi.fn(),
    players: {
      [TURN.X]: {
        symbol: characters.Mario,
      },
      [TURN.O]: {
        symbol: characters.Bowser,
      },
    },
  };

  beforeEach(() => {
    user = userEvent.setup();
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
        expect(twoPlayersBoard.onWinner).toHaveBeenCalledWith(TURN.X);
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
      expect(twoPlayersBoard.onDraw).toHaveBeenCalled();
    });
  });
});