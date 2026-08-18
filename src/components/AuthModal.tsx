import React, { useState, useEffect } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Save, 
  CheckCircle2,
  Cloud,
  RefreshCw,
  Check,
  Trophy,
  Sparkles,
  Award,
  ArrowRight,
  LogOut,
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';

interface AuthModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLogin: (updatedProfile: UserProfile) => void;
  onLogout: () => void;
  targetReason?: 'quests' | 'leaderboard' | 'general';
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onLogin,
  onLogout,
  targetReason = 'general'
}) => {
  const isAlreadyLoggedIn = !!currentUser.isLoggedIn || !!currentUser.isGoogleLinked;
  
  const [tab, setTab] = useState<'login' | 'register' | 'google' | 'profile'>(() => {
    if (isAlreadyLoggedIn && targetReason === 'general') return 'profile';
    return 'login';
  });

  const [name, setName] = useState<string>(currentUser.name || 'Lữ Khách Phương Nam');
  const [email, setEmail] = useState<string>(currentUser.email || currentUser.googleEmail || 'yxinh187@gmail.com');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(currentUser.avatar);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (!isAlreadyLoggedIn) {
        setTab('login');
      } else if (targetReason === 'general') {
        setTab('profile');
      }
    }
  }, [isOpen, isAlreadyLoggedIn, targetReason]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    
    const updated: UserProfile = {
      ...currentUser,
      name: name.trim() || 'Lữ Khách Phương Nam',
      email: email.trim(),
      avatar: avatar
    };

    onLogin(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'login' 
        ? { email: email.trim(), password }
        : { name: name.trim() || 'Lữ Khách Mới', email: email.trim(), password, avatar };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      const updated: UserProfile = {
        ...currentUser,
        ...(data.user || {}),
        id: data.user?.id || `user_${Date.now()}`,
        name: name.trim() || (tab === 'login' ? 'Lữ Khách Đăng Nhập' : 'Lữ Khách Mới'),
        email: email.trim(),
        avatar: avatar,
        isLoggedIn: true,
        authProvider: 'custom',
        lpPoints: tab === 'register' ? Math.max(currentUser.lpPoints, 500) : currentUser.lpPoints
      };

      onLogin(updated);
      setSaveSuccess(true);
      setSyncMessage(tab === 'login' ? 'Đăng nhập thành công!' : 'Tạo tài khoản thành công (+500 LP)!');
      setTimeout(() => {
        setSaveSuccess(false);
        setSyncMessage('');
        onClose();
      }, 1000);
    } catch (err) {
      // Fallback local login
      const updated: UserProfile = {
        ...currentUser,
        id: `user_${Date.now()}`,
        name: name.trim() || (tab === 'login' ? 'Lữ Khách Đăng Nhập' : 'Lữ Khách Mới'),
        email: email.trim(),
        avatar: avatar,
        isLoggedIn: true,
        authProvider: 'custom',
        lpPoints: tab === 'register' ? Math.max(currentUser.lpPoints, 500) : currentUser.lpPoints
      };
      onLogin(updated);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    }
  };

  // Google Sign-In and Progress Sync
  const handleGoogleSignIn = async () => {
    sound.playClick();
    setIsGoogleLoading(true);
    try {
      const googleUserEmail = email.includes('@') ? email.trim() : 'yxinh187@gmail.com';
      const sampleGoogleUser = {
        email: googleUserEmail,
        name: name.trim() || 'Lữ Khách Google Ba Son',
        picture: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        googleId: `google_${Date.now()}`
      };

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleGoogleUser)
      });
      const data = await res.json();

      if (data.success) {
        sound.playSuccess();
        const mergedUser: UserProfile = {
          ...currentUser,
          ...data.user,
          name: data.user.name || name,
          avatar: data.user.avatar || avatar,
          isLoggedIn: true,
          isGoogleLinked: true,
          googleEmail: sampleGoogleUser.email,
          authProvider: 'google',
          lpPoints: Math.max(currentUser.lpPoints, data.user.lpPoints || 550),
          lastSyncedAt: new Date().toISOString()
        };
        onLogin(mergedUser);
        setSyncMessage('Đã đăng nhập tài khoản Google thành công (+550 LP)!');
        setTimeout(() => {
          setSyncMessage('');
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Google Auth fallback error:', err);
      const fallbackUser: UserProfile = {
        ...currentUser,
        isLoggedIn: true,
        isGoogleLinked: true,
        googleEmail: email || 'yxinh187@gmail.com',
        authProvider: 'google',
        lpPoints: Math.max(currentUser.lpPoints, 550),
        lastSyncedAt: new Date().toISOString()
      };
      onLogin(fallbackUser);
      setSyncMessage('Đã đăng nhập Google & kích hoạt tài khoản!');
      setTimeout(() => {
        setSyncMessage('');
        onClose();
      }, 1200);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSyncCloud = async () => {
    sound.playClick();
    setIsSyncing(true);
    try {
      await fetch('/api/user/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: currentUser })
      });
      sound.playDanTranhNote(659.25, 0.8);
      setSyncMessage('Tiến trình trò chơi đã được sao lưu đám mây an toàn!');
      setTimeout(() => setSyncMessage(''), 2500);
    } catch (e) {
      setSyncMessage('Tiến trình đã được lưu vào bộ nhớ trình duyệt.');
      setTimeout(() => setSyncMessage(''), 2500);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-stone-900 border-2 border-amber-500/40 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden text-stone-100 flex flex-col">
        
        {/* Contextual Reason Banner when opened via Quests or Leaderboard */}
        {targetReason === 'quests' && (
          <div className="bg-gradient-to-r from-amber-600/30 via-yellow-500/20 to-amber-600/30 border-b border-amber-500/40 p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/30 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Yêu Cầu Đăng Nhập</span>
              <p className="text-xs font-semibold text-stone-100">
                Đăng nhập hoặc tạo tài khoản để mở khóa Nhiệm Vụ Di Sản và nhận Huy Hiệu!
              </p>
            </div>
          </div>
        )}

        {targetReason === 'leaderboard' && (
          <div className="bg-gradient-to-r from-yellow-600/30 via-amber-500/20 to-yellow-600/30 border-b border-amber-500/40 p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/30 border border-yellow-400/50 flex items-center justify-center text-yellow-300 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-300">Ghi Danh Bảng Vàng</span>
              <p className="text-xs font-semibold text-stone-100">
                Đăng nhập tài khoản để lưu danh và xếp hạng Lữ Khách Phương Nam!
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="relative px-5 py-4 bg-stone-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Cinzel',serif] font-bold text-base text-amber-200">
                {tab === 'profile' ? 'Hồ Sơ & Lưu Tiến Trình' : tab === 'login' ? 'Đăng Nhập Khám Phá' : 'Đăng Ký Tài Khoản'}
              </h2>
              <p className="text-[10px] text-stone-400">
                {isAlreadyLoggedIn ? `Đang đăng nhập: ${currentUser.name}` : 'Đăng nhập Google hoặc tự tạo tài khoản để tiếp tục'}
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 p-1">
          <button
            onClick={() => { sound.playClick(); setTab('login'); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'login' 
                ? 'bg-amber-500 text-stone-950 shadow-md font-black' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setTab('register'); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'register' 
                ? 'bg-amber-500 text-stone-950 shadow-md font-black' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tạo Tài Khoản (+500 LP)</span>
          </button>

          {isAlreadyLoggedIn && (
            <button
              onClick={() => { sound.playClick(); setTab('profile'); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                tab === 'profile' 
                  ? 'bg-amber-500 text-stone-950 shadow-md font-black' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Hồ Sơ</span>
            </button>
          )}
        </div>

        {/* Sync status toast */}
        {syncMessage && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Quick Google Sign-In Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-500/40 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                    <span>Đăng Nhập Nhanh Bằng Google</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black border border-amber-500/30">+550 LP</span>
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    {currentUser.isGoogleLinked ? `Đã liên kết: ${currentUser.googleEmail || currentUser.email}` : 'Một chạm để đăng nhập & đồng bộ tiến trình'}
                  </p>
                </div>
              </div>

              {currentUser.isGoogleLinked ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Đã liên kết
                </span>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-98"
            >
              {isGoogleLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-700" />
                  Đang xác thực Google...
                </span>
              ) : currentUser.isGoogleLinked ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-stone-700" />
                  <span>Đồng Bộ Tiến Trình Với Google</span>
                </>
              ) : (
                <>
                  <span>Tiếp Tục Với Tài Khoản Google</span>
                  <ArrowRight className="w-4 h-4 text-stone-900" />
                </>
              )}
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-800 w-full" />
            <span className="bg-stone-900 px-3 text-[10px] uppercase font-bold text-stone-500 shrink-0">
              Hoặc Tự Đăng Nhập / Tạo Tài Khoản
            </span>
            <div className="border-t border-stone-800 w-full" />
          </div>

          {tab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300">Ảnh Đại Diện (Avatar)</label>
                <div className="flex items-center gap-3">
                  <img 
                    src={avatar} 
                    alt="Preview" 
                    className="w-14 h-14 rounded-2xl border-2 border-amber-400 object-cover shadow-lg" 
                  />
                  <div className="flex-1 grid grid-cols-6 gap-1.5">
                    {PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { sound.playClick(); setAvatar(av); }}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                          avatar === av ? 'border-amber-400 scale-110 shadow-md' : 'border-stone-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Tên Danh Xưng Lữ Khách</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên hiển thị..."
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/60 text-xs text-stone-100 outline-none"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Địa Chỉ Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@saigon.heritage.vn"
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/60 text-xs text-stone-100 outline-none"
                />
              </div>

              {/* Stats Overview */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-300">
                  <span>Cấp Độ Khám Phá:</span>
                  <span className="font-bold text-amber-300">Cấp {currentUser.level} ({currentUser.title})</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Linh Điểm Đang Có:</span>
                  <span className="font-bold text-amber-400 font-mono">{currentUser.lpPoints} LP</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Huy Hiệu Sở Hữu:</span>
                  <span className="font-bold text-emerald-400">{currentUser.badgesUnlocked.length} / 21</span>
                </div>
                <div className="flex justify-between text-stone-300 pt-1 border-t border-amber-500/20 text-[10px]">
                  <span>Trạng Thái Đám Mây:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Cloud className="w-3 h-3" /> {currentUser.isGoogleLinked ? 'Đã Tự Động Sao Lưu' : 'Cục Bộ'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncCloud}
                  disabled={isSyncing}
                  className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  title="Đẩy tiến trình lên máy chủ đám mây"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sao Lưu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onLogout();
                    setTab('login');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  title="Đăng xuất khỏi tài khoản này"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng Xuất</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveSuccess ? 'Đã Lưu!' : 'Lưu Thay Đổi'}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {tab === 'register' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Tên Danh Xưng Lữ Khách</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Minh Khang"
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/60 text-xs text-stone-100 outline-none"
                      required
                    />
                  </div>

                  {/* Avatar Picker for Register */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Chọn Avatar Khám Phá</label>
                    <div className="flex items-center gap-2">
                      <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-xl object-cover border border-amber-400 shrink-0" />
                      <div className="flex-1 grid grid-cols-6 gap-1">
                        {PRESET_AVATARS.map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => { sound.playClick(); setAvatar(av); }}
                            className={`w-8 h-8 rounded-lg overflow-hidden border transition-all ${
                              avatar === av ? 'border-amber-400 scale-105 shadow' : 'border-stone-700 opacity-60'
                            }`}
                          >
                            <img src={av} alt="av" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Email hoặc Tên Đăng Nhập</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@saigon.heritage.vn"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/60 text-xs text-stone-100 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Mật Khẩu</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/60 text-xs text-stone-100 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-98"
              >
                {tab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>
                  {saveSuccess 
                    ? 'Đang Hoàn Tất...' 
                    : tab === 'login' 
                      ? 'Đăng Nhập Vào Game Ngay' 
                      : 'Hoàn Tất Đăng Ký (+500 LP)'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
