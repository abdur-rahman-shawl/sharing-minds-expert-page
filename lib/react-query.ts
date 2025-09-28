import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }

        return failureCount < 3
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
})

export const queryKeys = {
  session: ['session'] as const,
  sessionWithRoles: ['session', 'with-roles'] as const,
  userProfile: (userId: string) => ['user', 'profile', userId] as const,
  userRoles: (userId: string) => ['user', 'roles', userId] as const,
  mentors: ['mentors'] as const,
  mentorsList: (filters?: unknown) => ['mentors', 'list', filters] as const,
  mentorDetail: (id: string) => ['mentors', 'detail', id] as const,
  mentorProfile: (userId: string) => ['mentors', 'profile', userId] as const,
  mentees: ['mentees'] as const,
  menteesList: (filters?: unknown) => ['mentees', 'list', filters] as const,
  menteeProfile: (userId: string) => ['mentees', 'profile', userId] as const,
  messages: ['messages'] as const,
  messagesList: (userId: string) => ['messages', 'list', userId] as const,
  conversation: (participantIds: string[]) => ['messages', 'conversation', ...participantIds.sort()] as const,
  messaging: {
    all: ['messaging'] as const,
    threads: (userId: string) => ['messaging', 'threads', userId] as const,
    thread: (threadId: string, userId: string) => ['messaging', 'thread', threadId, userId] as const,
    requests: (userId: string, type?: string, status?: string) =>
      ['messaging', 'requests', userId, { type, status }] as const,
    unreadCount: (userId: string) => ['messaging', 'unread', userId] as const,
  },
  sessions: ['sessions'] as const,
  sessionsList: (userId: string) => ['sessions', 'list', userId] as const,
  sessionDetail: (id: string) => ['sessions', 'detail', id] as const,
  savedMentors: (userId: string) => ['saved', 'mentors', userId] as const,
  admin: ['admin'] as const,
  adminMentors: (filters?: unknown) => ['admin', 'mentors', filters] as const,
  adminMentees: (filters?: unknown) => ['admin', 'mentees', filters] as const,
  adminOverview: ['admin', 'overview'] as const,
} as const

export const invalidateQueries = {
  userProfile: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.userRoles(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.sessionWithRoles })
  },
  mentorProfile: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.mentorProfile(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.mentors })
    queryClient.invalidateQueries({ queryKey: queryKeys.sessionWithRoles })
  },
  session: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.session })
    queryClient.invalidateQueries({ queryKey: queryKeys.sessionWithRoles })
  },
  messages: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.messagesList(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.messages })
  },
  messaging: {
    all: () => queryClient.invalidateQueries({ queryKey: queryKeys.messaging.all }),
    threads: (userId: string) => queryClient.invalidateQueries({ queryKey: queryKeys.messaging.threads(userId) }),
    thread: (threadId: string, userId: string) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.messaging.thread(threadId, userId) }),
    requests: (userId: string) =>
      queryClient.invalidateQueries({ queryKey: ['messaging', 'requests', userId] }),
  },
  sessions: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.sessionsList(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.sessions })
  },
}
