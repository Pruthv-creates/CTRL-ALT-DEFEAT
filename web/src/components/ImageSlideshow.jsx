import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlideshow = ({ plantName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [autoPlay, setAutoPlay] = useState(true);

    useEffect(() => {
        // Map plant names to their image files
        const imageMap = {
            'aloe vera': ['aloe1.jpg', 'aloe2.jpg'],
            'amla': ['amla1.jpg', 'amla2.jpg'],
            'ashwagandha': ['ashwagandha1.jpg', 'ashwagandha2.jpg'],
            'neem': ['neem1.jpg', 'neem2.jpg'],
            'turmeric': ['turmeric1.jpg', 'turmeric2.jpg'],
            'tulsi': ['tulsi1.jpg', 'tulsi2.jpg'],
            'ginger': ['ginger1.jpg', 'ginger2.jpg'],
            'rose': ['rose1.jpg', 'rose2.jpg'],
            'lemon': ['lemon1.jpg', 'lemon2.jpg'],
            'licorice': ['licorice1.jpg', 'licorice2.jpg'],
            'calendula': ['calendula1.jpg', 'calendula2.jpg'],
            'brahmi': ['brahmi1.jpg', 'brahmi2.jpg'],
            'guduchi': ['guduchi1.jpg', 'guduchi2.jpg'],
            'giloy': ['guduchi1.jpg', 'guduchi2.jpg'],
            'shatavari': ['shatavari1.jpg', 'shatavari2.jpg'],
            'bhringraj': ['bhringraj1.jpeg', 'bhringraj2.jpeg'],
            'haritaki': ['haritaki1.jpg', 'haritaki2.jpg'],
            'arnica': ['arnica1.jpg', 'arnica2.jpg'],
            'fennel': ['fennel1.jpg', 'fennel2.jpg'],
            'cucumber': ['cucumber1.jpg', 'cucumber2.jpg'],
            'adhatoda': ['adhatoda1.jpg', 'adhatoda2.jpg'],
            'bala': ['bala1.jpg', 'bala2.jpg'],
            'guggul': ['guggul1.jpg', 'guggul2.jpg'],
            'jatamansi': ['jatamansi1.jpg', 'jatamansi2.jpg'],
            'kutki': ['kutki1.jpg', 'kutki2.jpg'],
            'manjistha': ['manjistha1.jpg', 'manjistha2.jpg'],
            'nilavembu': ['nilavembu1.jpg', 'nilavembu2.jpg'],
            'nux vomica': ['nuxvomica1.jpg', 'nuxvomica2.jpg'],
            'pippali': ['pippali1.jpg', 'pippali2.jpg'],
            'punarnava': ['punarnava1.jpg', 'punarnava2.jpg'],
            'senna': ['senna1.jpg', 'senna2.jpg'],
            'shankhpushpi': ['shankhpushpi1.jpg', 'shankhpushpi2.jpg'],
            'thuthuvalai': ['thuthuvalai1.jpg', 'thuthuvalai2.jpg'],
            'vacha': ['vacha1.jpg', 'vacha2.jpg'],
            'vidanga': ['vidanga1.jpg']
        };

        const plantNameLower = plantName?.toLowerCase() || '';
        const plantImages = imageMap[plantNameLower] || [];

        // Convert to full paths - assets folder is served from public in Vite
        const imagePaths = plantImages.map(img => `/assets/images/${img}`);
        setImages(imagePaths);
    }, [plantName]);

    // Auto-advance slideshow
    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, [autoPlay, images.length]);

    const goToPrevious = () => {
        setAutoPlay(false);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setAutoPlay(false);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToSlide = (index) => {
        setAutoPlay(false);
        setCurrentIndex(index);
    };

    if (images.length === 0) {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666'
            }}>
                No images available
            </div>
        );
    }

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Main Image */}
            <img
                src={images[currentIndex]}
                alt={`${plantName} - Image ${currentIndex + 1}`}
                style={{
                    width: '100%',
                    height: '500px',
                    objectFit: 'cover',
                    padding: '20px',
                    transition: 'opacity 0.5s ease-in-out',
                    borderRadius: '12px'
                }}
                onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                }}
            />

            {/* Navigation Arrows - Only show if multiple images */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                        }}
                    >
                        <ChevronLeft size={24} color="#333" />
                    </button>

                    <button
                        onClick={goToNext}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                        }}
                    >
                        <ChevronRight size={24} color="#333" />
                    </button>

                    {/* Dot Indicators */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '8px',
                        zIndex: 10
                    }}>
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                style={{
                                    width: currentIndex === index ? '24px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    backgroundColor: currentIndex === index ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.6)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    zIndex: 10
                }}>
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
    );
};

export default ImageSlideshow;
