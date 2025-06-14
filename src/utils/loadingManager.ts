import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  resourcesLoaded: number;
  totalResources: number;
  setIsLoading: (loading: boolean) => void;
  incrementResourcesLoaded: () => void;
  resetLoading: () => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: true,
  resourcesLoaded: 0,
  totalResources: 0,
  setIsLoading: (loading) => set({ isLoading: loading }),
  incrementResourcesLoaded: () => set((state) => ({ resourcesLoaded: state.resourcesLoaded + 1 })),
  resetLoading: () => set({ isLoading: true, resourcesLoaded: 0, totalResources: 0 })
}));

export default useLoadingStore;