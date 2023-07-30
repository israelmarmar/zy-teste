import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import TabComponent from './components/TabComponent';
import './Notification.css';
import { useRouter } from 'next/router';
import axios from 'axios';

interface TabData {
    id: number;
    creator: any;
    title: string;
    uuid?: string;
}

interface NotificationsProps {
    topicId?: number;
}

const Notifications: React.FC<NotificationsProps> = ({ topicId }) => {
    const router = useRouter();
    const [newNotification, setNewNotification] = useState<string>();
    const [socketId, setSocketId] = useState<string>();
    const [tabs, setTabs] = useState<TabData[]>([]);

    const handleButtonClick = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}notifications`, { content: newNotification, topicId }, { headers: { Authorization: `Bearer ${token}` } });
            //setTabs([...tabs, { id: tabs.length, creator: { username: 'me' }, title: newNotification || '' }]);
            setNewNotification('')
        } catch (e: any) {
            console.log(e);
            alert(e.response.data.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!socketId) {
            const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || '');
            socket.on("connect", () => {

                console.log(socket.id);

                        socket.emit('authenticate', { token });

                        socket.on('authenticated', (data) => {
                            console.log(data.message);
                        });

                        socket.on(`notify-topicId-${topicId}`, (data) => {
                            const { username, content, uuid } = JSON.parse(data);
                            console.log(tabs)
                            setTabs(tabs => {
                                const check = tabs.filter(t => t.uuid === uuid);

                                if (check.length === 0)
                                    return [{ id: tabs.length, creator: { username }, title: content || '', uuid }, ...tabs];
                                return tabs;
                            })
                        });

                setSocketId(socket.id);

            });


        }
    })

    console.log(topicId)
    return (
        <div>
            <div className='row'>
                {topicId && <><input type="text" value={newNotification}
                    onChange={(e) => setNewNotification(e.target.value)} placeholder='digite uma nova notificação' />
                    <button className="notification-button" onClick={handleButtonClick}>
                        criar notificação
                    </button></>}
            </div>
            {tabs.length > 0 ? tabs.map((tab) => (
                <TabComponent key={tab.id} id={tab.id} topic={tab.title} username={tab.creator.username} isText={true} />
            )) : <h2>Nenhuma notificação disponível</h2>}
        </div>
    );
};

export default Notifications;
