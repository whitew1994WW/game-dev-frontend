import React from 'react';
import '../index.css'; 
import { getCurrentUser } from 'aws-amplify/auth';


export interface Environment {
    [key: string]: any;
    name: string;
    description: string;
}

export interface Character {
    [key: string]: any;
    name: string;
    description: string;
    label: string;
}

interface ColourScheme {
    [key: string]: any;
    colour: string;
    label: string;
}

export interface GameStoryBoardState {
    gameDescription: string;
    gameType: string;
    graphicView: string;
    graphicStyle: string;
    multiplayerOption: string;
    plot: string;
    styleKeywords: string;
    colourSchemes: ColourScheme[];
    environments: Environment[];
    characters: Character[];
    isLoading?: boolean;
}

interface ApiRequest {
    storyBoardState: GameStoryBoardState;
    apiKey: string;
    username: string;
}

const initialGameState: GameStoryBoardState = {
    gameDescription: '',
    gameType: '',
    graphicView: '',
    graphicStyle: '',
    multiplayerOption: '',
    plot: '',
    styleKeywords: '',
    colourSchemes: [{ colour: '', label: '' }],
    environments: [{ name: '', description: '' }],
    characters: [{ name: '', description: '', label: '' }]
};

const StoryBoardTextAreaInput: React.FC<{label: string, value: string, onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void, height: string}> = ({label, value, onChange, height}) => {
    const className = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " + height;
    return (
            <div className="mb-4">
                <label className="block text-gray-700 text-m font-bold mb-2">
                    {label}
                </label>
                <textarea
                    className={className}
                    value={value}
                    onChange={onChange}>
                </textarea>
            </div>
        );
    };


