import React, { FC } from "react";
import { render } from "react-dom";

const App: FC = () => {
  return (
    <div>
      <h1>Service Worker Webpack Plugin: React Example</h1>
      <p>
        If you disable your network connection or local server this page will be
        served from the installed Service Worker, demonstrating offline access
        🙌.
      </p>
      <p>
        Returning visitors will load the index.html and JavaScript bundle from
        the Service Worker as well, speeding up the user experience 🚀.
      </p>
    </div>
  );
};

render(<App />, document.getElementById("app"));
