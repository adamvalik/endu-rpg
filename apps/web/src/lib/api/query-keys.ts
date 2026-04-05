export const queryKeys = {
  userProfile: ['userProfile'] as const,
  gameProfile: ['gameProfile'] as const,
  activities: (page: number) => ['activities', page] as const,
};
