import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Send, 
  Plus, 
  Search, 
  Award, 
  MapPin, 
  Sparkles, 
  HelpCircle, 
  Coffee, 
  BookOpen, 
  User, 
  Share2, 
  X, 
  Clock, 
  Smile, 
  MessageCircle, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  UserPlus, 
  UserCheck, 
  Filter, 
  Flame, 
  Compass, 
  Calendar,
  Zap,
  GraduationCap,
  Volume2
} from 'lucide-react';
import { ForumPost, UserProfile, Location3D, DirectMessage, HeritageSticker, TravelerDirectoryUser } from '../types';
import { INITIAL_FORUM_POSTS } from '../data/forumData';
import { HERITAGE_STICKERS } from '../data/stickers';
import { sound } from '../utils/audio';

interface CommunityForumProps {
  user?: UserProfile;
  currentUser?: UserProfile;
  initialPosts?: ForumPost[];
  locations?: Location3D[];
  onOpenAI?: (contextText?: string) => void;
  onNavigateToLeaderboard?: () => void;
}

// Danh sách lữ khách mẫu với số giờ học sử, độ tuổi, và kiến thức di sản
const INITIAL_TRAVELERS: TravelerDirectoryUser[] = [
  {
    id: 'user_sg_02',
    name: 'Trần Văn Kiệt',
    age: 24,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    title: 'Nhà Thám Hiểm Trẻ',
    level: 4,
    lpPoints: 920,
    badgesCount: 6,
    studyHours: 18,
    province: 'TP. Hồ Chí Minh',
    favoriteHeritage: 'Bưu Điện Trung Tâm & Xưởng Ba Son',
    bio: 'Đam mê nhiếp ảnh kiến trúc Pháp cổ và giải mật thư di sản Ba Son.',
    isOnline: true,
    friendStatus: 'none'
  },
  {
    id: 'user_sg_03',
    name: 'Lê Thảo My',
    age: 21,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    title: 'Họa Sĩ Ký Họa Đô Thị',
    level: 3,
    lpPoints: 750,
    badgesCount: 5,
    studyHours: 14,
    province: 'TP. Hồ Chí Minh',
    favoriteHeritage: 'Chợ Bến Thành & Hào Sĩ Phường',
    bio: 'Thích vẽ ký họa các góc ban công xưa và thưởng thức cà phê vợt.',
    isOnline: true,
    friendStatus: 'friends'
  },
  {
    id: 'user_sg_04',
    name: 'Tiến Sĩ Trần Nam',
    age: 52,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    title: 'Cố Vấn Di Sản Cổ',
    level: 9,
    lpPoints: 3450,
    badgesCount: 18,
    studyHours: 54,
    province: 'TP. Hồ Chí Minh',
    favoriteHeritage: 'Dinh Độc Lập & Bảo Tàng Lịch Sử',
    bio: 'Nghiên cứu lịch sử văn hóa Nam Bộ thế kỷ 18-20. Sẵn sàng chia sẻ kiến thức.',
    isOnline: false,
    friendStatus: 'none'
  },
  {
    id: 'user_sg_05',
    name: 'Nguyễn Minh Khang',
    age: 28,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    title: 'Nhà Giám Định Di Sản',
    level: 7,
    lpPoints: 2180,
    badgesCount: 12,
    studyHours: 32,
    province: 'Bình Dương',
    favoriteHeritage: 'Chùa Hội Khánh & Làng Gốm Tân Phước Khánh',
    bio: 'Chuyên khảo cứu gốm Lái Thiêu và kiến trúc nhà cổ Bình Dương.',
    isOnline: true,
    friendStatus: 'none'
  },
  {
    id: 'user_sg_06',
    name: 'Đặng Ngọc Hân',
    age: 19,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    title: 'Học Giả Nam Bộ',
    level: 5,
    lpPoints: 1420,
    badgesCount: 9,
    studyHours: 22,
    province: 'Bà Rịa - Vũng Tàu',
    favoriteHeritage: 'Hải Đăng Vũng Tàu & Bạch Dinh',
    bio: 'Sinh viên yêu biển đảo quê hương và lịch sử hào hùng Côn Đảo.',
    isOnline: true,
    friendStatus: 'none'
  },
  {
    id: 'user_sg_07',
    name: 'Hoàng Yến',
    age: 35,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    title: 'Nghệ Nhân Làng Nghề',
    level: 6,
    lpPoints: 1890,
    badgesCount: 11,
    studyHours: 29,
    province: 'Bình Dương',
    favoriteHeritage: 'Làng Sơn Mài Tương Bình Hiệp',
    bio: 'Thế hệ thứ tư giữ nghề sơn mài truyền thống đất Thủ.',
    isOnline: false,
    friendStatus: 'none'
  }
];

