import Home from './pages/Home';
import Explore from './pages/Explore';
import __Layout from './Layout.jsx';

export const PAGES = {
  Home,
  explore: Explore,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
