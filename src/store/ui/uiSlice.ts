import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storage/storage.service';

interface UiState {
  sidebarOpen: boolean;
  themeMode: 'light' | 'dark';
  primaryColor: string;
  searchOpen: boolean;
  activeTab: string;
}

const settings = storageService.getSettings();

const initialState: UiState = {
  sidebarOpen: true,
  themeMode: (settings.themeMode as 'light' | 'dark') || 'light',
  primaryColor: settings.primaryColor || '#2563eb',
  searchOpen: false,
  activeTab: 'all',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setThemeMode(state, action: PayloadAction<'light' | 'dark'>) {
      state.themeMode = action.payload;
      const current = storageService.getSettings();
      storageService.saveSettings({ ...current, themeMode: action.payload });
    },
    setPrimaryColor(state, action: PayloadAction<string>) {
      state.primaryColor = action.payload;
      const current = storageService.getSettings();
      storageService.saveSettings({ ...current, primaryColor: action.payload });
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.searchOpen = action.payload;
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setThemeMode, setPrimaryColor, setSearchOpen, setActiveTab } = uiSlice.actions;
export default uiSlice.reducer;
