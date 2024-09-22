"use client";
import React, { useState, useCallback, useRef, useEffect } from 'react';

interface SeatProps {
    x: number;
    y: number;
    fill: string;
    onClick: () => void;
}

const Seat: React.FC<SeatProps> = ({ x, y, fill, onClick }) => (
    <g onClick={onClick} className="cursor-pointer">
        <circle
            cx={x}
            cy={y}
            r={4}
            fill={fill}
            stroke="#000"
            strokeWidth={0.6}
            className="transition-colors duration-200"
        />
    </g>
);

const StadiumSeating: React.FC = () => {
    const totalSeats: number = 2500;
    const sections: number = 4;
    const rowsPerSection: number = 25;
    const seatsPerRow: number = Math.ceil(totalSeats / (sections * rowsPerSection));

    const [selectedSeats, setSelectedSeats] = useState<Set<number>>(new Set());
    const [soldOutSeats, setSoldOutSeats] = useState<Set<number>>(new Set());
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 800, height: 500 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
    const svgRef = useRef<SVGSVGElement>(null);

    const sectionColors: string[] = ['#ff0000', '#0000ff', '#00ff00', '#ffff00'];

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const aspectRatio = 800 / 500;
        let newWidth, newHeight;

        if (windowSize.width / windowSize.height > aspectRatio) {
            newHeight = windowSize.height;
            newWidth = newHeight * aspectRatio;
        } else {
            newWidth = windowSize.width;
            newHeight = newWidth / aspectRatio;
        }

        setViewBox({ x: 0, y: 0, width: 800, height: 500 });
    }, [windowSize]);

    const handleSeatClick = useCallback((seatNumber: number) => {
        if (soldOutSeats.has(seatNumber)) {
            return;
        }

        setSelectedSeats(prev => {
            const newSet = new Set(prev);
            if (newSet.has(seatNumber)) {
                newSet.delete(seatNumber);
            } else {
                newSet.add(seatNumber);
            }
            return newSet;
        });
    }, [soldOutSeats]);

    const renderSeats = (): JSX.Element[] => {
        const seats: JSX.Element[] = [];
        let seatNumber: number = 0;
        const centerX: number = 400;
        const centerY: number = 250;
        const stadiumWidth: number = 700;
        const stadiumHeight: number = 400;

        for (let section = 0; section < sections; section++) {
            for (let row = 0; row < rowsPerSection; row++) {
                const rowRadius = 0.9 - row / (rowsPerSection * 1.2);
                for (let seat = 0; seat < seatsPerRow; seat++) {
                    if (seatNumber >= totalSeats) break;

                    const angle = (section / sections + seat / (seatsPerRow * sections)) * 2 * Math.PI;
                    const x = centerX + (stadiumWidth / 2) * rowRadius * Math.cos(angle);
                    const y = centerY + (stadiumHeight / 2) * rowRadius * Math.sin(angle);

                    if (!isInsidePitch(x, y)) {
                        const currentSeatNumber = seatNumber;
                        seats.push(
                            <Seat
                                key={currentSeatNumber}
                                x={x}
                                y={y}
                                fill={getSeatColor(currentSeatNumber, sectionColors[section])}
                                onClick={() => handleSeatClick(currentSeatNumber)}
                            />
                        );
                        seatNumber++;
                    }
                }
            }
        }
        return seats;
    };

    const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const newZoom = parseFloat(event.target.value);
        setZoomLevel(newZoom);
        setViewBox(prev => ({
            x: 400 - (400 / newZoom),
            y: 250 - (250 / newZoom),
            width: 800 / newZoom,
            height: 500 / newZoom
        }));
    };

    const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
        if (event.button !== 0) return; // Only left mouse button
        setIsDragging(true);
        setDragStart({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        if (!isDragging) return;
        const dx = event.clientX - dragStart.x;
        const dy = event.clientY - dragStart.y;
        setViewBox(prev => ({
            ...prev,
            x: prev.x - dx / zoomLevel,
            y: prev.y - dy / zoomLevel
        }));
        setDragStart({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const isInsidePitch = (x: number, y: number): boolean => {
        const pitchLeft = 250;
        const pitchRight = 550;
        const pitchTop = 150;
        const pitchBottom = 350;
        return x > pitchLeft && x < pitchRight && y > pitchTop && y < pitchBottom;
    };

    const getSeatColor = (seatNumber: number, sectionColor: string): string => {
        if (soldOutSeats.has(seatNumber)) return 'black';
        if (selectedSeats.has(seatNumber)) return 'white';
        return sectionColor;
    };

    const renderPitch = (): JSX.Element => (
        <g>
            <rect x="250" y="150" width="300" height="200" fill="#4CAF50" />
            <rect x="250" y="150" width="300" height="200" fill="none" stroke="white" strokeWidth="2" />
            <line x1="400" y1="150" x2="400" y2="350" stroke="white" strokeWidth="2" />
            <circle cx="400" cy="250" r="30" fill="none" stroke="white" strokeWidth="2" />
            <rect x="250" y="200" width="60" height="100" fill="none" stroke="white" strokeWidth="2" />
            <rect x="490" y="200" width="60" height="100" fill="none" stroke="white" strokeWidth="2" />
            <rect x="250" y="225" width="20" height="50" fill="none" stroke="white" strokeWidth="2" />
            <rect x="530" y="225" width="20" height="50" fill="none" stroke="white" strokeWidth="2" />
            <rect x="245" y="235" width="5" height="30" fill="white" />
            <rect x="550" y="235" width="5" height="30" fill="white" />
        </g>
    );

    return (
        <div className="fixed inset-0 flex flex-col bg-gray-100">
            <div className="flex-grow relative">
                <svg
                    ref={svgRef}
                    width="100%"
                    height="100%"
                    viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="absolute inset-0 cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <ellipse cx="400" cy="250" rx="320" ry="170" fill="#FF9800" stroke="#E65100" strokeWidth="5" />
                    {renderPitch()}
                    {renderSeats()}
                </svg>

                <div className="absolute top-2 right-2 bg-white p-2 rounded shadow">
                    <h3 className="font-bold mb-2">Sections</h3>
                    {sectionColors.map((color, index) => (
                        <div key={index} className="flex items-center mb-1">
                            <div className={`w-4 h-4 mr-2`} style={{ backgroundColor: color }}></div>
                            <span>Section {index + 1}</span>
                        </div>
                    ))}
                    <div className="flex items-center mb-1">
                        <div className="w-4 h-4 mr-2 bg-black"></div>
                        <span>Sold Out</span>
                    </div>
                    <div className="flex items-center mb-1">
                        <div className="w-4 h-4 mr-2 bg-white border border-black"></div>
                        <span>Selected</span>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-white shadow-lg">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{totalSeats} Capacity Stadium</h1>
                    <div className="flex items-center">
                        <span className="mr-2">Zoom:</span>
                        <input
                            type="range"
                            min="1"
                            max="4"
                            step="0.1"
                            value={zoomLevel}
                            onChange={handleZoomChange}
                            className="w-32"
                        />
                        <span className="ml-2">{zoomLevel.toFixed(1)}x</span>
                    </div>
                </div>
                <p className="mt-2">
                    {selectedSeats.size > 0
                        ? `Selected Seats: ${Array.from(selectedSeats).map(s => s + 1).join(', ')}`
                        : 'Click on seats to select them'}
                </p>
            </div>
        </div>
    );
};

export default StadiumSeating;
