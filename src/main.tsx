// Core
import { createRoot } from "react-dom/client";
// Styles
import "./index.css";
// Routing
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routeNames } from "@/shared/constants/host-names.ts";
// Pages
import EditorPage from "@/pages/editor";
import RegisterPage from "@/pages/auth/register";
// Apollo
import { apolloClient } from "@/shared/apollo/client.ts";
import { ApolloProvider } from "@apollo/client/react";

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <Routes>
        <Route path={routeNames.EDITOR_PAGE} element={<EditorPage />} />
        <Route path={routeNames.REGISTER_PAGE} element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  </ApolloProvider>,
);
