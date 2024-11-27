import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App.tsx'
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";
import { routes } from './tools.tsx';
import { getUser } from './utils/auth.ts';
import { Settings } from './routes/Settings.tsx';

export const runReactApp = (root: HTMLElement) => {
  const router = createMemoryRouter([
    {
      path: "/",
      element: <App />,
      loader: async () => {
        await getUser()
        return null;
      },
      children: [
        ...routes,
        {
          path: "/settings",
          element: <Settings />,
        },
      ],
    }
  ]);

  console.log("root", root)
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}


export default runReactApp;