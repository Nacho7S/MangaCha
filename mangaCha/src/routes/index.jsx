import {
  createBrowserRouter,
} from "react-router-dom";
import HomePages from "../pages/HomePage/HomePages";
import { BaseLayout } from "../components/baseLayout/BaseLayout";
import { FavouritePages } from "../pages/FavouritePage/FavouritePages";
import { HistoryPages } from "../pages/HistoryPages/HistoryPages";
import MangaDetails from "../pages/MangaDetails/MangaDetails";
import { MangaSearched } from "../pages/HomePage/MangaSearched";
import { MangaRead } from "../pages/MangaRead/mangaRead";
import { LoginPage } from "../pages/LoginRegisterPage/LoginModal";
import { RegisterPage } from "../pages/LoginRegisterPage/RegisterPage";
import { TrackSpeedInternet } from "../utils/trackSpeedInternet";

  export const router = createBrowserRouter([
    {
      path: "/",
      element: <BaseLayout />,
      children: [
        {
          path: '',
          element: <HomePages />,
          children: [{
            path: '/login',
            element: <LoginPage/>
          }]
        },
        {
          path: '/manga/search',
          element: <MangaSearched />,
        },
        {
          path: '/manga/:mangaId',
          element: <MangaDetails />,
        },
        {
          path: '/manga/:mangaName/:chapter/:chapterId',
          element: <TrackSpeedInternet/>
        },
        {
          path: '/favourite',
          element: <FavouritePages />,
        },
        {
          path: '/history',
          element: <HistoryPages />,
        },
        {
          path: '/register',
          element: <RegisterPage/>
        }
      ]
    },
  ]);
