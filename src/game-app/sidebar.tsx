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
        <div className="sticky top-0 w-64 h-screen bg-gray-200 p-4">
            <h2 className="font-bold text-lg mb-4">Sidebar</h2>
            <ul className="list-none">
                {Object.keys(menuOptions).map((item) => (
                    <li key={item} className="mb-2">
                        <button onClick={() => onItemSelected(item)} className="text-blue-600 hover:text-blue-800">
                            {menuOptions[item].menuText}
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={signOut} className="bg-red-600 hover:bg-red-800 text-white p-2 mt-4 w-full rounded">Sign Out</button>
        </div>
    );
};

export default Sidebar;