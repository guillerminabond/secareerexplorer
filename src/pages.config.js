import Home from './pages/Home';
import Explore from './pages/Explore';
import __Layout from './Layout.jsx';

export const PAGES = {
  // Keys must be lowercase to match the URL path segments produced by the router.
  // A capital-H "Home" key would create a dead /Home route — use lowercase instead.
  home: Home,
  explore: Explore,
}

export const pagesConfig = {
    mainPage: "home",
    Pages: PAGES,
    Layout: __Layout,
};
