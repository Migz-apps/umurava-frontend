import { toast } from "sonner";

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  type: "success" | "error" | "warning" | "info";
  read: boolean;
}

let notifications: NotificationItem[] = [];
let listeners: ((notifications: NotificationItem[]) => void)[] = [];

export const notificationStore = {
  subscribe: (listener: (notifications: NotificationItem[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getNotifications: () => notifications,
  getUnreadCount: () => notifications.filter(n => !n.read).length,
  addNotification: (notification: NotificationItem) => {
    notifications.unshift(notification);
    if (notifications.length > 50) {
      notifications = notifications.slice(0, 50);
    }
    listeners.forEach(listener => listener([...notifications]));
  },
  markAsRead: (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      listeners.forEach(listener => listener([...notifications]));
    }
  },
  markAllAsRead: () => {
    notifications.forEach(n => n.read = true);
    listeners.forEach(listener => listener([...notifications]));
  },
  clearNotifications: () => {
    notifications = [];
    listeners.forEach(listener => listener([]));
  }
};

export const notify = {
  success: (message: string, description?: string, addToCenter: boolean = false) => {
    const notification: NotificationItem = {
      id: Date.now().toString(),
      title: message,
      description,
      time: new Date().toLocaleTimeString(),
      type: "success",
      read: false
    };
    if (addToCenter) {
      notificationStore.addNotification(notification);
    }
    toast.success(message, { description, duration: 3000 });
  },

  info: (message: string, description?: string, addToCenter: boolean = false) => {
    const notification: NotificationItem = {
      id: Date.now().toString(),
      title: message,
      description,
      time: new Date().toLocaleTimeString(),
      type: "info",
      read: false
    };
    if (addToCenter) {
      notificationStore.addNotification(notification);
    }
    toast(message, { description, duration: 3000 });
  },

  warning: (message: string, description?: string, addToCenter: boolean = false) => {
    const notification: NotificationItem = {
      id: Date.now().toString(),
      title: message,
      description,
      time: new Date().toLocaleTimeString(),
      type: "warning",
      read: false
    };
    if (addToCenter) {
      notificationStore.addNotification(notification);
    }
    toast.warning(message, {
      description,
      duration: 5000,
    });
  },

  error: (message: string, description?: string, addToCenter: boolean = false) => {
    const notification: NotificationItem = {
      id: Date.now().toString(),
      title: message,
      description,
      time: new Date().toLocaleTimeString(),
      type: "error",
      read: false
    };
    if (addToCenter) {
      notificationStore.addNotification(notification);
    }
    toast.error(message, {
      description,
      duration: 4000,
      className:
        "!border !border-[hsl(0_80%_85%)] !bg-[hsl(0_85%_96%)] !text-[hsl(0_75%_42%)]",
      descriptionClassName: "!text-[hsl(0_60%_45%)]",
    });
  },
};
