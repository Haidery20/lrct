import { Route, Switch } from 'wouter';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Membership from './pages/Membership';
import Events from './pages/Events';
import Festivals from './pages/Festivals';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/membership" component={Membership} />
          <Route path="/events" component={Events} />
          <Route path="/festivals" component={Festivals} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;