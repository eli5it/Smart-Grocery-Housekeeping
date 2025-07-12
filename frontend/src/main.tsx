import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toast } from "radix-ui";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance and query client
const router = createRouter({ routeTree });
const queryClient = new QueryClient();

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Toast.Provider>
          <RouterProvider router={router} />
          <Toast.Viewport className="fixed bottom-4 right-4 z-[10]" />
        </Toast.Provider>
      </QueryClientProvider>
    </StrictMode>
  );
}
