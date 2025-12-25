import React from 'react';

const Hero = () => {
    return (
        <section className="relative pt-36 pb-20 lg:pt-52 lg:pb-32 overflow-hidden min-h-screen flex items-center" id="home">
            {/* Abstract Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-200/40 dark:bg-primary-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary-200/40 dark:bg-secondary-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-pink-200/40 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    {/* Text Content */}
                    <div className="lg:w-1/2 text-center lg:text-left z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-md text-primary-700 dark:text-primary-300 text-sm font-bold mb-8 animate-fade-in-up shadow-sm">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                            </span>
                            New Arrivals: Pre-Primary Uniforms
                        </div>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 animate-fade-in-up leading-[0.9] text-gray-900 dark:text-white" style={{ animationDelay: '0.1s' }}>
                            Fueling <br />
                            <span className="text-gradient">Bright Minds</span>
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 mb-10 animate-fade-in-up max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium" style={{ animationDelay: '0.2s' }}>
                            Your one-stop destination for nutritious snacks, refreshing beverages, and premium school uniforms. Quality you can trust.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <a href="#products" className="px-8 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                                Explore Products
                                <span className="material-symbols-rounded">arrow_downward</span>
                            </a>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="lg:w-1/2 relative mt-12 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="relative z-0 transform hover:scale-105 transition duration-700 animate-float">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-purple-500/20 rounded-full blur-[60px] -z-10"></div>
                            <img
                                alt="Student Mart Products"
                                className="mx-auto w-full max-w-2xl object-contain drop-shadow-2xl"
                                src="https://ik.imagekit.io/m1aziocop/Student%20Mart-removebg-preview.jpg?updatedAt=1754385249571"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
