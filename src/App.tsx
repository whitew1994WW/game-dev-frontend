import React from 'react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import GameApp from './game-app/game-app';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

Amplify.configure(config);

const App: React.FC = () => {
  console.log("App.tsx");
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
        <Route path="/gamedevtool" element={<GameApp />} />
        </Routes>
    </Router>
  );
}

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
      <div className="flex flex-col min-h-screen">
          <Header />
          <Menu />
          <main className="flex-grow">{children}</main>
          <Footer />
      </div>
  );
};

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white flex justify-center items-center p-4 h-16">
      <h1 className="text-xl font-bold">Game Story Generator</h1>
    </header>
  );
};

const Menu: React.FC = () => {
  return (
    <nav className="bg-gray-100 p-4">
      <ul className="flex justify-center space-x-4">
        <li><Link className="text-blue-600 hover:text-blue-800" to="/">Home</Link></li>
        <li><Link className="text-blue-600 hover:text-blue-800" to="/about">About</Link></li>
        <li><Link className="text-blue-600 hover:text-blue-800" to="/pricing">Pricing</Link></li>
        <li><Link className="text-blue-600 hover:text-blue-800" to="/gamedevtool">App</Link></li>
      </ul>
    </nav>
  );
};

const HomePage: React.FC = () => {
  return (
      <div className="flex justify-center p-4">
        <main>
            <p>This is the main area of the web application.</p>
        </main>
      </div>
  );
};

const AboutPage: React.FC = () => {
  return (
    <div className="flex justify-center p-4">
          <main>
              <p>This is the about page.</p>
          </main>
      </div>
  );
};

const PricingPage: React.FC = () => {
  return (
    <div className="flex justify-center p-4">
          <main>
              <p>This is the pricing page.</p>
          </main>
      </div>
  );
};

const Footer: React.FC = () => {
  return (
      <footer className="bg-gray-200 text-center p-4">
          <p>© 2023 Your Company Name</p>
      </footer>
  );
};

export default App;