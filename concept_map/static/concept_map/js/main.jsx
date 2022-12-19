import React from "react";
import { createRoot } from "react-dom/client";
// import Feed from "./feed";

// Create a root
const root = createRoot(document.getElementById("reactEntry"));
// This method is only called once
// Insert the post component into the DOM
// root.render(<Post url="/api/v1/posts/2/" />);
// root.render(<Feed url="/api/v1/posts/" />);
root.render(<h1>React Rendered</h1>);
