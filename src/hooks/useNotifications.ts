import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Notification } from '@/types';

const initialNotifications: Notification[] = [
  {
    id: 'notif-sec-1',
    title: 'Breaking security alert',
    message: 'Steam account takeovers up 340% this week.',
    category: 'breaking',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-feed-1',
    title: 'Your weekly digest is ready',
    message: 'Top stories from Innovate, Secured, and Play.',
    category: 'feed',
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'notif-sys-1',
    title: 'System update complete',
    message: 'Threat feed sync and SEO checks passed.',
    category: 'system',
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', initialNotifications);

  const markRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, markRead, markAllRead, unreadCount };
}
