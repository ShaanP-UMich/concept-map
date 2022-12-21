import React from "react";
import { createRoot } from "react-dom/client";
import ConceptMap from "./ConceptMap";

// Create a root
const root = createRoot(document.getElementById("reactEntry"));
// This method is only called once
// Insert the post component into the DOM

// root.render(<Feed url="/api/v1/posts/" />);
root.render(<ConceptMap />);
