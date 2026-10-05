import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setThemeMode, setPrimaryColor } from '../store/ui/uiSlice';

export function useTheme() {
  const dispatch = useDispatch<AppDispatch>();
  const { themeMode, primaryColor } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  useEffect(() => {
    if (primaryColor) {
      document.documentElement.style.setProperty('--color-primary', primaryColor);
    }
  }, [primaryColor]);

  const toggleTheme = () => {
    dispatch(setThemeMode(themeMode === 'dark' ? 'light' : 'dark'));
  };

  const changePrimaryColor = (colorHex: string) => {
    dispatch(setPrimaryColor(colorHex));
  };

  return {
    themeMode,
    isDark: themeMode === 'dark',
    primaryColor,
    toggleTheme,
    changePrimaryColor,
  };
}
