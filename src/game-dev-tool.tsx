import React, { useState } from 'react';

interface ApiResponse {
    plot: string;
    characters: string;
    colourScheme: string;
    styleKeywords: string;
    environments: string;   
}

interface ApiRequest {
    gameDescription: string;
    gameType: string;
    graphicView: string;
    graphicStyle: string;
    multiplayerOption: string;
}

const GameStoryBoard: React.FC = () => {
    const [game_description, setGameDescription] = useState<string>('');
    const [game_type, setGameType] = useState<string>('');
    const [graphic_view, setGraphicView] = useState<string>('');
    const [graphic_style, setGraphicStyle] = useState<string>('');
    const [multiplayer_option, setMultiplayerOption] = useState<string>('');
    const [plot, setPlot] = useState<string>('');
    const [characters, setCharacters] = useState<string>('');
    const [colour_scheme, setColourScheme] = useState<string>('');
    const [style_keywords, setStyleKeywords] = useState<string>('');
    const [environments, setEnvironments] = useState<string>('');

    const handleGameDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setGameDescription(event.target.value);
    };

    const handleGameTypeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setGameType(event.target.value);
    };

    const handleGraphicViewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setGraphicView(event.target.value);
    };

    const handleGraphicStyleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setGraphicStyle(event.target.value);
    };

    const handleMultiplayerOptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMultiplayerOption(event.target.value);
    };

    const setOutputs = (data: ApiResponse) => {
        setPlot(data.plot);
        setCharacters(data.characters);
        setColourScheme(data.colourScheme);
        setStyleKeywords(data.styleKeywords);
        setEnvironments(data.environments);
    }

    const callApi = async () => {
        const url = '/api/generate_all_details';
        try {
            const apiRequest: ApiRequest = { gameDescription: game_description, gameType: game_type, graphicView: graphic_view, graphicStyle: graphic_style, multiplayerOption: multiplayer_option };
            const response = await fetch(url, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiRequest),
            });
            const data: ApiResponse = await response.json();
            setOutputs(data);
        } catch (error) {
            console.error('Error calling the API:', error);
        }
    };


    return (
    <div>
            <div>
                <label>
                    Game Description
                </label>
                <textarea
                    value={game_description}
                    onChange={handleGameDescriptionChange}>
                </textarea>
            </div>
            <div>
                <label>
                    Game Type (Platformer, Action, Adventure, Role Playing Game, Simulation, Strategy...)
                </label>
                <textarea
                    value={game_type}
                    onChange={handleGameTypeChange}>
                </textarea>
            </div>
            <div>
                <label>
                    Graphic View (isometric, top down, front facing, three quarter, planar view, head on view, sidescroller...):
                </label>
                <textarea
                    value={graphic_view}
                    onChange={handleGraphicViewChange}>
                </textarea>
            </div>
            <div>
                <label>
                    Graphic Style (pixel art, cartoon, animated, vector graphics, hand drawn, minimalist, retro, realistic, abstract, paper cut out, fantasy...):
                </label>
                <textarea
                    value={graphic_style}
                    onChange={handleGraphicStyleChange}>
                </textarea>
            </div>
            <div>
                <label>
                    Multiplayer Type (single player, online multiplayer, local multiplayer, online co-op...):
                </label>
                <textarea
                    value={multiplayer_option}
                    onChange={handleMultiplayerOptionChange}>
                </textarea>
            </div>
            <div>
                <button onClick={() => callApi()}>Generate Game Details!</button>
            </div>
            <div className="container">
                <label htmlFor="plot">Plot:</label>
                <textarea id="plot" readOnly>{plot}</textarea>
            </div>
            <div className="container">
                <label htmlFor="characters">Characters:</label>
                <textarea id="characters" readOnly>{characters}</textarea>
            </div>
            <div className="container">
                <label htmlFor="colour_scheme">Colour Scheme:</label>
                <textarea id="colour_scheme" readOnly>{colour_scheme}</textarea>
            </div>
            <div className="container">
                <label htmlFor="style_keywords">Style Keywords:</label>
                <textarea id="style_keywords" readOnly>{style_keywords}</textarea>
            </div>
            <div className="container">
                <label htmlFor="environments">Environments:</label>
                <textarea id="environments" readOnly>{environments}</textarea>
            </div>
        </div>
  );
};

export default GameStoryBoard;