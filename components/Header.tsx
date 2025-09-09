import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                AI动漫头像生成器
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
                用AI魔法，将您的自拍照变成独一无二的动漫风格头像。
            </p>
        </header>
    );
};