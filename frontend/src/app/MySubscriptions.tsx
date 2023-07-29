import React, { useEffect, useState } from 'react';
import TabComponent from './components/TabComponent';
import './MyTopics.css';
import axios from 'axios';
import { useRouter } from 'next/router';

interface TabData {
    id: number;
    creator: any;
    topic: any;
    title: string;
}

const MySubscriptions = () => {
    const router = useRouter();
    const [tabs, setTabs] = useState<TabData[]>([]);

    useEffect(() => {
        (async () => {
            try {
                if (tabs.length === 0) {
                    const token = localStorage.getItem('token');
                    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}subscriptions/me`, { headers: { Authorization: `Bearer ${token}` } });
                    setTabs(data);
                }
            } catch (e) {
                console.log(e);
                router.push('login');
            }
        })();
    })

    return (
        <div>
            {tabs.map((tab) => (
                <TabComponent key={tab.topic.id} id={tab.topic.id} topic={tab.topic.title} />
            ))}
        </div>
    );
};

export default MySubscriptions;
