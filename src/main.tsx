import ReactDOM from "react-dom/client";
import NotFound from "@/components/layout/NotFound";
import { RouterView } from "@/lib/router";
import "./globals.css";

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<RouterView fallback={NotFound} />);
}
