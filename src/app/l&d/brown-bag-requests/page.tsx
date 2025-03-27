"use client"

import { CheckCircle, Calendar, User, Info } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useState, useEffect } from 'react';

interface Session {
    requestId: number;
    employeeID: number;
    employeeName: string;
    topicType: string;
    topicName: string;
    agenda: string;
    speakerDescription: string;
    requestDate: string;
}

async function getSessions(): Promise<Session[]> {
    const res = await axiosInstance.get('https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/BrownBagRequest/Requests');
    return res.data?.data || [];
}

export default function BrownBagSessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getSessions()
            .then(setSessions)
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Brown Bag Sessions</h1>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sessions.map((session) => (
                        <div
                            key={session.requestId}
                            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">{session.topicName}</h2>
                                <CheckCircle className="text-green-500" size={20} />
                            </div>
                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                                <User className="mr-1" size={16} /> {session.employeeName}
                            </p>
                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                                <Info className="mr-1" size={16} /> {session.topicType}
                            </p>
                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                                <Calendar className="mr-1" size={16} />
                                {new Date(session.requestDate).toLocaleString()}
                            </p>
                            <p className="text-gray-800 mb-4">{session.agenda}</p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
