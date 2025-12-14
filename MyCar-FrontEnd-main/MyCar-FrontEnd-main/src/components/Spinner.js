import React from 'react'
import { LoadingOutlined, CarOutlined } from '@ant-design/icons';

function Spinner({ message = 'Loading...', fullScreen = true }) {
    const spinnerContent = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
        }}>
            {/* Car Animation Container */}
            <div style={{
                position: 'relative',
                width: '120px',
                height: '80px'
            }}>
                {/* Road */}
                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '4px',
                    background: 'linear-gradient(90deg, transparent 0%, #667eea 20%, #667eea 80%, transparent 100%)',
                    borderRadius: '2px'
                }}></div>
                
                {/* Car Icon */}
                <CarOutlined 
                    style={{
                        fontSize: '48px',
                        color: '#667eea',
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        animation: 'carBounce 0.5s ease-in-out infinite'
                    }}
                />
            </div>

            {/* Loading Text */}
            <div style={{
                fontSize: '18px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'pulse 1.5s ease-in-out infinite'
            }}>
                {message}
            </div>

            {/* Progress Dots */}
            <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#667eea',
                            animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`
                        }}
                    />
                ))}
            </div>

            {/* Inline Styles for Animations */}
            <style>{`
                @keyframes carBounce {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-5px); }
                }
                @keyframes dotPulse {
                    0%, 80%, 100% { 
                        transform: scale(0.6);
                        opacity: 0.5;
                    }
                    40% { 
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );

    if (fullScreen) {
        return (
            <div className='spinner' style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}>
                {spinnerContent}
            </div>
        );
    }

    return (
        <div style={{
            padding: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {spinnerContent}
        </div>
    );
}

export default Spinner

