import React from 'react';

const Background = () => {
    return (
        <div className='fixed w-[100%] -z-10 '>
            <div className='h-screen bg-[var(--backgroundLight)]'></div>
        </div>
    );
};

export default Background;
