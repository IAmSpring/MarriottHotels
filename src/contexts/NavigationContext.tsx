import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { navigationLogger } from '../utils/navigationLogger';

export interface NavigationAction {
  type: 'click' | 'scroll' | 'input' | 'screenshot' | 'submit' | 'waitForAudio';
  selector: string;
  value?: string;
  delay?: number;
  scrollOptions?: {
    behavior: ScrollBehavior;
    top?: number;
    left?: number;
  };
}

interface NavigationState {
  actions: NavigationAction[];
  isExecuting: boolean;
  isPaused: boolean;
  currentActionIndex: number;
  error: string | null;
  screenshot: string | null;
  volume: number;
}

interface NavigationContextType {
  state: NavigationState;
  queueActions: (actions: NavigationAction[]) => void;
  executeActions: () => Promise<void>;
  takeScreenshot: () => Promise<string>;
  clearActions: () => void;
  stopExecution: () => void;
  pauseExecution: () => void;
  resumeExecution: () => void;
  adjustVolume: (volume: number) => void;
}

const initialState: NavigationState = {
  actions: [],
  isExecuting: false,
  isPaused: false,
  currentActionIndex: -1,
  error: null,
  screenshot: null,
  volume: 1
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NavigationState>(initialState);
  const executionRef = useRef<boolean>(false);
  const pauseRef = useRef<boolean>(false);

  const takeScreenshot = async (): Promise<string> => {
    try {
      navigationLogger.info('Taking page screenshot');
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(document.body);
      const screenshot = canvas.toDataURL('image/png');
      setState(prev => ({ ...prev, screenshot }));
      navigationLogger.success('Screenshot captured successfully');
      return screenshot;
    } catch (error) {
      navigationLogger.error('Screenshot failed', error);
      throw error;
    }
  };

  const adjustVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
    // Adjust volume of any active audio elements
    const audioElements = document.getElementsByTagName('audio');
    Array.from(audioElements).forEach(audio => {
      audio.volume = volume;
    });
  }, []);

  const pauseExecution = useCallback(() => {
    if (state.isExecuting) {
      navigationLogger.info('Execution paused');
      pauseRef.current = true;
      setState(prev => ({ ...prev, isPaused: true }));
    }
  }, [state.isExecuting]);

  const resumeExecution = useCallback(() => {
    if (state.isPaused) {
      navigationLogger.info('Execution resumed');
      pauseRef.current = false;
      setState(prev => ({ ...prev, isPaused: false }));
      executeActions();
    }
  }, [state.isPaused]);

  const executeAction = async (action: NavigationAction): Promise<void> => {
    navigationLogger.info('Executing action', action);
    
    // Wait if execution is paused
    while (pauseRef.current && executionRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!executionRef.current) return;

    const element = document.querySelector(action.selector);
    if (!element) {
      const error = new Error(`Element not found: ${action.selector}`);
      navigationLogger.error('Action failed', { error, action });
      throw error;
    }

    if (action.delay) {
      navigationLogger.debug(`Waiting ${action.delay}ms before execution`);
      await new Promise(resolve => setTimeout(resolve, action.delay));
    }

    try {
      switch (action.type) {
        case 'click':
          (element as HTMLElement).click();
          navigationLogger.success('Click executed', { selector: action.selector });
          break;
        case 'scroll':
          if (action.scrollOptions) {
            window.scrollTo({
              top: action.scrollOptions.top,
              left: action.scrollOptions.left,
              behavior: action.scrollOptions.behavior || 'smooth'
            });
            navigationLogger.success('Window scroll executed', action.scrollOptions);
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
            navigationLogger.success('Element scroll executed', { selector: action.selector });
          }
          break;
        case 'input':
          if (action.value) {
            const inputElement = element as HTMLInputElement;
            inputElement.value = action.value;
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            navigationLogger.success('Input value set', { 
              selector: action.selector, 
              value: action.value 
            });
          }
          break;
        case 'submit':
          const form = element as HTMLFormElement;
          form.submit();
          navigationLogger.success('Form submitted', { selector: action.selector });
          break;
        case 'screenshot':
          await takeScreenshot();
          break;
        case 'waitForAudio':
          const audioElement = document.querySelector(action.selector) as HTMLAudioElement;
          if (audioElement) {
            audioElement.volume = state.volume;
            await new Promise<void>((resolve) => {
              audioElement.addEventListener('ended', () => resolve(), { once: true });
            });
            navigationLogger.success('Audio playback completed');
          }
          break;
      }
    } catch (error) {
      navigationLogger.error('Action execution failed', { error, action });
      throw error;
    }
  };

  const executeActions = async () => {
    if (state.isExecuting || state.actions.length === 0) {
      navigationLogger.warn('Execution skipped', { 
        isExecuting: state.isExecuting, 
        actionCount: state.actions.length 
      });
      return;
    }

    navigationLogger.info('Starting action execution', { 
      actionCount: state.actions.length 
    });
    setState(prev => ({ ...prev, isExecuting: true, error: null }));
    executionRef.current = true;

    try {
      for (let i = 0; i < state.actions.length && executionRef.current; i++) {
        setState(prev => ({ ...prev, currentActionIndex: i }));
        navigationLogger.logAction(state.actions[i], 'started');
        await executeAction(state.actions[i]);
        navigationLogger.logAction(state.actions[i], 'completed');
      }
      navigationLogger.success('All actions completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      navigationLogger.error('Action execution failed', error);
    } finally {
      setState(prev => ({
        ...prev,
        isExecuting: false,
        currentActionIndex: -1
      }));
      executionRef.current = false;
    }
  };

  const queueActions = useCallback((actions: NavigationAction[]) => {
    navigationLogger.info('Queueing new actions', { actionCount: actions.length });
    setState(prev => ({
      ...prev,
      actions: [...prev.actions, ...actions]
    }));
    actions.forEach(action => navigationLogger.logAction(action, 'queued'));
  }, []);

  const clearActions = useCallback(() => {
    navigationLogger.info('Clearing all actions');
    setState(prev => ({
      ...prev,
      actions: [],
      currentActionIndex: -1,
      error: null
    }));
  }, []);

  const stopExecution = useCallback(() => {
    navigationLogger.warn('Execution stopped by user');
    executionRef.current = false;
    setState(prev => ({
      ...prev,
      isExecuting: false,
      currentActionIndex: -1
    }));
  }, []);

  const value = {
    state,
    queueActions,
    executeActions,
    takeScreenshot,
    clearActions,
    stopExecution,
    pauseExecution,
    resumeExecution,
    adjustVolume
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}; 