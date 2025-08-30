import { ThemeProvider } from "./components/theme-provider"
import { RouterProvider } from "react-router-dom"
import { router } from "./routes"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
