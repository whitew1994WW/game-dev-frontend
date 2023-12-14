import React from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator, WithAuthenticatorProps } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import GameStoryBoard from './game-dev-tool';

Amplify.configure(config);

const App: React.FC<WithAuthenticatorProps> = ({ signOut }) => {
  return (
    <div>
      <h1>Game Dev Tools</h1>
      <GameStoryBoard />
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

// const authenticatorOptions: WithAuthenticatorOptions = {
//   loginMechanism: 'email',
//   signUpAttributes: ['email']
// };

export default withAuthenticator(App); //, authenticatorOptions);