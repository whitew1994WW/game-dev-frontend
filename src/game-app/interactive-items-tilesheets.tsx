import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import '../index.css'; 
import { GameStoryBoardState, Environment } from './game-story-board';
import { getCurrentUser } from 'aws-amplify/auth';

enum ImageLoadingState {
    NotLoaded,
    Loading,
    Loaded
}
// Image urls are looked up by Environment name
interface ImageLookup {
    [key: string]: string;
}

interface LoadingImageLookup {
    [key: string]: ImageLoadingState;
}

interface InteractiveItemsLookup {
    [key: string]: String;
}

export interface InteractiveItemTilesheetsState {
    storyBoardState: GameStoryBoardState;
    imageUrls: ImageLookup;
    loadingImages: LoadingImageLookup;
    interactiveItems: InteractiveItemsLookup;
}

interface InteractiveItemApiRequest {
    storyBoardState: GameStoryBoardState;
    environment: Environment;
    username: string;
    apiKey: string;
}

// Assuming you have a separate interface or type for the response of your API
interface InteractiveItemApiResponse {
    interactiveItems: String;
    imageUrl: string;
}




const InteractiveItemTilesheets: React.FC<{ state: InteractiveItemTilesheetsState; setState: Dispatch<SetStateAction<InteractiveItemTilesheetsState>>; apiKey: string }> = ({ state, setState, apiKey }) => {

    const setLoadingEnvironment = async (Environment: Environment, loadingState: ImageLoadingState) => {
        setState(prevState => {
            const updatedLoadingLookup = { ...prevState.loadingImages, [Environment.name + Environment.description + Environment.label]: loadingState };
            return { ...prevState, loadingImages: updatedLoadingLookup };
        });
    };
    
    const fetchEnvironmentImage = async (environment: Environment) => {
        const currentUser = await getCurrentUser();
        const apiRequest: InteractiveItemApiRequest = { storyBoardState: state.storyBoardState, environment, username: currentUser.username, apiKey };

        const response = await fetch('/api/generate_interactive_items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Customer-Username': currentUser.username
            },
            body: JSON.stringify(apiRequest),
        });
        const data: InteractiveItemApiResponse = await response.json();
        return data;
    };

    const handleButtonClick = async (Environment: Environment) => {
        setLoadingEnvironment(Environment, ImageLoadingState.Loading);
        try {
            const data = await fetchEnvironmentImage(Environment);
            const imageUrl = data.imageUrl;
            const interactiveItems = data.interactiveItems;
            setState(prevState => {
                const updatedUrlLookup = { ...prevState.imageUrls, [Environment.name + Environment.description + Environment.label]: imageUrl };
                const updatedInteractiveItemsLookup = { ...prevState.interactiveItems, [Environment.name + Environment.description + Environment.label]: interactiveItems };
                return { ...prevState, imageUrls: updatedUrlLookup, interactiveItems: updatedInteractiveItemsLookup };
            });
        } catch (error) {
            console.log('Error fetching Environment image:', error);
        } 
        setLoadingEnvironment(Environment, ImageLoadingState.Loaded);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Interactive Item Tilesheets</h1>
            {state.storyBoardState.environments.map(environment => {
                if (Object.values(environment).some(value => value === '')) {
                    return null;
                }

                const EnvironmentKey = environment.name + environment.description + environment.label;
                const loadingState = state.loadingImages[EnvironmentKey];
                const imageUrl = state.imageUrls[EnvironmentKey];

                return (
                    <div key={environment.id} className="border p-4 mb-4 flex items-center">
                        <div className="flex-grow mr-4"> {/* Add a margin to the right */}
                            <h1 className="text-lg font-bold">{environment.name}</h1>
                            <p>{environment.description}</p>
                            <p><b>Interactive Items:</b></p>
                            {state.interactiveItems[EnvironmentKey] && (
                                <p>{state.interactiveItems[EnvironmentKey]}</p>
                            )}
                        </div>
                        {loadingState === ImageLoadingState.Loading && (
                            <div className="loader flex-shrink-0"></div>  
                        )}
                        {(loadingState === ImageLoadingState.Loaded && imageUrl) && (
                            <div className="flex-shrink-0">
                                <img src={imageUrl} alt={environment.name} className="max-w-lg" />
                                <button
                                    onClick={() => handleButtonClick(environment)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                                >
                                Regenerate Image
                            </button>
                            </div>
                        )}
                        {(loadingState === ImageLoadingState.NotLoaded || !loadingState) && (
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => handleButtonClick(environment)}
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

export default InteractiveItemTilesheets;