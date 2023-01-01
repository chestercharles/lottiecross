import Puzzles from "./pages/Puzzles/Puzzles.svelte";
import NotFound from "./lib/NotFound.svelte";

const routes = {
  "/": Puzzles,
  "*": NotFound,
};

export default routes;
