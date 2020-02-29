import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import db, { notifyDbChanges } from "./db";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);

window.ondragover = e => e.preventDefault();
window.ondrop = e => {
  e.preventDefault();
  handleData(e.dataTransfer);
};
document.onpaste = e => {
  e.preventDefault();
  handleData(e.clipboardData);
};

async function handleData(dt) {
  try {
    const text = dt.getData("text/plain");
    await db.blobs.add({
      createdAt: new Date().toJSON(),
      files: [...dt.files],
      text: text || null,
      otherTypes: Object.fromEntries(
        dt.types
          .filter(t => t !== "Files" && t !== "text/plain")
          .map(t => [t, dt.getData(t)])
      )
    });
    notifyDbChanges();
  } catch (e) {
    alert(e);
  }
}
