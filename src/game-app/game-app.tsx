import React, { useState, useEffect } from 'react';
import { withAuthenticator, WithAuthenticatorProps } from '@aws-amplify/ui-react';
import Sidebar from './sidebar';
import GameStoryBoard from './game-story-board';
import { GameStoryBoardState } from './game-story-board';
import { CharacterTilesheetsState } from './character-tilesheets';
import { EnvironmentTilesheetsState } from './environment-tilesheets';
import EnvironmentTilesheets from './environment-tilesheets';
import CharacterTilesheets from './character-tilesheets';
import StartingScreen from './starting-screen';
import { StartingScreenState } from './starting-screen';
import { InteractiveItemTilesheetsState } from './interactive-items-tilesheets';
import InteractiveItemTilesheets from './interactive-items-tilesheets';
import { NonInteractiveItemTilesheetsState } from './non-interactive-items-tilesheets';
import NonInteractiveItemTilesheets from './non-interactive-items-tilesheets';
// import '../index.css'; 


const GameApp: React.FC<WithAuthenticatorProps> = ({ signOut }) => {
    const [activeSidebarItem, setActiveSidebarItem] = useState<string>('startingScreen');
    const initialGameState: GameStoryBoardState = {
        gameDescription: '',
        gameType: '',
        graphicView: '',
        graphicStyle: '',
        multiplayerOption: '',
        plot: '',
        styleKeywords: '',
        colourSchemes: [{ colour: '', label: '' }], // Assuming these are arrays, initialize them as empty arrays
        environments: [{ name: '', description: '' }], // Assuming these are arrays, initialize them as empty arrays
        characters: [{ name: '', description: '', label: '' }], // Assuming these are arrays, initialize them as empty arrays
    };
    const [gameData, setGameData] = useState<GameStoryBoardState>(initialGameState);
    const [startingScreenState, setStartingScreenState] = useState<StartingScreenState>({} as StartingScreenState);
    const [characterTilesheetsData, setCharacterTilesheetsData] = useState<CharacterTilesheetsState>({
        storyBoardState: initialGameState,
        imageUrls: {},
        loadingImages: {},
    });
    const [environmentTilesheetsData, setEnvironmentTilesheetsData] = useState<EnvironmentTilesheetsState>({
        storyBoardState: initialGameState,
        imageUrls: {},
        loadingImages: {},
    });
    const [interactiveItemTilesheetsData, setInteractiveItemTilesheetsData] = useState<InteractiveItemTilesheetsState>({
        storyBoardState: initialGameState,
        imageUrls: {},
        loadingImages: {},
        interactiveItems: {}
    });
    const [nonInteractiveItemTilesheetsData, setNonInteractiveItemTilesheetsData] = useState<NonInteractiveItemTilesheetsState>({
        storyBoardState: initialGameState,
        imageUrls: {},
        loadingImages: {},
        interactiveItems: {}
    });
    const menuOptions = {
        startingScreen: {
            itemName: 'startingScreen',
            menuText: 'Start Here'
        },
        storyBoard: {
            itemName: 'storyBoard',
            menuText: 'Game Story Board'
        },
        characterTilesheets: {
            itemName: 'characterTilesheets',
            menuText: 'Character Tilesheets'
        },
        environmentTilesheets: {
            itemName: 'environmentTilesheets',
            menuText: 'Environment Tilesheets'
        },
        interactiveItemTilesheets: {
            itemName: 'interactiveItemTilesheets',
            menuText: 'Interactive Item Tilesheets'
        },
        nonInteractiveItemTilesheets: {
            itemName: 'nonInteractiveItemTilesheets',
            menuText: 'Non-Interactive Item Tilesheets'
        },
        // tokenShop: {
        //     itemName: 'tokenShop',
        //     menuText: 'Token Shop'
        // },
    };

    useEffect(() => {
        console.log('useEffect called');
        setCharacterTilesheetsData(prevState => ({
            ...prevState,
            storyBoardState: gameData
        }));
        setEnvironmentTilesheetsData(prevState => ({
            ...prevState,
            storyBoardState: gameData
        }));
        setInteractiveItemTilesheetsData(prevState => ({
            ...prevState,
            storyBoardState: gameData
        }));
        setNonInteractiveItemTilesheetsData(prevState => ({
            ...prevState,
            storyBoardState: gameData
        }));
    }, [gameData]); // Dependency array with gameData

    useEffect(() => {
        console.log('Active sidebar item:', activeSidebarItem);
    }, [activeSidebarItem]); // Log active sidebar item changes

    return (
        <div className="flex">
            <Sidebar onItemSelected={setActiveSidebarItem} signOut={signOut} menuOptions={menuOptions} />

            <div className="flex-1 p-4">
                {activeSidebarItem === 'startingScreen' && (
                    <StartingScreen state={startingScreenState} setState={setStartingScreenState} />
                )}
                {activeSidebarItem === 'storyBoard' && (
                    <GameStoryBoard state={gameData} setState={setGameData} apiKey={startingScreenState.apiKey}/>
                )}
                {activeSidebarItem === 'characterTilesheets' && (
                    <CharacterTilesheets state={characterTilesheetsData} setState={setCharacterTilesheetsData} apiKey={startingScreenState.apiKey}/>
                )}
                {activeSidebarItem === 'environmentTilesheets' && (
                    <EnvironmentTilesheets state={environmentTilesheetsData} setState={setEnvironmentTilesheetsData} apiKey={startingScreenState.apiKey}/>
                )}
                {activeSidebarItem === 'interactiveItemTilesheets' && (
                    <InteractiveItemTilesheets state={interactiveItemTilesheetsData} setState={setInteractiveItemTilesheetsData} apiKey={startingScreenState.apiKey}/>
                )}
                {activeSidebarItem === 'nonInteractiveItemTilesheets' && (
                    <NonInteractiveItemTilesheets state={nonInteractiveItemTilesheetsData} setState={setNonInteractiveItemTilesheetsData} apiKey={startingScreenState.apiKey}/>
                )}
                {/* {activeSidebarItem === 'tokenShop' && (
                    <TokenShop />
                )} */}
            </div>

            
        </div>
    );
};

export default withAuthenticator(GameApp);