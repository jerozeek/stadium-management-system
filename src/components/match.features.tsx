"use client";
import React from 'react';
import { Clock, MapPin, Calendar, Ticket, Goal, IdCard, ArrowRightLeft } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { useRouter } from "next/navigation";

interface Team {
    name: string;
    code: string;
    score: number;
}

interface MatchEvent {
    type: 'goal' | 'yellowCard' | 'redCard' | 'substitution';
    team: 'home' | 'away';
    player?: string;
    playerOut?: string;
    playerIn?: string;
    minute: number;
}

interface Match {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    date: string;
    time: string;
    venue: string;
    isLive: boolean;
    currentMinute?: number;
    ticketsAvailable: boolean;
    events?: MatchEvent[];
}

interface MatchFeatureBoardProps {
    match: Match;
}

const MatchFeatureBoard: React.FC<MatchFeatureBoardProps> = ({ match }) => {
    const router = useRouter();

    const LiveIndicator: React.FC = () => (
        <div className="flex items-center bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            <span className="text-sm font-semibold">LIVE</span>
        </div>
    );

    const renderEventIcon = (type: MatchEvent['type']): React.ReactNode => {
        switch(type) {
            case 'goal': return <Goal size={16} />;
            case 'yellowCard': return <IdCard size={16} className="text-yellow-400" />;
            case 'redCard': return <IdCard size={16} className="text-red-600" />;
            case 'substitution': return <ArrowRightLeft size={16} />;
            default: return null;
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-lg w-full mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <ReactCountryFlag
                        countryCode={match.homeTeam.code}
                        svg
                        style={{
                            width: '3em',
                            height: '2em',
                        }}
                        title={match.homeTeam.name}
                    />
                    <span className="text-2xl font-bold ml-2">{match.homeTeam.name}</span>
                </div>
                <div className="flex flex-col items-center">
                    {match.isLive && <LiveIndicator />}
                    <div className="text-4xl font-bold mt-2">
                        {match.homeTeam.score} - {match.awayTeam.score}
                    </div>
                    {match.isLive && match.currentMinute && (
                        <div className="text-sm mt-1">
                            {match.currentMinute}'
                        </div>
                    )}
                </div>
                <div className="flex items-center">
                    <span className="text-2xl font-bold mr-2">{match.awayTeam.name}</span>
                    <ReactCountryFlag
                        countryCode={match.awayTeam.code}
                        svg
                        style={{
                            width: '3em',
                            height: '2em',
                        }}
                        title={match.awayTeam.name}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
                <div className="flex items-center justify-center">
                    <Calendar className="mr-2" size={20}/>
                    <span>{match.date}</span>
                </div>
                <div className="flex items-center justify-center">
                    <Clock className="mr-2" size={20}/>
                    <span>{match.time}</span>
                </div>
                <div className="flex items-center justify-center">
                    <MapPin className="mr-2" size={20}/>
                    <span>{match.venue}</span>
                </div>
            </div>

            {match.events && match.events.length > 0 && (
                <div className="mt-6 border-t border-blue-400 pt-4">
                    <h3 className="text-xl font-bold mb-2">Match Events</h3>
                    <div className="space-y-2">
                        {match.events.map((event, index) => (
                            <div key={index} className="flex items-center">
                                <span className="w-8 text-right mr-2">{event.minute}'</span>
                                {renderEventIcon(event.type)}
                                <span className="ml-2">
                                    {event.type === 'substitution'
                                        ? `${event.playerOut} ↔ ${event.playerIn}`
                                        : event.player
                                    }
                                </span>
                                <span className="ml-auto">
                                    {event.team === 'home' ? match.homeTeam.name : match.awayTeam.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {match.ticketsAvailable && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push(`/ticket/${match.id}`)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mx-auto"
                    >
                        <Ticket className="mr-2" size={20}/>
                        Buy Ticket
                    </button>
                </div>
            )}
        </div>
    );
};

const MultipleMatchFeatureBoards: React.FC = () => {
    const matches: Match[] = [
        {
            id: '123464',
            homeTeam: { name: 'Brazil', code: 'BR', score: 2 },
            awayTeam: { name: 'Argentina', code: 'AR', score: 1 },
            date: 'July 15, 2024',
            time: '20:00 GMT',
            venue: 'Maracanã Stadium',
            isLive: false,
            currentMinute: 67,
            ticketsAvailable: false,
            events: [
                { type: 'goal', team: 'home', player: 'Neymar', minute: 23 },
                { type: 'yellowCard', team: 'away', player: 'Messi', minute: 35 },
                { type: 'goal', team: 'away', player: 'Di Maria', minute: 42 },
                { type: 'goal', team: 'home', player: 'Jesus', minute: 65 }
            ]
        },
        {
            id: '123465',
            homeTeam: { name: 'Germany', code: 'DE', score: 3 },
            awayTeam: { name: 'France', code: 'FR', score: 3 },
            date: 'July 16, 2024',
            time: '18:00 GMT',
            venue: 'Allianz Arena',
            isLive: false,
            ticketsAvailable: true
        },
        {
            id: '123466',
            homeTeam: { name: 'Spain', code: 'ES', score: 0 },
            awayTeam: { name: 'Italy', code: 'IT', score: 0 },
            date: 'July 17, 2024',
            time: '19:30 GMT',
            venue: 'Santiago Bernabéu',
            isLive: false,
            ticketsAvailable: true
        },
        {
            id: '123467',
            homeTeam: { name: 'England', code: 'GB-ENG', score: 1 },
            awayTeam: { name: 'Portugal', code: 'PT', score: 2 },
            date: 'July 18, 2024',
            time: '20:00 GMT',
            venue: 'Wembley Stadium',
            isLive: true,
            currentMinute: 75,
            ticketsAvailable: false,
            events: [
                { type: 'goal', team: 'away', player: 'Ronaldo', minute: 20 },
                { type: 'goal', team: 'home', player: 'Kane', minute: 55 },
                { type: 'goal', team: 'away', player: 'Fernandes', minute: 70 }
            ]
        },
        {
            id: '123468',
            homeTeam: { name: 'Netherlands', code: 'NL', score: 2 },
            awayTeam: { name: 'Belgium', code: 'BE', score: 2 },
            date: 'July 19, 2024',
            time: '18:30 GMT',
            venue: 'Johan Cruyff Arena',
            isLive: false,
            ticketsAvailable: true
        }
    ];

    return (
        <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/placeholder_1.gif')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            ></div>
            <div className="absolute inset-0 z-10 bg-black opacity-50"></div>
            <div className="relative z-20 flex flex-col items-center space-y-8">
                {matches.map((match, index) => (
                    <MatchFeatureBoard key={index} match={match} />
                ))}
            </div>
        </div>
    );
};

export default MultipleMatchFeatureBoards;
