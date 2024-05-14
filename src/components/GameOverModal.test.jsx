import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import characters from "../characters";
import { findCharacter } from "../testUtils";
import { GameOverModal } from "./GameOverModal";

describe("<GameOverModal />", () => {
  let user;
  const modal = {
    winner: {
      name: "pepe",
      character: characters.Goomba,
    },
    resetGame: vi.fn(),
  };

  beforeEach(() => {
    user = userEvent.setup();
  });

  test("displays the winner name and symbol", async () => {
    render(<GameOverModal {...modal} />);
    screen.getByText(modal.winner.name, { exact: false });
    await findCharacter("Goomba");
  });

  test("reports draw", () => {
    render(<GameOverModal resetGame={vi.fn()} />);
    screen.getByText("empate", { exact: false });
  });

  test("resets game", async () => {
    render(<GameOverModal {...modal} />);
    await user.click(screen.getByText("empezar", { exact: false }));
    expect(modal.resetGame).toHaveBeenCalled();
  });
});
