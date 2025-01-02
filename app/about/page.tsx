'use client';
import Footer from '../components/Footer';

export default function About() {
    return (
        <div className="flex flex-col min-h-screen relative">
            <main className="flex-1 flex items-center justify-center p-8 relative z-10 bg-white">
                <div className="text-black max-w-4xl space-y-16 mt-16 px-8 py-12 md:px-12 md:py-16 bg-white">
                    <section className="text-center mb-16">
                        <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-700 to-gray-900">
                            About
                        </h1>
                    </section>

                    <section className="space-y-6">
                        <div className="bg-white backdrop-blur-sm p-8 md:p-10 space-y-8">
                            <p className="text-gray-800 leading-relaxed text-lg">
                                Shine Dark's battles with health have profoundly shaped his vision of what an artist can be. Inspired by his struggles, he envisions a new archetype of artist. His health challenges led him to explore self-sufficiency and the healing power of food and technology which in turn inspired him to merge these experiences into his artistic expression.
                            </p>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                As a record label and artist, Shine is setting out to redefine the role of artists in society, demonstrating that creativity can extend beyond traditional mediums into the cultivation of both crops and culture. His mission is to awaken human beings through the synergy of technology and art, specifically by developing a replicable process.
                            </p>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                Over the next five years, he aims to illustrate the cost, process, and development of this vision, fostering a new culture revitalized "Made in America" both possible and affordable. Through this, Shine seeks to inspire and cultivate minds during this era of change, showing that art and agriculture can be deeply interconnected paths to personal and communal healing.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="bg-white backdrop-blur-sm p-8 md:p-10">
                            <iframe
                                title="Shine Dark - WHAT IS CRAZY"
                                width="100%"
                                height="300"
                                loading="lazy"
                                scrolling="no"
                                frameBorder="no"
                                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961782483&color=%23b0a8a4&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                            />
                            <div style={{ fontSize: '10px', color: '#cccccc', lineBreak: 'anywhere', wordBreak: 'normal', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif', fontWeight: 100 }}>
                                <a
                                    href="https://soundcloud.com/shinedark"
                                    title="Shine Dark"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#cccccc', textDecoration: 'none' }}
                                >
                                    Shine Dark
                                </a> · <a
                                    href="https://soundcloud.com/shinedark/what-is-crazy"
                                    title="WHAT IS CRAZY"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#cccccc', textDecoration: 'none' }}
                                >
                                    WHAT IS CRAZY
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
} 