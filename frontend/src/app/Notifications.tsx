import React, { useEffect, useState } from 'react';
import TabComponent from './components/TabComponent';
import './Notification.css';
import { useRouter } from 'next/router';

interface TabData {
    id: number;
    creator: any;
    title: string;
}

const Notifications = () => {
    const router = useRouter();
    const [tabs, setTabs] = useState<TabData[]>([]);

    useEffect(() => {
        
    })

    return (
        <div>
            {tabs.length > 0 ? tabs.map((tab) => (
                <TabComponent key={tab.id} id={tab.id} topic={tab.title} username={tab.creator.username}  />
            )) : <h2>Nenhuma notificação disponível</h2>}
        </div>
    );
};

export default Notifications;
