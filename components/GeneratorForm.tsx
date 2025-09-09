import React, { useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import type { GenerateFormState } from '../types';

interface GeneratorFormProps {
    formState: GenerateFormState;
    setFormState: React.Dispatch<React.SetStateAction<GenerateFormState>>;
    onGenerate: () => void;
    isLoading: boolean;
    credits: number;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ formState, setFormState, onGenerate, isLoading, credits }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormState(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <span className="block text-sm font-medium text-gray-600 mb-2">1. 上传您的自拍</span>
                 <label
                    htmlFor="file-upload"
                    className="mt-1 flex cursor-pointer flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-indigo-500 transition-colors"
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg mb-4" />
                    ) : (
                        <div className="space-y-1 text-center">
                            <UploadIcon />
                            <div className="flex text-sm text-gray-600 justify-center">
                                <p className="font-medium text-indigo-600 hover:text-indigo-400">
                                    <span>上传文件</span>
                                </p>
                                <p className="pl-1">或拖拽到此处</p>
                            </div>
                            <p className="text-xs text-gray-500">支持PNG, JPG, GIF格式，最大10MB</p>
                        </div>
                    )}
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                </label>
            </div>

            <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-600">2. 添加文字 (可选)</label>
                <input
                    type="text"
                    name="text"
                    id="text"
                    value={formState.text}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="例如：你的名字"
                />
            </div>
            
            <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-600">3. 文字位置</label>
                <select
                    id="position"
                    name="position"
                    value={formState.position}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>底部居中</option>
                    <option>顶部居中</option>
                    <option>左下角</option>
                    <option>右下角</option>
                    <option>左上角</option>
                    <option>右上角</option>
                </select>
            </div>

            <button
                onClick={onGenerate}
                disabled={isLoading || !formState.image || credits <= 0}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                {isLoading ? '生成中...' : `生成头像 (剩余 ${credits} 次)`}
            </button>
        </div>
    );
};