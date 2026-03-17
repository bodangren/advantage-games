export function useSession() {
  return {
    data: {
      user: {
        id: 'mock-user-id',
        name: 'Player',
        email: 'player@example.com',
        xp: 0,
        role: 'student',
        level: 1,
      },
    },
    status: 'authenticated' as const,
    update: async () => undefined,
  }
}
