import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../Layout";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaCheckCircle, FaSearch } from 'react-icons/fa';
import { Skeleton } from "../../components/ui/skeleton";

export default function AudiobookDetail() {
    const { id } = useParams();
    const audiobookId = parseInt(id, 10);
    const [audiobook, setAudiobook] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('chapters');
    const [playbackRate, setPlaybackRate] = useState(1);
    const [currentChapter, setCurrentChapter] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const [skipSilence, setSkipSilence] = useState(false);
    const [search, setSearch] = useState('');
    const [completed, setCompleted] = useState([]);
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchAudiobook = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://bookcompass.onrender.com/api/books/singleBook/${id}`);
                if (!response.ok) {
                    throw new Error("Audiobook not found or API error");
                }
                const data = await response.json();
                setAudiobook(data.data || data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchAudiobook();
    }, [audiobookId]);

    const chapters = audiobook.chapters || [
        {
            title: audiobook.title || 'Audiobook',
            duration: audiobook.duration || 0,
            audioUrl: audiobook.audioUrl || audiobook.fileUrl || '',
        },
    ];

    const filteredChapters = chapters.filter(chap => chap.title.toLowerCase().includes(search.toLowerCase()));

    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleRateChange = (rate) => {
        setPlaybackRate(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    };

    const handleChapterSelect = (idx) => {
        setCurrentChapter(idx);
        setIsPlaying(true);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
            }
        }, 100);
    };

    const handleEnded = () => {
        setCompleted(prev => [...new Set([...prev, currentChapter])]);
        if (autoPlay && currentChapter < chapters.length - 1) {
            setCurrentChapter(currentChapter + 1);
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play();
                }
            }, 100);
        } else {
            setIsPlaying(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                    <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
                        <div className="flex flex-col items-center gap-6">
                            <Skeleton className="w-32 h-32 rounded-lg mx-auto" />
                            <Skeleton className="h-8 w-2/3 mx-auto" />
                            <Skeleton className="h-5 w-1/2 mx-auto" />
                            <Skeleton className="h-4 w-1/3 mx-auto" />
                            <div className="flex gap-2 justify-center mt-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-full mt-4" />
                            <Skeleton className="h-4 w-5/6 mt-2" />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !audiobook) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                    <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                            <FaPause className="h-6 w-6 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Audiobook Not Found</h2>
                        <p className="text-gray-600 mb-6">
                            {error || "The audiobook you're looking for doesn't exist in our collection."}
                        </p>
                        <Link
                            to="/ui/Audiobooks"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FaStepBackward className="h-5 w-5 mr-2" />
                            Back to Audiobooks
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-6 px-2 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Book Info Card */}
                    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden mb-4">
                        <div className="md:w-1/3 p-6 flex items-center justify-center bg-gray-100">
                            <img
                                src={audiobook.imageUrl}
                                alt={audiobook.title}
                                className="rounded-lg object-cover w-48 h-48 md:w-64 md:h-64 hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="md:w-2/3 p-8 flex flex-col justify-between">
                            <div>
                                <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mb-2">{audiobook.category || 'Audiobook'}</span>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{audiobook.title}</h1>
                                <p className="text-lg text-gray-600 mb-1">By {audiobook.author}</p>
                                {audiobook.narrator && <p className="text-sm text-gray-500 mb-2">Narrated by {audiobook.narrator}</p>}
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    {audiobook.description || `This is a premium audiobook of "${audiobook.title}" by ${audiobook.author}. Enjoy high-quality narration that brings the story to life.`}
                                </p>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" onClick={() => handleChapterSelect(currentChapter)}>
                                    <FaPlay className="inline mr-2" /> Play Now
                                </button>
                                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                                    Add to Library
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Audio Player Card */}
                    <div className="bg-blue-600 rounded-xl shadow-md p-6 mb-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div className="flex items-center gap-2 mb-2 md:mb-0">
                                <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded">Chapter {currentChapter + 1}</span>
                                <span className="bg-white text-blue-800 text-xs px-2 py-1 rounded">{playbackRate}x</span>
                                <span className="text-white font-semibold ml-2">{chapters[currentChapter].title}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center text-white text-xs cursor-pointer">
                                    <input type="checkbox" checked={autoPlay} onChange={() => setAutoPlay(v => !v)} className="mr-1" /> Auto-play
                                </label>
                                <label className="flex items-center text-white text-xs cursor-pointer">
                                    <input type="checkbox" checked={skipSilence} onChange={() => setSkipSilence(v => !v)} className="mr-1" /> Skip silence
                                </label>
                            </div>
                        </div>
                        <audio
                            ref={audioRef}
                            src={chapters[currentChapter].audioUrl}
                            controls={false}
                            onEnded={handleEnded}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onRateChange={e => setPlaybackRate(e.target.playbackRate)}
                        />
                        <div className="flex items-center gap-4 mt-2">
                            <button onClick={() => handleChapterSelect(Math.max(0, currentChapter - 1))} disabled={currentChapter === 0} className="text-white text-xl p-2 rounded hover:bg-blue-700 disabled:opacity-50"><FaStepBackward /></button>
                            <button onClick={handlePlayPause} className="text-white text-2xl p-2 rounded-full bg-blue-800 hover:bg-blue-900 mx-2">
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                            <button onClick={() => handleChapterSelect(Math.min(chapters.length - 1, currentChapter + 1))} disabled={currentChapter === chapters.length - 1} className="text-white text-xl p-2 rounded hover:bg-blue-700 disabled:opacity-50"><FaStepForward /></button>
                            <div className="flex items-center ml-4">
                                <FaVolumeUp className="text-white mr-2" />
                                <input type="range" min="0" max="1" step="0.01" defaultValue="1" onChange={e => { if (audioRef.current) audioRef.current.volume = e.target.value; }} />
                            </div>
                            <div className="flex items-center ml-4 gap-1">
                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                    <button
                                        key={rate}
                                        onClick={() => handleRateChange(rate)}
                                        className={`text-xs px-2 py-1 rounded ${playbackRate === rate ? 'bg-white text-blue-800 font-bold' : 'bg-blue-700 text-white'}`}
                                    >
                                        {rate}x
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex border-b mb-4">
                            <button onClick={() => setTab('chapters')} className={`px-4 py-2 font-semibold ${tab === 'chapters' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Chapters ({chapters.length})</button>
                            <button onClick={() => setTab('details')} className={`px-4 py-2 font-semibold ${tab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Details</button>
                            <button onClick={() => setTab('settings')} className={`px-4 py-2 font-semibold ${tab === 'settings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>Settings</button>
                        </div>
                        {tab === 'chapters' && (
                            <div>
                                <div className="flex items-center mb-4 gap-2">
                                    <div className="relative flex-1">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search chapters..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        />
                                    </div>
                                    <select className="border rounded-lg px-2 py-2 text-sm">
                                        <option>All Chapters</option>
                                    </select>
                                    <select className="border rounded-lg px-2 py-2 text-sm">
                                        <option>Chapter Order</option>
                                    </select>
                                </div>
                                <div>
                                    {filteredChapters.map((chap, idx) => (
                                        <div key={idx} className={`flex items-center justify-between p-4 rounded-lg mb-2 ${currentChapter === idx ? 'bg-blue-50' : 'bg-gray-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => handleChapterSelect(idx)} className="text-blue-600 text-lg mr-2">
                                                    <FaPlay />
                                                </button>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{chap.title}</div>
                                                    <div className="text-xs text-gray-500">Chapter {idx + 1} {chap.duration ? `• ${chap.duration}` : ''}</div>
                                                </div>
                                            </div>
                                            <div>
                                                {completed.includes(idx) && <span className="text-green-600 text-xs flex items-center"><FaCheckCircle className="mr-1" /> Completed</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {tab === 'details' && (
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">About this Audiobook</h3>
                                <p className="text-gray-700 mb-2">{audiobook.description}</p>
                                <div className="text-sm text-gray-500">Author: {audiobook.author}</div>
                                <div className="text-sm text-gray-500">Narrator: {audiobook.narrator}</div>
                                <div className="text-sm text-gray-500">Category: {audiobook.category}</div>
                            </div>
                        )}
                        {tab === 'settings' && (
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">Player Settings</h3>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={autoPlay} onChange={() => setAutoPlay(v => !v)} /> Auto-play next chapter
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={skipSilence} onChange={() => setSkipSilence(v => !v)} /> Skip silence (UI only)
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}