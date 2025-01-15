import React, { ReactNode } from 'react';

interface LeftHalfProps {
    children: ReactNode;
}

const LeftHalf: React.FC<LeftHalfProps> = ({ children }) => {
    return (

        <div className="flex flex-1 relative">

            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
                <div className="bg-white rounded-lg shadow-lg p-6 w-96">

                    {children}

                </div>
            </div>
            
        </div>

    );
};

export default LeftHalf;