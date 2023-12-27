import React from 'react';

export interface StartingScreenState {
    apiKey: string;
}

const StartingScreen: React.FC<{ state: StartingScreenState; setState: React.Dispatch<React.SetStateAction<StartingScreenState>> }> = ({ state, setState }) => {
    const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(prevState => ({ ...prevState, apiKey: event.target.value }));
    };

    return (
        <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Getting Started</h2>
            <p className="mb-4 text-gray-700">Welcome to our 2D game graphics design tool, powered by OpenAI's API. Follow these steps to start creating stunning game graphics:</p>
            <ol className="list-decimal list-inside mb-4 text-gray-700">
                <li>Obtain an OpenAI API key from the <a href="https://openai.com/blog/openai-api" className="text-blue-600 hover:text-blue-800">OpenAI website</a> if you don't already have one.</li>
                <li>Begin with the Game Storyboard Generation to outline your game's concept.</li>
                <li>Use tools like Environment, Character, and Item Tilesheets to bring your game to life.</li>
                <li>Customize details as needed and generate or regenerate graphics with ease.</li>
            </ol>
            <div className="mb-4">
                <label className="block text-gray-800 text-lg font-bold mb-2" htmlFor="apiKey">API Key</label>
                <input 
                    id="apiKey"
                    type="text" 
                    value={state.apiKey} 
                    onChange={handleApiKeyChange} 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your OpenAI API key here" 
                />
            </div>
        </div>
    );
};

export default StartingScreen;