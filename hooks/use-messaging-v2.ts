export function useMessaging(userId: string | undefined) {
    return {
        threads: [],
        requests: [],
        threadsLoading: false,
        requestsLoading: false,
        threadsError: null,
        requestsError: null,
        unreadThreadsCount: 0,
        pendingRequestsCount: 0,
        totalUnreadCount: 0,
        isConnected: false,
        sendMessage: async () => { },
        sendRequest: async () => { },
        handleRequest: async () => { },
        markThreadAsRead: async () => { },
        archiveThread: async () => { },
        isSendingMessage: false,
        isHandlingRequest: false,
        isSendingRequest: false,
        prefetchThread: () => { },
    };
}
