'use client';

import { useState, useEffect } from 'react';

export default function RealTimeClock() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <div className='text-base font-medium text-gray-500'>
            {formattedTime}
        </div>
    );
}

