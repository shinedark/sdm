'use client';

import Footer from '../components/Footer';

export default function Vision() {
    return (
        <div className="flex flex-col min-h-screen relative">
            <main className="flex-1 flex items-center justify-center p-8 relative z-10 bg-white">
                <div className="text-black max-w-4xl space-y-8 px-8 py-12 md:px-12 md:py-16 bg-white" >
                    <section className="text-center mb-8">
                        <h1 className="text-6xl font-bold m-1 p-2 bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-700 to-gray-900">
                            Awakening Human Being
                        </h1>
                        <h1 className="text-6xl font-bold p-2  bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-700 to-gray-900">
                            Via
                        </h1>
                        <h1 className="text-6xl font-bold m-1 p-2 bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-700 to-gray-900">
                            Technology & Art
                        </h1>
                    </section>
                    <iframe
                        style={{ border: '1px #FFFFFF hidden' }}
                        src="https://shinedark.dev/"
                        title="iFrame"
                        width="100%"
                        height="300px"
                        scrolling="yes"
                        frameBorder="no"
                        allow=""
                    />
                    <section className="space-y-6">
                        <h2 className="text-4xl font-bold mb-8 text-black">Vision</h2>
                        <div className="bg-white backdrop-blur-sm p-8 md:p-10 space-y-8">
                            <p className="text-gray-800 leading-relaxed text-lg">
                                We are on a mission to be an inspiration for anyone who wants to learn, grow, and create.
                                As a record label and artist, I&apos;m setting out to change and remind people of what an artist can do.
                                Our motto at the label has been &quot;Awakening Human Beings via Technology & Art&quot; and that&apos;s exactly what we are going to do.
                            </p>

                            <p className="text-gray-800 leading-relaxed text-lg">
                                Using technology and ingenuity, I will be creating and developing a replicable process to create
                                a new culture for America&apos;s modern farmer. Showing how self-sufficiency and collaboration can
                                revamp America&apos;s production of goods.
                            </p>

                            <p className="text-gray-800 leading-relaxed text-lg">
                                The idea is to show the cost, process, and development over the next 5 years, and generate
                                a process and culture for farmers and builders to make a new &quot;Made in America&quot; possible and affordable.
                            </p>

                            <p className="text-gray-800 leading-relaxed text-lg">
                                Our purpose is to inspire and cultivate minds in this time of change.
                            </p>
                        </div>
                    </section>
                    <section className="space-y-6">
                        <h2 className="text-4xl font-bold mb-8 text-black">Why</h2>
                        <div className="bg-white  backdrop-blur-sm p-8 md:p-10 space-y-8 ">
                            <p className="text-gray-800 leading-relaxed text-lg">Shine Dark&apos;s vision was born from a deeply personal journey shaped by his own health challenges. Struggling to find balance and resilience, he realized the transformative power of self-awareness, creativity, and innovation. This awakening inspired him to create a platform where technology and art intersect to empower others. His mission is not only to redefine what it means to be an artist but also to develop a sustainable, collaborative culture for modern farmers and builders. By sharing his process and vision, Shine Dark hopes to inspire individuals to grow, create, and embrace a new era of self-sufficiency and possibility.</p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
} 