export const CommunityForum: React.FC<CommunityForumProps> = ({
  user,
  currentUser,
  initialPosts = INITIAL_FORUM_POSTS,
  locations = [],
  onOpenAI,
  onNavigateToLeaderboard
}) => {
  const activeUser = currentUser || user || {
    id: 'user_sg_01',
    name: 'Lữ Khách Phương Nam',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    title: 'Học Giả Nam Bộ',
    lpPoints: 450,
    studyHours: 8,
    level: 2
  };

  // Tabs: 'forum' (Diễn đàn) | 'travelers' (Tìm Lữ Khách & Kết Bạn) | 'direct_messages' (Tin Nhắn Riêng)
  const [activeTab, setActiveTab] = useState<'forum' | 'travelers' | 'direct_messages'>('forum');

  // Forum State
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  const [selectedCommentSticker, setSelectedCommentSticker] = useState<{ [postId: string]: HeritageSticker | null }>({});
  const [showStickerPickerForPost, setShowStickerPickerForPost] = useState<string | null>(null);

  // Travelers Directory & Friend Search State
  const [travelers, setTravelers] = useState<TravelerDirectoryUser[]>(INITIAL_TRAVELERS);
  const [travelerSearchText, setTravelerSearchText] = useState<string>('');
  const [travelerAgeFilter, setTravelerAgeFilter] = useState<string>('all');
  const [travelerProvinceFilter, setTravelerProvinceFilter] = useState<string>('all');

  // New Post Modal State
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'hints' | 'history' | 'cuisine' | 'general' | 'showcase'>('hints');
  const [newLocationTag, setNewLocationTag] = useState<string>('');
  const [newPostSticker, setNewPostSticker] = useState<HeritageSticker | null>(null);
  const [showPostStickerPicker, setShowPostStickerPicker] = useState<boolean>(false);

  // Direct Messaging State with Bi-Directional Interactive Simulation
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([
    {
      id: 'dm_1',
      senderId: 'user_sg_02',
      senderName: 'Trần Văn Kiệt',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
      recipientId: activeUser.id,
      recipientName: activeUser.name,
      text: 'Chào bạn! Bạn đã giải được mật thư số 1886 ở Bưu Điện Sài Gòn chưa? Mình vừa khám phá ra hoa văn kim loại dưới vòm trần đấy!',
      sticker: HERITAGE_STICKERS[0],
      timestamp: '10:15'
    },
    {
      id: 'dm_2',
      senderId: 'user_sg_03',
      senderName: 'Lê Thảo My',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
      recipientId: activeUser.id,
      recipientName: activeUser.name,
      text: 'Cố vấn Ba Son vừa hướng dẫn mình kiến trúc vòm tháp Nhà Thờ Đức Bà và quán cà phê vợt Ba Lù thơm lừng!',
      timestamp: '11:42'
    }
  ]);

  const [selectedRecipient, setSelectedRecipient] = useState<{ id: string; name: string; avatar: string; title: string }>({
    id: 'user_sg_02',
    name: 'Trần Văn Kiệt',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    title: 'Nhà Thám Hiểm Trẻ'
  });

  const [dmInputText, setDmInputText] = useState<string>('');
  const [dmSelectedSticker, setDmSelectedSticker] = useState<HeritageSticker | null>(null);
  const [showDmStickerPicker, setShowDmStickerPicker] = useState<boolean>(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState<boolean>(false);

  // Quick Prompt Suggestions for DMs
  const QUICK_CHAT_SUGGESTIONS = [
    'Chào bạn! Rất vui được kết bạn!',
    'Bạn đã giải mật thư Bưu Điện Sài Gòn chưa?',
    'Cho mình hỏi kinh nghiệm săn huy hiệu Sử Thi nhé?',
    'Hôm nay bạn đã tích lũy được mấy giờ học sử rồi?',
    'Bạn có mẹo gì khi khám phá Chùa Hội Khánh không?'
  ];

  // Handle Friend Request Status Change
  const handleToggleFriend = (travelerId: string) => {
    sound.playClick();
    setTravelers(prev => prev.map(t => {
      if (t.id === travelerId) {
        if (t.friendStatus === 'none') {
          sound.playSuccess();
          return { ...t, friendStatus: 'pending' };
        } else if (t.friendStatus === 'pending') {
          return { ...t, friendStatus: 'none' };
        } else {
          return { ...t, friendStatus: 'none' };
        }
      }
      return t;
    }));
  };

  // Start direct message conversation with a traveler
  const handleStartDmWithTraveler = (t: TravelerDirectoryUser) => {
    sound.playClick();
    setSelectedRecipient({
      id: t.id,
      name: t.name,
      avatar: t.avatar,
      title: t.title
    });
    setActiveTab('direct_messages');
  };

  // Handle Post Like
  const handleLikePost = (postId: string) => {
    sound.playClick();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.isLiked;
        return {
          ...p,
          isLiked: !isLiked,
          likes: isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  // Handle Comment Submission + Interactive reply simulation
  const handleAddComment = (postId: string) => {
    const text = commentInput[postId]?.trim();
    const sticker = selectedCommentSticker[postId];
    if (!text && !sticker) return;

    sound.playSuccess();
    const newComment = {
      id: `comment_${Date.now()}`,
      authorName: activeUser.name,
      authorAvatar: activeUser.avatar,
      authorTitle: activeUser.title,
      content: text || '',
      sticker: sticker || undefined,
      timestamp: 'Vừa xong',
      likes: 0
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));

    setCommentInput(prev => ({ ...prev, [postId]: '' }));
    setSelectedCommentSticker(prev => ({ ...prev, [postId]: null }));
    setShowStickerPickerForPost(null);

    // Interactive Community Response: Another scholar replies after 2.5s
    setTimeout(() => {
      const targetPost = posts.find(p => p.id === postId);
      const responder = targetPost?.authorName !== 'Lê Thảo My' ? INITIAL_TRAVELERS[1] : INITIAL_TRAVELERS[2];
      
      const replyComment = {
        id: `comment_reply_${Date.now()}`,
        authorName: responder.name,
        authorAvatar: responder.avatar,
        authorTitle: responder.title,
        content: `Cảm ơn ý kiến chia sẻ rất sắc sảo của bạn @${activeUser.name}! Rất mong được cùng thảo luận thêm về di sản này!`,
        sticker: HERITAGE_STICKERS[Math.floor(Math.random() * HERITAGE_STICKERS.length)],
        timestamp: 'Vừa xong',
        likes: 1
      };

      setPosts(curr => curr.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, replyComment]
          };
        }
        return p;
      }));
      sound.playDanTranhNote(659.25, 0.4);
    }, 2800);
  };

  // Generate contextual AI/Traveler response based on recipient identity
  const getSimulatedResponse = (recipientName: string, userText: string): { text: string; sticker?: HeritageSticker } => {
    const textLower = userText.toLowerCase();

    if (recipientName.includes('Trần Văn Kiệt')) {
      if (textLower.includes('bưu điện') || textLower.includes('mật thư')) {
        return {
          text: 'Mật thư ở Bưu Điện Sài Gòn liên quan đến năm khánh thành 1886 và bản đồ viễn thông Nam Kỳ cổ. Bạn chú ý hàng ghế gỗ nguyên khối ở sảnh chính nhé!',
          sticker: HERITAGE_STICKERS[0]
        };
      }
      if (textLower.includes('chào') || textLower.includes('kết bạn')) {
        return {
          text: `Chào lữ khách ${activeUser.name}! Rất vui được làm quen. Mình đang nghiên cứu kiến trúc Xưởng Ba Son và Bến Thành, có manh mối gì hay ta cùng trao đổi nhé!`,
          sticker: HERITAGE_STICKERS[1]
        };
      }
      return {
        text: 'Ý kiến của bạn rất tuyệt! Nhiếp ảnh di sản giúp chúng ta lưu giữ từng đường nét kiến trúc cổ kính. Chúc bạn thu thập thêm nhiều huy hiệu quý!',
        sticker: HERITAGE_STICKERS[0]
      };
    }

    if (recipientName.includes('Lê Thảo My')) {
      if (textLower.includes('cà phê') || textLower.includes('vẽ') || textLower.includes('ký họa')) {
        return {
          text: 'Quán cà phê vợt Ba Lù ở Chợ Lớn mở từ 1950 đến nay vẫn giữ nguyên bếp củi rang cà phê với bơ và rượu rum. Góc ban công ở đó vẽ ký họa đẹp tuyệt vời!',
          sticker: HERITAGE_STICKERS[2]
        };
      }
      return {
        text: `Chào bạn! Mình vừa hoàn thành bức ký họa vòm tháp Nhà Thờ Đức Bà. Bạn đã ghé thăm Hào Sĩ Phường ở Quận 5 chưa? Góc đó lên tranh rất có hồn!`,
        sticker: HERITAGE_STICKERS[1]
      };
    }

    if (recipientName.includes('Tiến Sĩ Trần Nam')) {
      return {
        text: `Chào bạn học giả. Theo sử liệu Gia Định Thành Thông Chí, vùng đất Nam Bộ có sự giao thoa văn hóa đặc sắc giữa người Việt, Hoa, Chăm và Khmer. Hãy tiếp tục đào sâu nghiên cứu nhé!`,
        sticker: HERITAGE_STICKERS[3]
      };
    }

    if (recipientName.includes('Nguyễn Minh Khang')) {
      return {
        text: `Đất Bình Dương có Chùa Hội Khánh sở hữu tượng Phật nằm trên mái dài 52m lớn nhất châu Á, cùng làng gốm Tân Phước Khánh với lò củi truyền thống hàng trăm năm tuổi!`,
        sticker: HERITAGE_STICKERS[4]
      };
    }

    // Default friendly response
    return {
      text: `Rất vui được trao đổi cùng bạn! Khám phá văn hóa di sản Nam Bộ cùng những người bạn đồng hành thật sự là trải nghiệm vô cùng ý nghĩa.`,
      sticker: HERITAGE_STICKERS[0]
    };
  };

  // Handle Direct Message Send with Realistic Two-Way Interactive Dialogue
  const handleSendDirectMessage = async (customText?: string) => {
    const text = (customText || dmInputText).trim();
    const sticker = dmSelectedSticker;
    if (!text && !sticker) return;

    sound.playClick();
    setDmInputText('');
    setDmSelectedSticker(null);
    setShowDmStickerPicker(false);

    const userMsg: DirectMessage = {
      id: `dm_${Date.now()}`,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderAvatar: activeUser.avatar,
      recipientId: selectedRecipient.id,
      recipientName: selectedRecipient.name,
      text: text || (sticker ? `[Đã gửi nhãn dán: ${sticker.name}]` : ''),
      sticker: sticker || undefined,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setDirectMessages(prev => [...prev, userMsg]);

    // Set typing indicator
    setIsRecipientTyping(true);

    // Realistic Reply Delay (1.5s - 2.2s)
    setTimeout(() => {
      const simulated = getSimulatedResponse(selectedRecipient.name, text);
      const recipientReply: DirectMessage = {
        id: `dm_reply_${Date.now()}`,
        senderId: selectedRecipient.id,
        senderName: selectedRecipient.name,
        senderAvatar: selectedRecipient.avatar,
        recipientId: activeUser.id,
        recipientName: activeUser.name,
        text: simulated.text,
        sticker: simulated.sticker,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setIsRecipientTyping(false);
      setDirectMessages(prev => [...prev, recipientReply]);
      sound.playDanTranhNote(784, 0.4);
    }, 1800);
  };

  const handleOpenDmWithUser = (userName: string, userAvatar: string, userTitle: string) => {
    sound.playClick();
    setSelectedRecipient({
      id: `user_${userName.toLowerCase().replace(/\s+/g, '_')}`,
      name: userName,
      avatar: userAvatar,
      title: userTitle
    });
    setActiveTab('direct_messages');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    sound.playSuccess();
    const fallbackPost: ForumPost = {
      id: `post_${Date.now()}`,
      title: newTitle,
      content: newContent,
      category: newCategory,
      locationTag: newLocationTag || undefined,
      authorName: activeUser.name,
      authorAvatar: activeUser.avatar,
      authorTitle: activeUser.title,
      likes: 1,
      commentsCount: 0,
      comments: [],
      timestamp: 'Vừa xong',
      sticker: newPostSticker || undefined
    };

    setPosts(prev => [fallbackPost, ...prev]);
    setNewTitle('');
    setNewContent('');
    setNewPostSticker(null);
    setIsNewPostModalOpen(false);

    // Dynamic community encouragement reply simulation after 3s
    setTimeout(() => {
      const cheerComment = {
        id: `comment_cheer_${Date.now()}`,
        authorName: 'Trần Văn Kiệt',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
        authorTitle: 'Nhà Thám Hiểm Trẻ',
        content: `Bài viết rất giá trị và đầy cảm hứng! Chúc bạn @${activeUser.name} sớm thu thập đủ 21 huy hiệu di sản nhé! 🔥`,
        sticker: HERITAGE_STICKERS[0],
        timestamp: 'Vừa xong',
        likes: 2
      };

      setPosts(curr => curr.map((p, idx) => {
        if (idx === 0) {
          return {
            ...p,
            likes: p.likes + 2,
            commentsCount: p.commentsCount + 1,
            comments: [cheerComment, ...p.comments]
          };
        }
        return p;
      }));
      sound.playSuccess();
    }, 3200);
  };

  // Filtered Forum Posts
  const filteredPosts = posts.filter(post => {
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.locationTag && post.locationTag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Filtered Travelers Directory by Name, Age, Province
  const filteredTravelers = travelers.filter(traveler => {
    const query = travelerSearchText.toLowerCase().trim();
    
    const matchesQuery = 
      query === '' ||
      traveler.name.toLowerCase().includes(query) ||
      traveler.title.toLowerCase().includes(query) ||
      traveler.favoriteHeritage.toLowerCase().includes(query) ||
      traveler.province.toLowerCase().includes(query) ||
      String(traveler.age).includes(query);

    let matchesAge = true;
    if (travelerAgeFilter === 'under_20') {
      matchesAge = traveler.age < 20;
    } else if (travelerAgeFilter === '20_30') {
      matchesAge = traveler.age >= 20 && traveler.age <= 30;
    } else if (travelerAgeFilter === '31_45') {
      matchesAge = traveler.age >= 31 && traveler.age <= 45;
    } else if (travelerAgeFilter === 'over_45') {
      matchesAge = traveler.age > 45;
    }

    let matchesProvince = true;
    if (travelerProvinceFilter !== 'all') {
      matchesProvince = traveler.province.toLowerCase().includes(travelerProvinceFilter.toLowerCase());
    }

    return matchesQuery && matchesAge && matchesProvince;
  });

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fadeIn pb-24 text-stone-100">
      
      {/* 🏛️ FORUM HEADER BANNER */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40">
                <Users className="w-4 h-4 text-amber-400" />
                HỘI QUÁN LỮ KHÁCH PHƯƠNG NAM
              </span>
              <span className="text-emerald-300 text-[11px] font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                6 Lữ Khách Đang Tương Tác
              </span>
            </div>

            <h2 className="font-['Cinzel',serif] font-bold text-2xl sm:text-3xl text-amber-200">
              Diễn Đàn & Nhắn Tin Giao Lưu Chân Thực
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              Trò chuyện qua lại trực tiếp với các học giả, giải mã bí kíp mật thư di sản, chia sẻ hình ảnh và cùng nhau đua top trên Bảng Vàng danh dự.
            </p>
          </div>

          {/* Navigation to Leaderboard */}
          {onNavigateToLeaderboard && (
            <button
              onClick={() => {
                sound.playSuccess();
                onNavigateToLeaderboard();
              }}
              className="min-h-[40px] px-3.5 py-2 rounded-2xl bg-stone-950/90 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center gap-2 shadow-lg transition-all shrink-0 hover:bg-stone-900"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Xem Bảng Vàng Học Giả</span>
            </button>
          )}
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS */}
      <div className="flex items-center justify-between gap-3 border-b border-stone-800 pb-3 flex-wrap">
        <div className="flex items-center gap-2 p-1 bg-stone-900 rounded-2xl border border-stone-800 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => { sound.playClick(); setActiveTab('forum'); }}
            className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'forum'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Thảo Luận Di Sản ({posts.length})</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('travelers'); }}
            className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'travelers'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Tìm Lữ Khách & Kết Bạn</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('direct_messages'); }}
            className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'direct_messages'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kênh Chat Trực Tiếp</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {activeTab === 'forum' && (
          <button
            onClick={() => { sound.playClick(); setIsNewPostModalOpen(true); }}
            className="min-h-[40px] px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-102 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng Bài Mới</span>
          </button>
        )}
      </div>

      {/* ================= VIEW 1: FORUM POSTS ================= */}
      {activeTab === 'forum' && (
        <div className="space-y-5">
          {/* Category Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài viết, manh mối mật thư, ẩm thực..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 focus:border-amber-500/50 text-xs text-stone-100 placeholder-stone-500 outline-none shadow-md"
              />
            </div>

            {/* Quick Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              {[
                { id: 'all', label: 'Tất Cả' },
                { id: 'hints', label: 'Bí Kíp Mật Thư' },
                { id: 'history', label: 'Sử Liệu Cố Vấn' },
                { id: 'cuisine', label: 'Ẩm Thực' },
                { id: 'showcase', label: 'Vinh Danh' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { sound.playClick(); setSelectedCategory(cat.id); }}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map(post => {
              const isExpanded = expandedPostId === post.id;
              return (
                <div 
                  key={post.id} 
                  className="p-4 sm:p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/30 transition-all shadow-xl space-y-3 sm:space-y-4"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.authorAvatar} 
                        alt={post.authorName} 
                        className="w-10 h-10 rounded-2xl object-cover border border-amber-500/30 shadow-md shrink-0" 
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-stone-100">{post.authorName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                            {post.authorTitle}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-stone-500" />
                          <span>{post.timestamp}</span>
                          {post.locationTag && (
                            <>
                              <span>•</span>
                              <span className="text-amber-400 font-medium">{post.locationTag}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Direct Message Button to Author */}
                    {post.authorName !== activeUser.name && (
                      <button
                        onClick={() => handleOpenDmWithUser(post.authorName, post.authorAvatar, post.authorTitle)}
                        className="min-h-[36px] px-3 py-1 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-amber-300 text-xs flex items-center gap-1.5 transition-colors shrink-0 font-medium"
                        title="Nhắn tin riêng trực tiếp với lữ khách này"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Nhắn Tin</span>
                      </button>
                    )}
                  </div>

                  {/* Post Body */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-amber-200">{post.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {post.sticker && (
                      <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-stone-950 border border-amber-500/30 text-xs text-amber-200">
                        <span className="text-xl">{post.sticker.icon}</span>
                        <span className="font-bold">{post.sticker.name}</span>
                        <span className="text-[10px] text-stone-400">({post.sticker.meaning})</span>
                      </div>
                    )}
                  </div>

                  {/* Post Actions & Comments Bar */}
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all ${
                          post.isLiked 
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold' 
                            : 'hover:bg-stone-800 text-stone-300'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                        <span>{post.likes} Thích</span>
                      </button>

                      <button
                        onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                        className="min-h-[36px] flex items-center gap-1.5 px-3 py-1 rounded-xl hover:bg-stone-800 text-stone-300 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-amber-400" />
                        <span>{post.commentsCount} Bình Luận</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-stone-500 hidden sm:inline">
                      Nhấn bình luận để tương tác cùng học giả
                    </span>
                  </div>

                  {/* Expanded Comments Section */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-stone-800/60 space-y-3 animate-fadeIn">
                      {post.comments.map(c => (
                        <div key={c.id} className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={c.authorAvatar} alt={c.authorName} className="w-6 h-6 rounded-full object-cover" />
                              <span className="font-bold text-xs text-stone-200">{c.authorName}</span>
                              <span className="text-[10px] text-amber-400/80">({c.authorTitle})</span>
                            </div>
                            <span className="text-[10px] text-stone-500">{c.timestamp}</span>
                          </div>
                          <p className="text-xs text-stone-300 pl-8 leading-relaxed">{c.content}</p>
                          {c.sticker && (
                            <div className="pl-8 pt-1 flex items-center gap-1.5 text-xs text-amber-300">
                              <span className="text-lg">{c.sticker.icon}</span>
                              <span className="font-semibold">{c.sticker.name}</span>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Comment Input */}
                      <div className="space-y-2 pt-1">
                        {showStickerPickerForPost === post.id && (
                          <div className="p-2.5 rounded-2xl bg-stone-950 border border-amber-500/40 grid grid-cols-4 sm:grid-cols-6 gap-1.5 animate-fadeIn">
                            {HERITAGE_STICKERS.map(stk => (
                              <button
                                key={stk.id}
                                onClick={() => {
                                  setSelectedCommentSticker(prev => ({ ...prev, [post.id]: stk }));
                                  setShowStickerPickerForPost(null);
                                }}
                                className="p-1.5 rounded-xl hover:bg-amber-500/20 border border-stone-800 flex flex-col items-center gap-0.5 transition-colors"
                              >
                                <span className="text-xl">{stk.icon}</span>
                                <span className="text-[9px] text-stone-300 truncate w-full text-center">{stk.name}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {selectedCommentSticker[post.id] && (
                          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                            <span className="text-lg">{selectedCommentSticker[post.id]?.icon}</span>
                            <span>Nhãn dán đã chọn: {selectedCommentSticker[post.id]?.name}</span>
                            <button onClick={() => setSelectedCommentSticker(prev => ({ ...prev, [post.id]: null }))} className="ml-auto p-1 text-stone-400 hover:text-stone-200">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowStickerPickerForPost(showStickerPickerForPost === post.id ? null : post.id)}
                            className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-amber-400 transition-colors"
                            title="Gửi nhãn dán Ba Son"
                          >
                            <Smile className="w-4 h-4" />
                          </button>
                          <input
                            type="text"
                            value={commentInput[post.id] || ''}
                            onChange={(e) => setCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            placeholder="Viết bình luận hoặc manh mối của bạn..."
                            className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:border-amber-500/50 outline-none"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 transition-all"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Gửi</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= VIEW 2: TRAVELERS DIRECTORY & SEARCH ================= */}
      {activeTab === 'travelers' && (
        <div className="space-y-5">
          {/* Search by Name, Age, Province */}
          <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={travelerSearchText}
                onChange={(e) => setTravelerSearchText(e.target.value)}
                placeholder="Tìm lữ khách theo tên, tuổi (VD: 24), danh hiệu hoặc địa danh yêu thích..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 focus:border-amber-500/50 text-xs text-stone-100 placeholder-stone-500 outline-none shadow-md"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1 text-xs">
              {/* Age Range Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
                <span className="text-[11px] text-stone-400 font-semibold uppercase shrink-0 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-amber-400" /> Độ tuổi:
                </span>
                {[
                  { id: 'all', label: 'Tất Cả' },
                  { id: 'under_20', label: 'Dưới 20t' },
                  { id: '20_30', label: '20 - 30t' },
                  { id: '31_45', label: '31 - 45t' },
                  { id: 'over_45', label: 'Trên 45t' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      sound.playClick();
                      setTravelerAgeFilter(f.id);
                    }}
                    className={`min-h-[34px] px-3 py-1 rounded-xl font-medium shrink-0 transition-all ${
                      travelerAgeFilter === f.id
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                        : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Province Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
                {[
                  { id: 'all', label: 'Tất cả miền' },
                  { id: 'Hồ Chí Minh', label: 'TP.HCM' },
                  { id: 'Bình Dương', label: 'Bình Dương' },
                  { id: 'Vũng Tàu', label: 'BR - Vũng Tàu' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      sound.playClick();
                      setTravelerProvinceFilter(p.id);
                    }}
                    className={`min-h-[34px] px-2.5 py-1 rounded-xl text-[11px] font-medium shrink-0 transition-all ${
                      travelerProvinceFilter === p.id
                        ? 'bg-stone-800 text-amber-300 border border-amber-500/50 font-bold'
                        : 'bg-stone-950 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between px-2 text-xs text-stone-400">
            <span>Tìm thấy <b>{filteredTravelers.length}</b> lữ khách phù hợp:</span>
            <span className="text-[11px] text-amber-400/80">Nhấn "Nhắn Tin" để trò chuyện trực tiếp 2 chiều</span>
          </div>

          {/* Travelers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTravelers.map(t => {
              const isFriend = t.friendStatus === 'friends';
              const isPending = t.friendStatus === 'pending';

              return (
                <div 
                  key={t.id}
                  className="p-4 sm:p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 shadow-xl transition-all space-y-3.5 group"
                >
                  {/* Traveler Profile Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img 
                          src={t.avatar} 
                          alt={t.name} 
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md group-hover:border-amber-400 transition-colors" 
                        />
                        {t.isOnline && (
                          <span 
                            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-stone-900" 
                            title="Đang trực tuyến"
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-stone-100">{t.name}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px]">
                            {t.age} tuổi
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-amber-400 font-semibold">Cấp {t.level} • {t.title}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                        {t.lpPoints} LP
                      </span>
                    </div>
                  </div>

                  {/* Bio & Heritage Preference */}
                  <p className="text-xs text-stone-300 leading-relaxed italic bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
                    "{t.bio}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <div className="flex items-center gap-1 truncate">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{t.studyHours || 18} giờ học sử</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-amber-300 font-medium">
                      <Award className="w-3.5 h-3.5" />
                      <span>{t.badgesCount} Huy Hiệu</span>
                    </div>
                  </div>

                  {/* Action Buttons: Add Friend & Message */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800 text-xs font-bold">
                    <button
                      onClick={() => handleToggleFriend(t.id)}
                      className={`min-h-[40px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all font-bold ${
                        isFriend
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : isPending
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-500/50'
                      }`}
                    >
                      {isFriend ? (
                        <>
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span>Bạn Bè</span>
                        </>
                      ) : isPending ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                          <span>Đã Gửi Lời Mời</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 text-amber-400" />
                          <span>Kết Bạn</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleStartDmWithTraveler(t)}
                      className="min-h-[40px] py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-102"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Nhắn Tin</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= VIEW 3: DIRECT MESSAGES (TWO-WAY INTERACTIVE CHAT) ================= */}
      {activeTab === 'direct_messages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl bg-stone-900 border border-amber-500/30 overflow-hidden shadow-2xl min-h-[520px]">
          
          {/* Conversation List */}
          <div className="border-b md:border-b-0 md:border-r border-stone-800 p-4 space-y-3 bg-stone-950/60">
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              <span>Hộp Thư Học Giả</span>
            </h3>

            <div className="space-y-1.5">
              {travelers.map(t => {
                const isSelected = selectedRecipient.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedRecipient({
                        id: t.id,
                        name: t.name,
                        avatar: t.avatar,
                        title: t.title
                      });
                    }}
                    className={`min-h-[54px] w-full p-2.5 rounded-2xl flex items-center gap-3 transition-all text-left ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200 font-bold shadow-md'
                        : 'hover:bg-stone-800/80 text-stone-300'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-xl object-cover" />
                      {t.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-stone-900" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold truncate">{t.name}</p>
                        <span className="text-[10px] text-amber-400 font-normal">{t.age}t</span>
                      </div>
                      <p className="text-[10px] text-stone-400 truncate">{t.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Window */}
          <div className="md:col-span-2 flex flex-col justify-between p-4 bg-stone-900 space-y-4">
            
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <img src={selectedRecipient.avatar} alt={selectedRecipient.name} className="w-10 h-10 rounded-xl object-cover border border-amber-500/30" />
                <div>
                  <h4 className="font-bold text-sm text-stone-100 flex items-center gap-1.5">
                    <span>{selectedRecipient.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Trực tuyến" />
                  </h4>
                  <p className="text-[10px] text-amber-400">{selectedRecipient.title}</p>
                </div>
              </div>

              <button
                onClick={() => onOpenAI && onOpenAI(`Tôi và học giả ${selectedRecipient.name} đang cùng khám phá di sản. Hãy gợi ý cho chúng tôi một câu hỏi mật thư văn hóa thú vị để cùng đàm đạo!`)}
                className="min-h-[36px] px-3 py-1 rounded-xl bg-stone-950 hover:bg-stone-800 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Gợi Ý Mật Thư AI</span>
              </button>
            </div>

            {/* Messages Flow */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-80 pr-1">
              {directMessages.map(msg => {
                const isMe = msg.senderId === activeUser.id;
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-xl object-cover self-end border border-stone-700" />
                    )}
                    <div className={`max-w-xs sm:max-w-md p-3 rounded-2xl space-y-1.5 ${
                      isMe 
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-medium rounded-br-none shadow-md' 
                        : 'bg-stone-950 border border-stone-800 text-stone-200 rounded-bl-none shadow-md'
                    }`}>
                      {msg.sticker && (
                        <div className={`p-2 rounded-xl flex items-center gap-2 text-xs ${isMe ? 'bg-amber-700/40 text-stone-950' : 'bg-stone-900 text-amber-300'}`}>
                          <span className="text-2xl">{msg.sticker.icon}</span>
                          <div>
                            <p className="font-bold">{msg.sticker.name}</p>
                            <p className="text-[10px] opacity-80">{msg.sticker.meaning}</p>
                          </div>
                        </div>
                      )}
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                      <span className={`text-[9px] block text-right ${isMe ? 'text-stone-900/70' : 'text-stone-500'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isRecipientTyping && (
                <div className="flex items-center gap-2 text-xs text-amber-400/90 italic animate-pulse pl-1">
                  <img src={selectedRecipient.avatar} alt={selectedRecipient.name} className="w-6 h-6 rounded-lg object-cover" />
                  <span>{selectedRecipient.name} đang soạn tin nhắn...</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {QUICK_CHAT_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendDirectMessage(sug)}
                  className="min-h-[30px] px-2.5 py-1 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-300 text-[11px] whitespace-nowrap transition-all shrink-0"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Sticker Picker Drawer */}
            {showDmStickerPicker && (
              <div className="p-3 rounded-2xl bg-stone-950 border border-amber-500/40 shadow-2xl space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>Nhãn Dán Di Sản Ba Son:</span>
                  <button onClick={() => setShowDmStickerPicker(false)} className="text-stone-400 hover:text-stone-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {HERITAGE_STICKERS.map(stk => (
                    <button
                      key={stk.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setDmSelectedSticker(stk);
                        setShowDmStickerPicker(false);
                      }}
                      className="p-2 rounded-xl bg-stone-900 hover:bg-amber-500/20 border border-stone-800 hover:border-amber-500/40 flex flex-col items-center gap-1 transition-all"
                      title={stk.meaning}
                    >
                      <span className="text-2xl">{stk.icon}</span>
                      <span className="text-[10px] text-stone-300 truncate w-full text-center">{stk.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Sticker Pill */}
            {dmSelectedSticker && (
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                <span className="text-lg">{dmSelectedSticker.icon}</span>
                <span>Nhãn dán đã chọn: {dmSelectedSticker.name}</span>
                <button onClick={() => setDmSelectedSticker(null)} className="ml-auto p-1 text-stone-400 hover:text-stone-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Message Input Box */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDmStickerPicker(!showDmStickerPicker)}
                className="min-h-[44px] min-w-[44px] rounded-2xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-amber-400 transition-colors flex items-center justify-center"
                title="Mở bảng nhãn dán"
              >
                <Smile className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={dmInputText}
                onChange={(e) => setDmInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendDirectMessage()}
                placeholder={`Nhắn tin cho ${selectedRecipient.name}...`}
                className="flex-1 bg-stone-950 border border-stone-800 rounded-2xl px-4 py-2.5 text-xs text-stone-100 focus:border-amber-500/50 outline-none shadow-md"
              />

              <button
                onClick={() => handleSendDirectMessage()}
                disabled={!dmInputText.trim() && !dmSelectedSticker}
                className="min-h-[44px] px-5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Gửi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📝 NEW POST MODAL */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-stone-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl text-stone-100 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-['Cinzel',serif] font-bold text-lg text-amber-200 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Đăng Bài Chia Sẻ Di Sản
              </h3>
              <button onClick={() => setIsNewPostModalOpen(false)} className="text-stone-400 hover:text-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">Tiêu đề bài viết:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Bí kíp giải mật thư vòm trần Bưu Điện..."
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500/50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">Chuyên mục:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 outline-none"
                  >
                    <option value="hints">Bí Kíp Mật Thư</option>
                    <option value="history">Sử Liệu Cố Vấn</option>
                    <option value="cuisine">Ẩm Thực Đô Thành</option>
                    <option value="showcase">Vinh Danh & Khoe Quà</option>
                    <option value="general">Thảo Luận Chung</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">Gắn thẻ địa danh:</label>
                  <input
                    type="text"
                    value={newLocationTag}
                    onChange={(e) => setNewLocationTag(e.target.value)}
                    placeholder="VD: Bến Thành, Ba Son..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">Nội dung chi tiết:</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Chia sẻ phát hiện thú vị, câu đố hoặc cảm nhận của bạn về chuyến thám hiểm..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500/50 outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  Đăng Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
