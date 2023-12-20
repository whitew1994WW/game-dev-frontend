import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import '../index.css'; 
import { GameStoryBoardState, Character } from './game-story-board';


// Image urls are looked up by character name
interface ImageLookup {
    [key: string]: string;
}

interface LoadingImageLookup {
    [key: string]: boolean;
}

export interface CharacterTilesheetsState {
    storyBoardState: GameStoryBoardState;
    imageUrls: ImageLookup;
    loadingImages: LoadingImageLookup;
}

interface CharacterApiRequest {
    storyBoardState: GameStoryBoardState;
    character: Character;
}

// Assuming you have a separate interface or type for the response of your API
interface CharacterApiResponse {
    imageUrl: string;
}




const CharacterTilesheets: React.FC<{ state: CharacterTilesheetsState; setState: Dispatch<SetStateAction<CharacterTilesheetsState>> }> = ({ state, setState }) => {

    const setLoadingCharacter = async (character: Character) => {
        setState(prevState => {
            const updatedLoadingLookup = { ...prevState.loadingImages, [character.name]: true };
            return { ...prevState, loadingImages: updatedLoadingLookup };
        });
    };
    
    const fetchCharacterImage = async (character: Character) => {
        const apiRequest: CharacterApiRequest = { storyBoardState: state.storyBoardState, character };
        const response = await fetch('/api/generate_character_tilesheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiRequest),
        });
        const data: CharacterApiResponse = await response.json();
        return data.imageUrl;
    };

    const handleButtonClick = async (character: Character) => {
        setLoadingCharacter(character);
        const imageUrl = await fetchCharacterImage(character);
        setState(prevState => {
            const updatedUrlLookup = { ...prevState.imageUrls, [character.name + character.description + character.label]: imageUrl };
            return { ...prevState, imageUrls: updatedUrlLookup };
        });
        setLoadingCharacter(character);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Character Display</h1>
            {state.storyBoardState.characters.map((character, index) => {
                if (Object.values(character).some(value => value === '')) {
                    // If the character has no name, don't render anything for this character
                    return null;
                }

                return (
                    <div key={index} className="border p-4 mb-4 flex items-center">
                        <div className="flex-grow">
                            <h2 className="text-lg font-bold">{character.name}</h2>
                            <p>{character.description}</p>
                        </div>
                        {state.imageUrls[character.name + character.description + character.label] ? (
                        <img src={state.imageUrls[character.name + character.description + character.label]} alt={character.name} className="max-w-lg" />
                    ) : (
                        <button 
                            onClick={() => handleButtonClick(character)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={state.loadingImages[character.name]} // Disable the button if the character is loading
                        >
                            {state.loadingImages[character.name] ? (
                                <div className="loader"></div>  // Add your spinner or loader component or class here
                            ) : (
                                "Generate Image"
                            )}
                        </button>
                    )}
                    </div>
                );
            })}
        </div>
    );
};

export default CharacterTilesheets;