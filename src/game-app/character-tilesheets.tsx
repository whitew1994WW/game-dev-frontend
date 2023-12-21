import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import '../index.css'; 
import { GameStoryBoardState, Character } from './game-story-board';
import { getCurrentUser } from 'aws-amplify/auth';

enum ImageLoadingState {
    NotLoaded,
    Loading,
    Loaded
}
// Image urls are looked up by character name
interface ImageLookup {
    [key: string]: string;
}

interface LoadingImageLookup {
    [key: string]: ImageLoadingState;
}

export interface CharacterTilesheetsState {
    storyBoardState: GameStoryBoardState;
    imageUrls: ImageLookup;
    loadingImages: LoadingImageLookup;
}

interface CharacterApiRequest {
    storyBoardState: GameStoryBoardState;
    character: Character;
    username: string;
    apiKey: string;
}

// Assuming you have a separate interface or type for the response of your API
interface CharacterApiResponse {
    imageUrl: string;
}




const CharacterTilesheets: React.FC<{ state: CharacterTilesheetsState; setState: Dispatch<SetStateAction<CharacterTilesheetsState>>; apiKey: string }> = ({ state, setState, apiKey }) => {

    const setLoadingCharacter = async (character: Character, loadingState: ImageLoadingState) => {
        setState(prevState => {
            const updatedLoadingLookup = { ...prevState.loadingImages, [character.name + character.description + character.label]: loadingState };
            return { ...prevState, loadingImages: updatedLoadingLookup };
        });
    };
    
    const fetchCharacterImage = async (character: Character) => {
        const currentUser = await getCurrentUser();
        const apiRequest: CharacterApiRequest = { storyBoardState: state.storyBoardState, character, username: currentUser.username, apiKey };

        const response = await fetch('/api/generate_character_tilesheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Customer-Username': currentUser.username
            },
            body: JSON.stringify(apiRequest),
        });
        const data: CharacterApiResponse = await response.json();
        return data.imageUrl;
    };

    const handleButtonClick = async (character: Character) => {
        setLoadingCharacter(character, ImageLoadingState.Loading);
        try {
            const imageUrl = await fetchCharacterImage(character);
            setState(prevState => {
                const updatedUrlLookup = { ...prevState.imageUrls, [character.name + character.description + character.label]: imageUrl };
                return { ...prevState, imageUrls: updatedUrlLookup };
            });
        } catch (error) {
            console.log('Error fetching character image:', error);
        } 
        setLoadingCharacter(character, ImageLoadingState.Loaded);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Character Display</h1>
            {state.storyBoardState.characters.map(character => {
                if (Object.values(character).some(value => value === '')) {
                    return null;
                }

                const characterKey = character.name + character.description + character.label;
                const loadingState = state.loadingImages[characterKey];
                const imageUrl = state.imageUrls[characterKey];

                return (
                    <div key={character.id} className="border p-4 mb-4 flex items-center">
                        <div className="flex-grow mr-4"> {/* Add a margin to the right */}
                            <h1 className="text-lg font-bold">{character.name}</h1>
                            <p>{character.description}</p>
                        </div>
                        {loadingState === ImageLoadingState.Loading && (
                            <div className="loader flex-shrink-0"></div>  
                        )}
                        {(loadingState === ImageLoadingState.Loaded && imageUrl) && (
                            <div className="flex-shrink-0">
                                <img src={imageUrl} alt={character.name} className="max-w-lg" />
                                <button
                                    onClick={() => handleButtonClick(character)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                                >
                                Regenerate Image
                            </button>
                            </div>
                        )}
                        {(loadingState === ImageLoadingState.NotLoaded || !loadingState) && (
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => handleButtonClick(character)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Generate Image
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CharacterTilesheets;