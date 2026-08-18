import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Users, 
  TrendingUp,
  MapPin,
  Clock,
  Star,
  BookOpen,
  GraduationCap,
  Calendar,
  Share2,
  CheckCircle2,
  Download,
  X,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  title: string;
  age: number;
  lpPoints: number;
  badgesCount: number;
  studyHours: number; // Tổng số giờ học sử & nghiên cứu
  completedQuestsCount: number;
  region: string;
  streakDays: number;
  scholarTitle: string;
}

const TOP_EXPLORERS: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'user_top_1',
    name: 'Trần Hoàng Long',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: 'Đại Học Sĩ Đất Gia Định',
    scholarTitle: 'Trạng Nguyên Di Sản Nam Bộ',
    lpPoints: 3850,
    badgesCount: 21,
    studyHours: 48,
    completedQuestsCount: 21,
    region: 'TP. Hồ Chí Minh',
    streakDays: 45
  },
  {
    rank: 2,
    id: 'user_top_2',
    name: 'Nguyễn Bích Thảo',
    age: 23,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    title: 'Nhà Giám Định Di Sản',
    scholarTitle: 'Bảng Nhãn Gốm Sứ Lái Thiêu',
    lpPoints: 3120,
    badgesCount: 19,
    studyHours: 42,
    completedQuestsCount: 19,
    region: 'Bình Dương',
    streakDays: 38
  },
  {
    rank: 3,
    id: 'user_top_3',
    name: 'Phạm Minh Vũ',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    title: 'Thợ Săn Di Sản Biển Đảo',
    scholarTitle: 'Thám Hoa Côn Đảo Hào Hùng',
    lpPoints: 2780,
    badgesCount: 18,
    studyHours: 36,
    completedQuestsCount: 18,
    region: 'Bà Rịa - Vũng Tàu',
    streakDays: 30
  },
  {
    rank: 4,
    id: 'user_top_4',
    name: 'Tiến Sĩ Trần Nam',
    age: 52,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    title: 'Cố Vấn Di Sản Cổ',
    scholarTitle: 'Cố Vấn Lịch Sử Cao Cấp',
    lpPoints: 2450,
    badgesCount: 16,
    studyHours: 54,
    completedQuestsCount: 16,
    region: 'TP. Hồ Chí Minh',
    streakDays: 28
  },
  {
    rank: 5,
    id: 'user_top_5',
    name: 'Lê Thùy Dung',
    age: 21,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    title: 'Nhà Thám Hiểm Di Sản',
    scholarTitle: 'Tú Tài Kiến Trúc Pháp Cổ',
    lpPoints: 2150,
    badgesCount: 14,
    studyHours: 29,
    completedQuestsCount: 14,
    region: 'TP. Hồ Chí Minh',
    streakDays: 22
  },
  {
    rank: 6,
    id: 'user_top_6',
    name: 'Võ Quốc Trọng',
    age: 34,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    title: 'Nghệ Nhân Làng Gốm',
    scholarTitle: 'Cử Nhân Địa Đạo & Lịch Sử',
    lpPoints: 1890,
    badgesCount: 12,
    studyHours: 24,
    completedQuestsCount: 12,
    region: 'Bình Dương',
    streakDays: 19
  },
  {
    rank: 7,
    id: 'user_top_7',
    name: 'Đặng Ngọc Hân',
    age: 19,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    title: 'Học Giả Nam Bộ',
    scholarTitle: 'Học Sinh Ưu Tú Di Sản',
    lpPoints: 1620,
    badgesCount: 10,
    studyHours: 19,
    completedQuestsCount: 10,
    region: 'Bà Rịa - Vũng Tàu',
    streakDays: 14
  },
  {
    rank: 8,
    id: 'user_top_8',
    name: 'Nguyễn Thành Nam',
    age: 28,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    title: 'Lữ Khách Đô Thành',
    scholarTitle: 'Học Viên Tinh Hoa Phương Nam',
    lpPoints: 1350,
    badgesCount: 8,
    studyHours: 15,
    completedQuestsCount: 8,
    region: 'TP. Hồ Chí Minh',
    streakDays: 11
  }
];

interface LeaderboardViewProps {
  currentUser?: UserProfile;
  user?: UserProfile;
}