// Take in GameState as props
const GameStoryBoard: React.FC<{ state: GameStoryBoardState; setState: React.Dispatch<React.SetStateAction<GameStoryBoardState>>; apiKey: string}> = ({ state, setState, apiKey}) => {
    const resetState = () => {
        setState(initialGameState);
    };

    const handleChange = (name: keyof GameStoryBoardState, value: string | any[]) => {
        setState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleItemChange = (listName: keyof GameStoryBoardState, index: number, field: keyof Character | keyof ColourScheme | keyof Environment, value: string) => {
        // parse field into one of  keyof Character | keyof ColourScheme | keyof Environment
        // const fieldKey = field as keyof Character | keyof ColourScheme | keyof Environment;
        const updatedList = (state[listName] as any[]).map((item, i) => 
            i === index ? { ...item, [field]: value } : item
        );
        setState({ ...state, [listName]: updatedList });
    };
    
    const addItemToList = (listName: keyof GameStoryBoardState, newItem: Character | ColourScheme | Environment) => {
        setState({ ...state, [listName]: [...(state[listName] as any[]), newItem] });
    };
    
    const removeItemFromList = (listName: keyof GameStoryBoardState, index: number) => {
        const updatedList = (state[listName] as any[]).filter((_, i) => i !== index);
        setState({ ...state, [listName]: updatedList });
    };
    
    const setOutputs = (data: GameStoryBoardState) => {
        console.log('setOutputs starting');
        setState(data);
        console.log('setOutputs finished');
    }

    const setIsLoading = (isLoading: boolean) => {
        setState(prevState => ({ ...prevState, isLoading }));
    }

    const callApi = async () => {
        setIsLoading(true); 
        const url = '/api/generate_all_details';
        console.log('Calling API:', url);
        try {
            const currentUser = await getCurrentUser();
            const apiRequest: ApiRequest = { 
                storyBoardState: state,
                username: currentUser.username,
                apiKey
            };
            const response = await fetch(url, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiRequest),
            });
            const data: GameStoryBoardState = await response.json();
            console.log('API Response:', data); // Log the API response
            // Check if the API return format is correct
            if (data.gameDescription === undefined) {
                throw new Error('API response is not in the expected format');
            }
            setOutputs(data);
            setIsLoading(false); 
        } catch (error) {
            console.error('Error calling the API:', error);
            setIsLoading(false);
        }
    };


    return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-2">Game Story Generator</h1>
                <StoryBoardTextAreaInput label="Game Description" value={state.gameDescription} onChange={(e) => handleChange('gameDescription', e.target.value)} height='h-24' />
                <StoryBoardTextAreaInput label="Game Type" value={state.gameType} onChange={(e) => handleChange('gameType', e.target.value)} height='h-12' />
                <StoryBoardTextAreaInput label="Graphic View" value={state.graphicView} onChange={(e) => handleChange('graphicView', e.target.value)} height='h-12' />
                <StoryBoardTextAreaInput label="Graphic Style" value={state.graphicStyle} onChange={(e) => handleChange('graphicStyle', e.target.value)} height='h-12' />
                <StoryBoardTextAreaInput label="Multiplayer Type" value={state.multiplayerOption} onChange={(e) => handleChange('multiplayerOption', e.target.value)} height='h-12' />
                <StoryBoardTextAreaInput label="Plot" value={state.plot} onChange={(e) => handleChange('plot', e.target.value)} height='h-24' />
                <StoryBoardTextAreaInput label="Style Keywords" value={state.styleKeywords} onChange={(e) => handleChange('styleKeywords', e.target.value)} height='h-12' />

                {/* Colour Schemes Section */}
                <TableSection
                    label="Colour Scheme"
                    items={state.colourSchemes}
                    onItemChange={(index, field, value) => handleItemChange('colourSchemes', index, field, value)}
                    onAddItem={() => addItemToList('colourSchemes', { colour: '', label: '' })}
                    onRemoveItem={(index) => removeItemFromList('colourSchemes', index)}
                    height="h-12"
                    headerFields={['Colour', 'Pallete Label']}
                    widths={['25%', '65%']}
                />

                {/* Environments Section */}
                <TableSection
                    label="Environments"
                    items={state.environments}
                    onItemChange={(index, field, value) => handleItemChange('environments', index, field, value)}
                    onAddItem={() => addItemToList('environments', { name: '', description: '' })}
                    onRemoveItem={(index) => removeItemFromList('environments', index)}
                    height="h-12"
                    headerFields={['Name', 'Description']}
                    widths={['25%', '65%']}
                />

                {/* Characters Section */}
                <TableSection
                    label="Characters"
                    items={state.characters}
                    onItemChange={(index, field, value) => handleItemChange('characters', index, field, value)}
                    onAddItem={() => addItemToList('characters', { name: '', description: '', label: '' })}
                    onRemoveItem={(index) => removeItemFromList('characters', index)}
                    height="h-12"
                    headerFields={['Name', 'Enemy/Player/Friendly', 'Description']}
                    widths={['25%', '15%', '50%']}
                />

                <div className="flex justify-between mt-4">

                    
                    {!state.isLoading && (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={callApi}>
                        Generate Game Details!
                    </button>
                    )}
                    {state.isLoading && (
                        <div className="loader"></div> // Replace with your spinner or loader component
                    )}
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={resetState}>
                        Clear State
                    </button>
                </div>
            </div>
    );
};

interface Item {
    [key: string]: string;
}

interface TableSectionProps {
    label: string;
    items: Item[];
    onItemChange: (index: number, field: string, value: string) => void;
    onAddItem: () => void;
    onRemoveItem: (index: number) => void;
    height: string;
    headerFields: string[];
    widths: string[];
}

const TableSection: React.FC<TableSectionProps> = ({ label, items, onItemChange, onAddItem, onRemoveItem, height, headerFields, widths}) => {
    const renderInputFields = (item: Item, index: number) => {
        const class_name = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " + height;
        return Object.keys(item).map((field) => (
            <td key={field} className="p-2">
                <input
                    type="text"
                    className={class_name}
                    value={item[field]}
                    onChange={(e) => onItemChange(index, field, e.target.value)}
                />
            </td>
        ));
    };

    const calculateWidth = (index: number) => {
        // Example: Adjust these widths based on your needs
        return widths[index] || 'auto'; // Default to 'auto' if no specific width is set
    };


    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}:</label>
            <table className="table-auto w-full mb-2">
                <thead>
                    <tr>
                        {headerFields.map((field, fieldIndex) => (
                            <th key={fieldIndex} className="text-gray-700 text-m" style={{ width: calculateWidth(fieldIndex) }}>
                                {field}
                            </th>
                        ))}
                        <th className="p-2" style={{ width: '10%' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            {renderInputFields(item, index)}
                            <td className="p-2 flex justify-center items-center">
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline" onClick={() => onRemoveItem(index)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={onAddItem}>
                Add {label}
            </button>
        </div>
    );
};


export default GameStoryBoard;
