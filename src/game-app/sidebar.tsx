import React from 'react';
import { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import '../index.css'; 

interface MenuOption {
    itemName: string;
    menuText: string;
}

interface menuOptions {
    [key: string]: MenuOption;
}

interface SidebarProps {
    onItemSelected: (item: string) => void;
    signOut: WithAuthenticatorProps['signOut'];
    menuOptions: menuOptions;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemSelected, signOut, menuOptions }) => {
    return (
        <div className="sticky top-0 w-64 h-screen bg-gray-800 text-white p-4">
            <h2 className="font-bold text-xl mb-6">Game Generator</h2>
            <ul className="list-none">
                {Object.keys(menuOptions).map((item) => (
                    <li key={item} className="mb-4">
                        <button onClick={() => onItemSelected(item)} className="text-lg text-gray-300 hover:text-white w-full text-left">
                            {menuOptions[item].menuText}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="absolute bottom-4">
                <button onClick={signOut} className="bg-blue-500 hover:bg-red-700 text-white py-2 px-4 w-full rounded transition duration-200 ease-in-out">
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;