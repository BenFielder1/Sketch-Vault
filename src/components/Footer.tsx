import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-900  text-white py-12 relative overflow-hidden">
            {/* <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
            </div> */}

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg"></div>
                            <p className="text-2xl font-bold ">
                                Ben Fielder
                            </p>
                        </div>
                        <p className="text-gray-300 text-lg">Software Engineer</p>
                        {/* <p className="text-gray-400 text-sm mt-1">Creating interactive experiences with code</p> */}
                    </div>

                    <div className="flex space-x-6">
                        <Link
                            href="https://benfielder.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                            aria-label="portfolio"
                        >
                            <svg className="h-6 w-6 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 640 640">
                                <path d="M415.9 344L225 344C227.9 408.5 242.2 467.9 262.5 511.4C273.9 535.9 286.2 553.2 297.6 563.8C308.8 574.3 316.5 576 320.5 576C324.5 576 332.2 574.3 343.4 563.8C354.8 553.2 367.1 535.8 378.5 511.4C398.8 467.9 413.1 408.5 416 344zM224.9 296L415.8 296C413 231.5 398.7 172.1 378.4 128.6C367 104.2 354.7 86.8 343.3 76.2C332.1 65.7 324.4 64 320.4 64C316.4 64 308.7 65.7 297.5 76.2C286.1 86.8 273.8 104.2 262.4 128.6C242.1 172.1 227.8 231.5 224.9 296zM176.9 296C180.4 210.4 202.5 130.9 234.8 78.7C142.7 111.3 74.9 195.2 65.5 296L176.9 296zM65.5 344C74.9 444.8 142.7 528.7 234.8 561.3C202.5 509.1 180.4 429.6 176.9 344L65.5 344zM463.9 344C460.4 429.6 438.3 509.1 406 561.3C498.1 528.6 565.9 444.8 575.3 344L463.9 344zM575.3 296C565.9 195.2 498.1 111.3 406 78.7C438.3 130.9 460.4 210.4 463.9 296L575.3 296z"></path>
                            </svg>
                        </Link>
                        <Link
                            href="https://github.com/BenFielder1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                            aria-label="GitHub"
                        >
                            <svg className="h-6 w-6 group-hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                            </svg>
                        </Link>
                        <Link
                            href="https://www.linkedin.com/in/ben-fielder-38a9ba276/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                            aria-label="LinkedIn"
                        >
                            <svg className="h-6 w-6 group-hover:text-cyan-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/20 text-center">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
                        <p className="text-gray-300 text-sm mb-2">
                            © {new Date().getFullYear()} Ben Fielder. All rights reserved.
                        </p>
                        <p className="text-gray-400 text-sm">
                            Built with{' '}
                            <span className="text-purple-400 font-medium">Next.js</span>{' and '}
                            <span className="text-cyan-400 font-medium">Tailwind CSS</span>
                        </p>
                        <div className="mt-4 flex justify-center">
                            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}