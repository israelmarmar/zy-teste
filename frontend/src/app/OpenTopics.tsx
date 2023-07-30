import React, { useEffect, useState } from 'react';
import TabComponent from './components/TabComponent';
import axios from 'axios';
import { useRouter } from 'next/router';

interface TabData {
    id: number;
    creator: any;
    title: string;
}

const OpenTopics = () => {
    const router = useRouter();
    const [tabs, setTabs] = useState<TabData[]>([]);

    useEffect(() => {
        (async () => {
            try {
                if (tabs.length === 0) {
                    const token = localStorage.getItem('token');
                    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}topics`, { headers: { Authorization: `Bearer ${token}` } });
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
                <TabComponent key={tab.id} id={tab.id} topic={tab.title} username={tab.creator.username} subsBtn={true} isText={true} />
            ))}
        </div>
    );
};

export default OpenTopics;
