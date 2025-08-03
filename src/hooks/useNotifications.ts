'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase, getUserNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, subscribeToTable } from '@/lib/supabase'
import type { Notification } from '@/lib/supabase'
import { toast } from 'sonner'

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
}

interface NotificationsHook extends NotificationsState {
  refreshNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  clearAll: () => Promise<void>
}

export function useNotifications(): NotificationsHook {
  const { user } = useAuth()
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    unreadCount: 0,
    loading: true,
    error: null
  })

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user?.id) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const [notifications, unreadCount] = await Promise.all([
        getUserNotifications(user.id),
        getUnreadNotificationCount(user.id)
      ])

      setState(prev => ({
        ...prev,
        notifications,
        unreadCount,
        loading: false
      }))
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        loading: false
      }))
    }
  }

  // Initialize and setup real-time subscription
  useEffect(() => {
    if (!user?.id) {
      setState({
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null
      })
      return
    }

    fetchNotifications()

    // Subscribe to real-time changes
    const channel = subscribeToTable(
      'notifications',
      (payload) => {
        console.log('Notification change:', payload)

        if (payload.eventType === 'INSERT' && payload.new.user_id === user.id) {
          const newNotification = payload.new as Notification
          
          setState(prev => ({
            ...prev,
            notifications: [newNotification, ...prev.notifications],
            unreadCount: prev.unreadCount + 1
          }))

          // Show toast for new notification
          toast.info(newNotification.title, {
            description: newNotification.message,
            action: {
              label: 'View',
              onClick: () => {
                if (newNotification.action_url) {
                  window.location.href = newNotification.action_url
                }
              }
            }
          })
        } else if (payload.eventType === 'UPDATE' && payload.new.user_id === user.id) {
          const updatedNotification = payload.new as Notification

          setState(prev => ({
            ...prev,
            notifications: prev.notifications.map(n =>
              n.id === updatedNotification.id ? updatedNotification : n
            ),
            unreadCount: updatedNotification.is_read && !payload.old.is_read
              ? Math.max(0, prev.unreadCount - 1)
              : prev.unreadCount
          }))
        } else if (payload.eventType === 'DELETE' && payload.old.user_id === user.id) {
          const deletedNotification = payload.old as Notification

          setState(prev => ({
            ...prev,
            notifications: prev.notifications.filter(n => n.id !== deletedNotification.id),
            unreadCount: !deletedNotification.is_read
              ? Math.max(0, prev.unreadCount - 1)
              : prev.unreadCount
          }))
        }
      },
      `user_id=eq.${user.id}`
    )

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const refreshNotifications = async () => {
    await fetchNotifications()
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)

      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === notificationId 
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }))
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    if (!user?.id) return

    try {
      await markAllNotificationsAsRead(user.id)

      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({
          ...n,
          is_read: true,
          read_at: new Date().toISOString()
        })),
        unreadCount: 0
      }))

      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      setState(prev => {
        const notification = prev.notifications.find(n => n.id === notificationId)
        return {
          ...prev,
          notifications: prev.notifications.filter(n => n.id !== notificationId),
          unreadCount: notification && !notification.is_read 
            ? Math.max(0, prev.unreadCount - 1)
            : prev.unreadCount
        }
      })

      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const clearAll = async () => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setState(prev => ({
        ...prev,
        notifications: [],
        unreadCount: 0
      }))

      toast.success('All notifications cleared')
    } catch (error) {
      console.error('Error clearing all notifications:', error)
      toast.error('Failed to clear notifications')
    }
  }

  return {
    ...state,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  }
}
