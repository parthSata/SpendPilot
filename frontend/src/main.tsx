import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { getRouter } from "./router";

const router = getRouter();
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Missing root element with id "root"');
}

ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);