type RankingCategory = 'overall' | 'study_hours' | 'badges' | 'streak';

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUser, user }) => {
  const activeUser = currentUser || user || {
    id: 'user_sg_01',
    name: 'Lữ Khách Phương Nam',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    title: 'Học Giả Nam Bộ',
    lpPoints: 450,
    studyHours: 8,
    studyMinutes: 45,
    learningStreakDays: 7,
    badgesUnlocked: ['badge_ben_thanh'],
    completedQuests: ['quest_ben_thanh_01']
  };

  const [rankingTab, setRankingTab] = useState<RankingCategory>('overall');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const badgesCount = Array.isArray(activeUser.badgesUnlocked) ? activeUser.badgesUnlocked.length : 0;
  const completedCount = Array.isArray(activeUser.completedQuests) ? activeUser.completedQuests.length : 0;
  const userStudyHours = activeUser.studyHours || 8;
  const userStreak = activeUser.learningStreakDays || 7;

  // Merge current user dynamically with accurate rank placement
  const calculateUserRank = () => {
    if (rankingTab === 'study_hours') {
      if (userStudyHours >= 50) return 2;
      if (userStudyHours >= 30) return 5;
      if (userStudyHours >= 15) return 8;
      return 11;
    } else if (rankingTab === 'badges') {
      if (badgesCount >= 20) return 2;
      if (badgesCount >= 14) return 5;
      if (badgesCount >= 6) return 9;
      return 14;
    } else if (rankingTab === 'streak') {
      if (userStreak >= 40) return 2;
      if (userStreak >= 20) return 6;
      return 10;
    } else {
      const lp = activeUser.lpPoints || 450;
      if (lp >= 3500) return 2;
      if (lp >= 2000) return 5;
      if (lp >= 1000) return 9;
      return 12;
    }
  };

  const userCurrentRank = calculateUserRank();

  // Sort and filter list based on selected category & region
  const getSortedList = () => {
    let list = [...TOP_EXPLORERS];

    if (rankingTab === 'study_hours') {
      list.sort((a, b) => b.studyHours - a.studyHours);
    } else if (rankingTab === 'badges') {
      list.sort((a, b) => b.badgesCount - a.badgesCount);
    } else if (rankingTab === 'streak') {
      list.sort((a, b) => b.streakDays - a.streakDays);
    } else {
      list.sort((a, b) => b.lpPoints - a.lpPoints);
    }

    // Re-assign ranks
    list = list.map((item, idx) => ({ ...item, rank: idx + 1 }));

    return list.filter(item => {
      const matchRegion = filterRegion === 'all' || item.region === filterRegion;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.scholarTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchSearch;
    });
  };

  const sortedExplorers = getSortedList();

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fadeIn pb-24 text-stone-100">
      
      {/* 🏆 HERO GOLDEN BANNER */}
      <div className="relative rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-amber-950/80 via-stone-900 to-stone-950 border-2 border-amber-500/50 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                BẢNG VÀNG DANH DỰ DI SẢN NAM BỘ
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/40 text-[11px] font-bold">
                Mùa Khảo Cứu 2026
              </span>
            </div>

            <h1 className="font-['Cinzel',serif] font-bold text-2xl sm:text-3xl text-amber-200 leading-tight">
              Tôn Vinh Học Giả & Bậc Thầy Di Sản
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              Thống kê số giờ học sử, bộ sưu tập huy hiệu và điểm uy danh của các lữ khách tiêu biểu trên khắp 3 miền đất TP.HCM, Bình Dương và Bà Rịa - Vũng Tàu.
            </p>
          </div>

          {/* Current User Standing Golden Card */}
          <div className="w-full md:w-auto p-4 rounded-2xl bg-stone-950/90 border border-amber-500/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <img 
                  src={activeUser.avatar} 
                  alt={activeUser.name} 
                  className="w-13 h-13 rounded-2xl border-2 border-amber-400 object-cover shadow-md" 
                />
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] shadow">
                  #{userCurrentRank}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                  <span>{activeUser.name} (Bạn)</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px]">Cấp {activeUser.level || 2}</span>
                </div>
                <div className="text-[11px] text-stone-400">{activeUser.title}</div>
                
                <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-stone-300 flex-wrap">
                  <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {userStudyHours}h {activeUser.studyMinutes || 45}p học sử
                  </span>
                  <span className="text-stone-600">•</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Award className="w-3 h-3 text-emerald-400" />
                    {badgesCount}/21 Huy hiệu
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate of Honor Button */}
            <button
              onClick={() => {
                sound.playSuccess();
                setShowCertificateModal(true);
              }}
              className="min-h-[38px] w-full sm:w-auto px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0"
              title="Xem và lưu Bằng Vinh Danh Học Giả Di Sản của bạn"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Chứng Nhận Bảng Vàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📊 CATEGORY TABS FOR BẢNG VÀNG */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'overall', label: '👑 Bảng Vàng Uy Danh', sub: 'Linh Điểm (LP) & Cấp Bậc' },
          { id: 'study_hours', label: '📚 Bảng Vàng Chăm Học', sub: 'Số Giờ Nghiên Cứu Lịch Sử' },
          { id: 'badges', label: '🎖️ Bảng Vàng Huy Hiệu', sub: 'Bộ Sưu Tập 21 Di Sản' },
          { id: 'streak', label: '🔥 Bảng Vàng Kiên Trì', sub: 'Chuỗi Ngày Học Liên Tục' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setRankingTab(tab.id as RankingCategory);
            }}
            className={`min-h-[58px] p-3 rounded-2xl border text-left transition-all flex flex-col justify-center ${
              rankingTab === tab.id
                ? 'bg-amber-500 text-stone-950 border-amber-300 font-bold shadow-lg shadow-amber-500/20 scale-102'
                : 'bg-stone-900/90 text-stone-300 border-stone-800 hover:border-amber-500/40'
            }`}
          >
            <span className="text-xs font-bold truncate">{tab.label}</span>
            <span className={`text-[10px] truncate ${rankingTab === tab.id ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
              {tab.sub}
            </span>
          </button>
        ))}
      </div>

      {/* 🏆 TOP 3 PODIUM DISPLAY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Rank 2 - Á Quân */}
        {sortedExplorers[1] && (
          <div className="order-2 sm:order-1 p-5 rounded-3xl bg-stone-900/95 border border-slate-500/40 flex flex-col items-center text-center space-y-3 relative shadow-xl">
            <div className="absolute top-3 left-3 flex items-center gap-1 text-slate-300 font-bold text-xs">
              <Medal className="w-4 h-4 text-slate-400" />
              <span>Á QUÂN BẢNG VÀNG</span>
            </div>
            <div className="relative mt-2">
              <img 
                src={sortedExplorers[1].avatar} 
                alt={sortedExplorers[1].name} 
                className="w-16 h-16 rounded-full border-2 border-slate-400 object-cover shadow-md" 
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-400 text-stone-950 font-bold text-xs flex items-center justify-center shadow">
                2
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-100">{sortedExplorers[1].name}</h3>
              <p className="text-[11px] text-amber-400 font-medium">{sortedExplorers[1].scholarTitle}</p>
              <p className="text-[10px] text-stone-400">{sortedExplorers[1].region}</p>
            </div>
            <div className="w-full pt-2 border-t border-stone-800 flex justify-between text-xs text-stone-300">
              <span className="text-amber-400 font-bold font-mono">
                {rankingTab === 'study_hours' 
                  ? `${sortedExplorers[1].studyHours} Giờ Học` 
                  : rankingTab === 'badges' 
                  ? `${sortedExplorers[1].badgesCount} Huy Hiệu` 
                  : `${sortedExplorers[1].lpPoints} LP`}
              </span>
              <span className="text-emerald-400 font-semibold">{sortedExplorers[1].badgesCount}/21 Huy hiệu</span>
            </div>
          </div>
        )}

        {/* Rank 1 - Quán Quân Bảng Vàng */}
        {sortedExplorers[0] && (
          <div className="order-1 sm:order-2 p-6 rounded-3xl bg-gradient-to-b from-amber-950/80 via-stone-900 to-stone-950 border-2 border-amber-400 flex flex-col items-center text-center space-y-3 relative shadow-2xl shadow-amber-500/20 transform sm:-translate-y-2">
            <div className="absolute -top-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs flex items-center gap-1 shadow-lg">
              <Crown className="w-4 h-4 fill-stone-950" />
              <span>TRẠNG NGUYÊN DI SẢN</span>
            </div>
            <div className="relative mt-2">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-xl">
                <img 
                  src={sortedExplorers[0].avatar} 
                  alt={sortedExplorers[0].name} 
                  className="w-full h-full rounded-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-center shadow-md">
                1
              </div>
            </div>
            <div>
              <h3 className="font-['Cinzel',serif] font-bold text-base text-amber-200">{sortedExplorers[0].name}</h3>
              <p className="text-xs text-yellow-400 font-bold">{sortedExplorers[0].scholarTitle}</p>
              <p className="text-[11px] text-stone-400">{sortedExplorers[0].region}</p>
            </div>
            <div className="w-full pt-3 border-t border-amber-500/30 flex justify-between text-xs text-stone-200 font-semibold">
              <span className="text-yellow-300 font-black font-mono text-sm">
                {rankingTab === 'study_hours' 
                  ? `${sortedExplorers[0].studyHours} Giờ Học Sử` 
                  : rankingTab === 'badges' 
                  ? `${sortedExplorers[0].badgesCount}/21 Toàn Bộ` 
                  : `${sortedExplorers[0].lpPoints} LP`}
              </span>
              <span className="text-emerald-400 font-bold">
                {sortedExplorers[0].studyHours}h • {sortedExplorers[0].badgesCount} Huy Hiệu
              </span>
            </div>
          </div>
        )}

        {/* Rank 3 - Quý Quân */}
        {sortedExplorers[2] && (
          <div className="order-3 sm:order-3 p-5 rounded-3xl bg-stone-900/95 border border-amber-700/50 flex flex-col items-center text-center space-y-3 relative shadow-xl">
            <div className="absolute top-3 left-3 flex items-center gap-1 text-amber-600 font-bold text-xs">
              <Medal className="w-4 h-4 text-amber-600" />
              <span>QUÝ QUÂN BẢNG VÀNG</span>
            </div>
            <div className="relative mt-2">
              <img 
                src={sortedExplorers[2].avatar} 
                alt={sortedExplorers[2].name} 
                className="w-16 h-16 rounded-full border-2 border-amber-700 object-cover shadow-md" 
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-bold text-xs flex items-center justify-center shadow">
                3
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-100">{sortedExplorers[2].name}</h3>
              <p className="text-[11px] text-amber-400 font-medium">{sortedExplorers[2].scholarTitle}</p>
              <p className="text-[10px] text-stone-400">{sortedExplorers[2].region}</p>
            </div>
            <div className="w-full pt-2 border-t border-stone-800 flex justify-between text-xs text-stone-300">
              <span className="text-amber-400 font-bold font-mono">
                {rankingTab === 'study_hours' 
                  ? `${sortedExplorers[2].studyHours} Giờ Học` 
                  : rankingTab === 'badges' 
                  ? `${sortedExplorers[2].badgesCount} Huy Hiệu` 
                  : `${sortedExplorers[2].lpPoints} LP`}
              </span>
              <span className="text-emerald-400 font-semibold">{sortedExplorers[2].badgesCount}/21 Huy hiệu</span>
            </div>
          </div>
        )}
      </div>

      {/* 🔍 FILTER & REGION SELECTOR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900/90 p-3 rounded-2xl border border-stone-800 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'Toàn Vùng Nam Bộ' },
            { id: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
            { id: 'Bình Dương', label: 'Bình Dương' },
            { id: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' }
          ].map(reg => (
            <button
              key={reg.id}
              onClick={() => { sound.playClick(); setFilterRegion(reg.id); }}
              className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterRegion === reg.id 
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md' 
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên học giả, danh hiệu..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:border-amber-500/50 outline-none"
          />
        </div>
      </div>

      {/* 📋 FULL LEADERBOARD TABLE */}
      <div className="rounded-3xl bg-stone-900/90 border border-stone-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 border-b border-stone-800 text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3.5 text-center">Hạng</th>
                <th className="px-4 py-3.5">Học Giả / Lữ Khách</th>
                <th className="px-4 py-3.5 hidden sm:table-cell">Khu Vực</th>
                <th className="px-4 py-3.5 text-center">Số Giờ Học Sử</th>
                <th className="px-4 py-3.5 text-center">Huy Hiệu</th>
                <th className="px-4 py-3.5 text-center hidden md:table-cell">Chuỗi Ngày</th>
                <th className="px-4 py-3.5 text-right">Linh Điểm (LP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {sortedExplorers.map((player) => (
                <tr 
                  key={player.id} 
                  className="hover:bg-stone-800/50 transition-colors"
                >
                  <td className="px-4 py-3.5 text-center">
                    {player.rank === 1 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 font-black text-xs inline-flex items-center justify-center">1</span>
                    ) : player.rank === 2 ? (
                      <span className="w-6 h-6 rounded-full bg-slate-300 text-stone-950 font-bold text-xs inline-flex items-center justify-center">2</span>
                    ) : player.rank === 3 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs inline-flex items-center justify-center">3</span>
                    ) : (
                      <span className="text-stone-400 font-mono font-bold">#{player.rank}</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img 
                        src={player.avatar} 
                        alt={player.name} 
                        className="w-10 h-10 rounded-2xl object-cover border border-amber-500/30 shrink-0 shadow-sm" 
                      />
                      <div>
                        <div className="font-bold text-stone-100 flex items-center gap-1.5">
                          <span>{player.name}</span>
                          <span className="text-[10px] text-stone-400 font-normal">({player.age}t)</span>
                        </div>
                        <div className="text-[11px] text-amber-400 font-medium">{player.scholarTitle}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell text-stone-300">
                    <span className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-[10px] font-semibold text-stone-300">
                      {player.region}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-center font-bold text-amber-300 font-mono">
                    <span className="inline-flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {player.studyHours} giờ
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-center font-bold text-emerald-400">
                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <Award className="w-3 h-3" />
                      {player.badgesCount} / 21
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-center hidden md:table-cell">
                    <span className="text-orange-400 font-bold font-mono inline-flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      {player.streakDays} ngày
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <span className="font-bold font-mono text-amber-400 text-sm">
                      {player.lpPoints.toLocaleString()} LP
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📜 CHỨNG NHẬN BẢNG VÀNG MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-stone-900 via-amber-950/30 to-stone-900 border-2 border-amber-400 rounded-3xl shadow-[0_25px_60px_rgba(245,158,11,0.25)] overflow-hidden p-6 sm:p-8 space-y-6 text-center">
            {/* Close button */}
            <button 
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40">
                VIỆN BẢO TỒN DI SẢN PHƯƠNG NAM • NIÊN KHÓA 2026
              </span>
              <h2 className="font-['Cinzel',serif] font-bold text-2xl sm:text-3xl text-amber-200 mt-2">
                BẰNG VINH DANH HỌC GIẢ DI SẢN
              </h2>
              <p className="text-xs text-stone-400">Chứng nhận thành tích học tập và nghiên cứu văn hóa lịch sử Nam Bộ</p>
            </div>

            {/* Recipient Showcase */}
            <div className="py-4 border-y border-amber-500/30 space-y-3">
              <div className="w-20 h-20 rounded-full mx-auto p-1 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-xl">
                <img src={activeUser.avatar} alt={activeUser.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-amber-300">{activeUser.name}</h3>
                <p className="text-xs text-amber-400/90 font-medium">Danh hiệu: {activeUser.title}</p>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <p className="text-[10px] text-stone-400 uppercase">Thời gian học sử</p>
                  <p className="font-bold font-mono text-amber-400 text-sm mt-0.5">{userStudyHours} Giờ</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <p className="text-[10px] text-stone-400 uppercase">Huy hiệu đạt được</p>
                  <p className="font-bold font-mono text-emerald-400 text-sm mt-0.5">{badgesCount} / 21</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <p className="text-[10px] text-stone-400 uppercase">Vị trí Bảng Vàng</p>
                  <p className="font-bold font-mono text-yellow-400 text-sm mt-0.5">Hạng #{userCurrentRank}</p>
                </div>
              </div>
            </div>

            {/* Certificate Footer Signature */}
            <div className="flex items-center justify-between text-xs text-stone-400 pt-2 px-4">
              <div className="text-left">
                <p className="text-[10px] uppercase text-stone-500">Mã Chứng Nhận:</p>
                <p className="font-mono text-amber-400 font-bold">VN-HERITAGE-2026-{activeUser.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-stone-500">Cố Vấn Di Sản Xác Nhận:</p>
                <p className="font-['Cinzel',serif] text-amber-300 font-bold">CỐ VẤN BA SON AI</p>
              </div>
            </div>

            {/* Download / Share Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playSuccess();
                  alert('Đã lưu chứng nhận vinh danh vào thư viện ảnh của bạn!');
                  setShowCertificateModal(false);
                }}
                className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Lưu Chứng Nhận Danh Dự</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
