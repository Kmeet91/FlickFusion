import React from 'react';
import { Oval } from 'react-loader-spinner';

const Loader = () => {
    return (
        <div className="bg-[#141414] h-screen flex justify-center items-center">
            <Oval
                height={80}
                width={80}
                color="#e50914"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#e50914"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
        </div>
    );
};

export default Loader;