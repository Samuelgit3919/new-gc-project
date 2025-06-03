import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Play, Pause, SkipBack, SkipForward, Volume2, ShoppingCart, Lock } from 'lucide-react';
import { toast } from 'sonner';

const AudioBookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [streamUrl, setStreamUrl] = useState(null);
    const [hasPurchased, setHasPurchased] = useState(false);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication required');
                }

                // First get book details
                const bookResponse = await fetch(
                    `https://bookcompass.onrender.com/api/books/singleBook/${id}`,
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

                // Check if user has purchased the book
                const purchaseResponse = await fetch(
                    `https://bookcompass.onrender.com/api/order/check/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (purchaseResponse.ok) {
                    const purchaseData = await purchaseResponse.json();
                    setHasPurchased(purchaseData.hasPurchased);

                    // If purchased, get stream URL
                    if (purchaseData.hasPurchased) {
                        const streamResponse = await fetch(
                            `https://bookcompass.onrender.com/api/order/stream/${id}`,
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
                    }
                }
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

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

    const handlePurchase = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to purchase');
                return;
            }

            // Navigate to payment/checkout page
            navigate(`/checkout/${id}`);
        } catch (error) {
            toast.error('Failed to initiate purchase');
        }
    };

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
                        <Button onClick={() => navigate('/books')}>Return to Books</Button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!book) return null;

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
                        <p className="text-gray-700 mb-4">{book.description}</p>
                        <p className="text-xl font-semibold mb-4">birr {book.price?.toFixed(2)}</p>
                        {!hasPurchased && (
                            <Button onClick={handlePurchase} className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                Purchase Audiobook
                            </Button>
                        )}
                    </div>
                </div>

                {/* Audio Player */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {hasPurchased && streamUrl ? (
                        <>
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
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Lock className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Purchase Required</h3>
                            <p className="text-gray-600 text-center mb-4">
                                Please purchase this audiobook to start listening
                            </p>
                            <Button onClick={handlePurchase} className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                Purchase Now
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AudioBookDetail; 