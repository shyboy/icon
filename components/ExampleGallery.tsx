import React from 'react';
import { EXAMPLE_AVATARS } from '../constants';

export const ExampleGallery: React.FC = () => {
    return (
        <div className="flex justify-center items-center gap-4 md:gap-6 flex-wrap">
            {EXAMPLE_AVATARS.map((avatar) => (
                <div key={avatar.id} className="text-center group">
                    <div className={`relative w-24 h-24 md:w-32 md:h-32 p-1.5 rounded-3xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl ${avatar.bgColor}`}>
                         <img
                            src={avatar.imageUrl}
                            alt={avatar.name}
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                    <p className="mt-3 text-sm md:text-base text-gray-500 font-medium transition-colors duration-300 group-hover:text-gray-800">
                        {avatar.name}
                    </p>
                </div>
            ))}
        </div>
    );
};