import React from 'react';
import { Dispatch, SetStateAction } from 'react';

export interface StartingScreenState {
    apiKey: string;
}

const StartingScreen: React.FC<{ state: StartingScreenState; setState: Dispatch<SetStateAction<StartingScreenState>> }> = ({ state, setState }) => {

    const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(prevState => ({ ...prevState, apiKey: event.target.value }));
    };

    console.log('StartingScreen state:', state);
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-2">Start Here</h2>
            <p className="block text-gray-700 text-sm font-bold mb-2">Enter your API key</p>
            <input type="text" value={state.apiKey} onChange={handleApiKeyChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
    );
};

export default StartingScreen;