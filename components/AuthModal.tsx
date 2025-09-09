import React, { useState } from 'react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (key: string) => { success: boolean; message?: string };
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [key, setKey] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        const result = onLogin(key);
        if (result.success) {
            onClose();
            setKey('');
            setError('');
        } else {
            setError(result.message || '发生未知错误。');
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl p-8 m-4 max-w-sm w-full transform transition-all" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">输入兑换码</h2>
                <p className="text-gray-600 mb-6">输入您购买的兑换码，为您的账户增加10次生成次数。</p>
                
                <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                        setKey(e.target.value);
                        setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="例如：AVATAR-DREAM-001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Account Key Input"
                />

                {error && <p className="text-red-500 text-sm mt-2" role="alert">{error}</p>}
                
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                        取消
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        激活
                    </button>
                </div>
            </div>
        </div>
    );
};