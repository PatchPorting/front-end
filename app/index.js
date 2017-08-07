/*  Copyright (c) 2017 IBM Corp.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import reducer from "./reducers";
import App from "./components/App";

import Loading from "./components/common/Loading";

// Import styles
import "react-select/dist/react-select.css";
import "./styles/main.less";

let store = createStore(reducer, undefined, autoRehydrate());

class AppProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      rehydrated: false
    };
  }

  componentWillMount() {
    persistStore(
      store,
      {
        whitelist: ["build"],
        blacklist: ["filter", "hunkSet", "tree", "patch"]
      },
      () => {
        this.setState({
          rehydrated: true
        });
      }
    );
  }

  render() {
    return this.state.rehydrated
      ? <Provider store={store}>
          <App />
        </Provider>
      : <Loading />;
  }
}

ReactDOM.render(<AppProvider />, document.getElementById("root"));
