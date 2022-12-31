import Puzzles from "./pages/Puzzles.svelte";
import NotFound from "./lib/NotFound.svelte";

const routes = {
  "/": Puzzles,
  "/yaggle": NotFound,
  "*": NotFound,
};

export default routes;
