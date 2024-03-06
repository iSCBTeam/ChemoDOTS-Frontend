import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "../container/dashboard";
import Layout from "../components/layout";
import Growing from "../container/growing";
import Linking from "../container/linking";

const router = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      // errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "growing", element: <Growing /> },
        { path: "linking", element: <Linking /> },
      ],
    },
  ]);
};

export default router;
