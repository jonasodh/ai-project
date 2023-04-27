import type { Component } from 'solid-js';

import {Route, Routes} from "@solidjs/router";
import PredictWordPage from "./pages/PredictWordPage";
import SaveWordsPage from "./pages/SaveWordsPage";

const App: Component = () => {
  return (
    <>
    <div class="main">
      <Routes>
        <Route path="/" element={<PredictWordPage />} />
        <Route path="/save-words" element={<SaveWordsPage />} />
      </Routes>
    </div>
    </>
  );
};

export default App;
