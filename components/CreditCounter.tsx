import React from 'react';

interface CreditCounterProps {
    credits: number;
    onAuthClick: () => void;
}

export const CreditCounter: React.FC<CreditCounterProps> = ({ credits, onAuthClick }) => {
    return (
        <div className="mt-8 text-center bg-gray-50/70 rounded-xl p-4 border border-gray-200/80">
            <p className="text-sm text-gray-600">
                您还剩余 <span className="font-bold text-indigo-600">{credits}</span> 次生成机会。
            </p>
            <p className="text-xs text-gray-500 mt-1">
                需要更多次数？联系站长 (微信: <span className="font-mono">dreamger</span>) 花费9.9元购买10次。
                <button onClick={onAuthClick} className="ml-2 text-indigo-600 hover:underline font-semibold">
                    已有兑换码？
                </button>
            </p>
        </div>
    );
};