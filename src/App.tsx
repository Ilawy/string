import "./App.css";
import { Redirect, Route, Switch } from "wouter";
import Nav from "./components/nav";
import Sidebar from "./components/sidebar";
import ProcessRoute from "./routes/processRoute";

function App() {
  return (
    <>
      <main>
        <Nav />
        <article className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar />
          <Switch>
            <Route path="/process">
              <ProcessRoute />
            </Route>
            <Route path="/">
              <Redirect to="/process" />
            </Route>
            <Route path="/about">
              <h1>About</h1>
            </Route>
          </Switch>
        </article>
      </main>
    </>
  );
}

export default App;
