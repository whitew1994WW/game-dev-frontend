import React, { useState, useEffect } from 'react';
import { withAuthenticator, WithAuthenticatorProps } from '@aws-amplify/ui-react';
import Sidebar from './sidebar';
import GameStoryBoard from './game-story-board';
import { GameStoryBoardState } from './game-story-board';
import { CharacterTilesheetsState } from './character-tilesheets';
import CharacterTilesheets from './character-tilesheets';
import TokenShop from './token-shop';
import '../index.css'; 


const GameApp: React.FC<WithAuthenticatorProps> = ({ signOut }) => {
    const [activeSidebarItem, setActiveSidebarItem] = useState<string>('storyBoard');
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
    const [characterTilesheetsData, setCharacterTilesheetsData] = useState<CharacterTilesheetsState>({
        storyBoardState: initialGameState,
        imageUrls: {},
        loadingImages: {},
    });
    const menuOptions = {
        storyBoard: {
            itemName: 'storyBoard',
            menuText: 'Game Story Board'
        },
        characterTilesheets: {
            itemName: 'characterTilesheets',
            menuText: 'Character Tilesheets'
        },
        tokenShop: {
            itemName: 'tokenShop',
            menuText: 'Token Shop'
        },
    };

    useEffect(() => {
        console.log('useEffect called');
        setCharacterTilesheetsData(prevState => ({
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
                {activeSidebarItem === 'storyBoard' && (
                    <GameStoryBoard state={gameData} setState={setGameData} />
                )}
                {activeSidebarItem === 'characterTilesheets' && (
                    <CharacterTilesheets state={characterTilesheetsData} setState={setCharacterTilesheetsData} />
                )}
                {activeSidebarItem === 'tokenShop' && (
                    <TokenShop />
                )}
            </div>

            
        </div>
    );
};

export default withAuthenticator(GameApp);