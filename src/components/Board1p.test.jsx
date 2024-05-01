import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import characters from "../characters";
import { TURN } from "../components/Board";
import { Board } from "./Board";
import { Player as PlayerModel } from "../model/player";

describe("<Board 1-players />", () => {
  let component;
  let user;
  let squares;
  const onePlayerBoard = {
    cpuTurn: TURN.O,
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
