import React from 'react';

interface BlueButtonProps {
  buttonContent: string;
}

const BlueButton: React.FC<BlueButtonProps> = ({ buttonContent }) => {

    return (

        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300">
            {buttonContent}
        </button>

    );
};

export default BlueButton;