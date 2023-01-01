import Home from "./pages/Home/Home.svelte";
import JoinGame from "./pages/JoinGame/JoinGame.svelte";
import StartGame from "./pages/StartGame/StartGame.svelte";
import NotFound from "./lib/NotFound.svelte";

const routes = {
  "/": Home,
  "/start-game": StartGame,
  "/join-game": JoinGame,
  "*": NotFound,
};

export default routes;
