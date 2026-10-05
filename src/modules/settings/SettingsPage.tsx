import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { THEME_CONFIG } from '../../config/theme.config';
import { useTheme } from '../../hooks/useTheme';
import { services } from '../../services/serviceFactory';
import { SystemSettings } from '../../types/common.types';
import { Settings, Save, Check } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export const SettingsPage: React.FC = () => {
  const toast = useToast();
  const { themeMode, toggleTheme, primaryColor, changePrimaryColor } = useTheme();

  const [settings, setSettings] = useState<SystemSettings>({
    agencyName: 'InsureFlow Agency Solutions',
    agencyEmail: 'admin@insureflow.demo',
    agencyPhone: '+91 1800 555 0199',
    agencyAddress: 'Financial District, Nanakramguda, Hyderabad 500032',
    primaryColor: '#2563eb',
    themeMode: 'light',
    currency: 'INR',
    dateFormat: 'DD MMM YYYY',
    pageSize: 10,
    enableAuditLogs: true,
    enableNotifications: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const current = await services.admin.getSettings();
      if (current) setSettings(current);
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await services.admin.updateSettings(settings);
      toast.success('System Settings Saved', 'Agency branding and settings updated.');
    } catch (err: any) {
      toast.error('Error', err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings & White-Labeling"
        description="Global agency branding, visual color themes, and operational preferences."
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Agency Branding Card */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Agency Branding & Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Agency Name (Displayed in Header & Invoices)"
              required
              value={settings.agencyName}
              onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
            />
            <Input
              label="Support Email Address"
              required
              type="email"
              value={settings.agencyEmail}
              onChange={(e) => setSettings({ ...settings, agencyEmail: e.target.value })}
            />
            <Input
              label="Support Phone Line"
              value={settings.agencyPhone}
              onChange={(e) => setSettings({ ...settings, agencyPhone: e.target.value })}
            />
            <Input
              label="Official Registered Address"
              value={settings.agencyAddress}
              onChange={(e) => setSettings({ ...settings, agencyAddress: e.target.value })}
            />
          </div>
        </Card>

        {/* Visual Theme & Appearance Card */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Visual Theme & Color Palette
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
              Primary Brand Color Theme
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {THEME_CONFIG.primaryColors.map((color) => {
                const isSelected = primaryColor.toLowerCase() === color.hex.toLowerCase();
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => {
                      changePrimaryColor(color.hex);
                      setSettings({ ...settings, primaryColor: color.hex });
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                      isSelected ? 'ring-2 ring-[var(--color-primary)] border-transparent shadow-md' : 'border-[var(--color-border)]'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full shrink-0 shadow-inner" style={{ backgroundColor: color.hex }} />
                    <span>{color.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[var(--color-border)]">
            <div>
              <p className="text-xs font-bold text-[var(--color-text)]">System Light / Dark Theme Mode</p>
              <p className="text-[11px] text-[var(--color-muted)]">Toggle background contrast mode across entire application</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={toggleTheme}>
              Switch to {themeMode === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
            </Button>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" size="lg" type="submit" isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
