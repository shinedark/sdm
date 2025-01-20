'use client';
import Footer from '../components/Footer';

export default function About() {
    return (
        <div className="flex flex-col min-h-screen relative pb-20">
            <main className="flex-1 flex items-center justify-center relative z-10 bg-white ">
                <div className="text-black max-w-4xl space-y-6 px-8 py-2 md:px-12 md:py-6 bg-white">
                    <section className="text-center">
                        <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-700 to-gray-900">
                            About
                        </h1>
                    </section>
                    <div className="bg-white backdrop-blur-sm md:p-10">
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
                    <section className="bg-white backdrop-blur-sm p-6 md:p-8 space-y-8">
                        <div className="bg-white">
                            <h2 className="text-2xl font-bold mb-4">Welcome to Shine Dark Music</h2>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                Shine Dark Music is a media company with a rich catalog of 186 tracks across 47 releases. We offer our music in both digital and physical formats, with 1 active vinyl release in inventory.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">Engaging with Our Community</h2>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                We&apos;re developing a unique mechanism to reward fans for sharing our records on social media through Opacity Network. This interaction generates a carbon footprint, which we aim to offset with our steel building farm project.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">Sustainability Commitment</h2>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                Our commitment to sustainability is at the core of our project. By transforming a warehouse into a self-sustaining environment in Colorado, we&apos;re not only growing food hydroponically but also exploring how sounds and information affect the growth of medicinal plants, acknowledging plants as sentient beings. This project embodies our tagline: Where Music Cultivates Sustainability.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">The Project Journey</h2>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                As Shine Dark, I code and create content to document our journey of building a self-sustaining, carbon-neutral setup. This living and working space includes a modular home, areas for entertainment and work, and a hydroponic farm, all driven by the belief that Awakening Human Begins via Technology & Art.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">Personal Health and Innovation</h2>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                My health journey, requiring a strict diet and the use of medical marijuana, has deeply influenced this project. It&apos;s about merging personal health needs with sustainable living, showcasing how this integration can lead to a cultural revolution.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">Social Media Integration</h2>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                We use our media presence to promote our project on social media, driving attention to how music can foster sustainability and health. Join us in this journey, where every note plays a part in cultivating a healthier planet and person.
                            </p>

                            <h2 className="text-2xl font-bold mb-4">Join Us</h2>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                Visit <a
                                    href="https://shinedark.dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    shinedark.dev
                                </a> to be part of this transformative project. Let&apos;s explore together how music can cultivate sustainability and how technology and art can awaken human potential.
                            </p>
                        </div>
                    </section>

                    <section className="bg-white backdrop-blur-sm p-6 md:p-8 space-y-8">
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

                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
} 