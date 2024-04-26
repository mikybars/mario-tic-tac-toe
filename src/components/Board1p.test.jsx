import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import characters from "../characters";
import { Board, TURN } from "./Board";
import { act } from "react-dom/test-utils";

describe("<Board 1-players />", () => {
  let component;
  let user;
  let squares;
  const onePlayerBoard = {
    players: {
      [TURN.X]: {
        symbol: characters.Mario,
      },
      [TURN.O]: {
        isManaged: true,
        symbol: characters.Bowser,
      },
    },
  };

  beforeEach(() => {
    user = userEvent.setup();
    component = render(<Board {...onePlayerBoard} />);
    squares = component.container.querySelectorAll(".square");
  });

  test("player 1 must wait his turn", async () => {
    await user.click(squares[0]);
    await user.click(squares[1]);

    expect(screen.getAllByRole("img")).toHaveLength(1);
    screen.getByTitle("Mario");
  });

  test("player 2 plays after player 1", async () => {
    await act(async () => {
      user.click(squares[0]);

      vi.waitFor(() => {
        expect(screen.getAllByRole("img")).toHaveLength(2);
        screen.getByTitle("Bowser");
      });
    });
  });
});
