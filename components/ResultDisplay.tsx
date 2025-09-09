import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ResultDisplayProps {
    generatedImage: string | null;
    isLoading: boolean;
    error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, isLoading, error }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl p-4 min-h-[300px] md:min-h-full border border-gray-200/80">
            {isLoading && (
                <div className="text-center text-gray-600">
                    <SpinnerIcon />
                    <p className="mt-4 font-medium">正在生成您的杰作...</p>
                    <p className="text-sm text-gray-500">这可能需要一点时间。</p>
                </div>
            )}
            {!isLoading && error && (
                <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
                     <p className="font-semibold">哦不！出错了。</p>
                     <p className="text-sm">{error}</p>
                </div>
            )}
            {!isLoading && !error && generatedImage && (
                <div className="text-center">
                    <img
                        src={generatedImage}
                        alt="生成的头像"
                        className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-3xl shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-105"
                    />
                     <a href={generatedImage} download="my-anime-avatar.png" className="mt-6 inline-block bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors">
                        下载
                    </a>
                </div>
            )}
             {!isLoading && !error && !generatedImage && (
                 <div className="text-center text-gray-500">
                    <div className="w-24 h-24 bg-gray-200 rounded-3xl mx-auto flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="mt-4 font-medium">您生成的头像将显示在此处。</p>
                 </div>
            )}
        </div>
    );
};