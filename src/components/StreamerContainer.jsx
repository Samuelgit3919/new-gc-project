import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const StreamerContainer = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [streamUrl, setStreamUrl] = useState(null);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [zoom, setZoom] = useState(1.0);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication required');
                }

                // First get book details
                const bookResponse = await fetch(
                    `https://bookcompass.onrender.com/api/books/singleBook/${bookId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                const bookData = await bookResponse.json();
                
                if (!bookResponse.ok) {
                    throw new Error(bookData.message || 'Failed to fetch book details');
                }

                setBook(bookData.data);

                // Then get stream URL
                const streamResponse = await fetch(
                    `https://bookcompass.onrender.com/api/order/stream/${bookId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (!streamResponse.ok) {
                    throw new Error('Failed to get stream URL');
                }

                const blob = await streamResponse.blob();
                const url = URL.createObjectURL(blob);
                setStreamUrl(url);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookId]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => Math.max(1, Math.min(prevPageNumber + offset, numPages)));
    }

    if (loading) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto p-6">
                    <div className="flex gap-8">
                        <Skeleton className="w-48 h-64" />
                        <div className="flex-1 space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto p-6 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={() => navigate('/library')}>Return to Library</Button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!book || !streamUrl) return null;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Book Header */}
                <div className="flex gap-8 mb-8">
                    <img 
                        src={book.imageUrl} 
                        alt={book.title}
                        className="w-48 h-64 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                        <p className="text-gray-600 mb-4">by {book.author}</p>
                        <p className="text-gray-700">{book.description}</p>
                    </div>
                </div>

                {/* Content */}
                {book.isAudiobook ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Audio Controls */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => audioRef.current.currentTime -= 10}
                                >
                                    <SkipBack className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    onClick={handlePlayPause}
                                >
                                    {isPlaying ? (
                                        <Pause className="h-4 w-4" />
                                    ) : (
                                        <Play className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => audioRef.current.currentTime += 10}
                                >
                                    <SkipForward className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Volume2 className="h-4 w-4" />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    defaultValue="1"
                                    onChange={(e) => {
                                        if (audioRef.current) {
                                            audioRef.current.volume = e.target.value;
                                        }
                                    }}
                                    className="w-24"
                                />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-1 bg-gray-200 rounded-full mb-2">
                            <div 
                                className="absolute h-full bg-blue-600 rounded-full"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={(e) => {
                                    if (audioRef.current) {
                                        audioRef.current.currentTime = e.target.value;
                                    }
                                }}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>

                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>

                        <audio
                            ref={audioRef}
                            src={streamUrl}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onEnded={() => setIsPlaying(false)}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => changePage(-1)}
                                    disabled={pageNumber <= 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => changePage(1)}
                                    disabled={pageNumber >= numPages}
                                >
                                    Next
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                                    disabled={zoom <= 0.5}
                                >
                                    -
                                </Button>
                                <span className="text-sm">
                                    {(zoom * 100).toFixed(0)}%
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                                    disabled={zoom >= 2}
                                >
                                    +
                                </Button>
                            </div>
                            <p className="text-sm text-gray-600">
                                Page {pageNumber} of {numPages || '?'}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Document
                                file={streamUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={<Skeleton className="w-full h-[800px]" />}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    width={Math.min(window.innerWidth * 0.8 * zoom, 800 * zoom)}
                                    renderAnnotationLayer={true}
                                    renderTextLayer={true}
                                />
                            </Document>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default StreamerContainer; 