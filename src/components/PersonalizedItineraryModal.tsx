import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Navigation,
  Sparkles,
  Compass,
  Calendar,
  Layers,
  ChevronRight,
  Camera,
  Utensils,
  Award,
  Share2,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  Bus,
  Bike,
  Ship,
  Footprints,
  UserCheck,
  Bot,
  Volume2
} from 'lucide-react';
import { Location3D, PersonalizedItinerary, ItineraryStop, ItineraryThemeType, AITourGuideId } from '../types';
import { 
  generatePersonalizedItinerary, 
  ItineraryGenerationOptions,
  saveActiveItinerary,
  getSavedItinerary
} from '../utils/itineraryEngine';
import { AI_TOUR_GUIDES, getAITourGuide } from '../data/aiTourGuides';
import { sound } from '../utils/audio';

interface PersonalizedItineraryModalProps {
  locations: Location3D[];
  isOpen: boolean;
  onClose: () => void;
  onSelectAndTeleport?: (loc: Location3D) => void;
  onActivateItineraryOnMap: (itinerary: PersonalizedItinerary) => void;
  onShareToForum?: (title: string, content: string, locationTag: string) => void;
  currentActiveItinerary?: PersonalizedItinerary | null;
}

export const PersonalizedItineraryModal: React.FC<PersonalizedItineraryModalProps> = ({
  locations,
  isOpen,
  onClose,
  onSelectAndTeleport,
  onActivateItineraryOnMap,
  onShareToForum,
  currentActiveItinerary
}) => {
  const [options, setOptions] = useState<ItineraryGenerationOptions>({
    theme: 'architecture_classic',
    durationMode: 'half_day',
    transportMode: 'walk',
    startPoint: 'Bến Bạch Đằng & Cột cờ Thủ Ngữ',
    pace: 'balanced',
    tourGuideId: 'co_ba_sai_gon'
  });

  const [generatedItinerary, setGeneratedItinerary] = useState<PersonalizedItinerary | null>(() => {
    return currentActiveItinerary || getSavedItinerary() || generatePersonalizedItinerary({
      theme: 'architecture_classic',
      durationMode: 'half_day',
      transportMode: 'walk',
      startPoint: 'Bến Bạch Đằng & Cột cờ Thủ Ngữ',
      pace: 'balanced',
      tourGuideId: 'co_ba_sai_gon'
    });
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedStopIdx, setSelectedStopIdx] = useState<number>(0);

  if (!isOpen) return null;

  const handleGenerate = () => {
    sound.playClick();
    setIsGenerating(true);
    setTimeout(() => {
      const it = generatePersonalizedItinerary(options);
      setGeneratedItinerary(it);
      setSelectedStopIdx(0);
      setIsGenerating(false);
      sound.playSuccess();
    }, 450);
  };

  const handleActivate = () => {
    if (!generatedItinerary) return;
    sound.playSuccess();
    saveActiveItinerary(generatedItinerary);
    onActivateItineraryOnMap(generatedItinerary);
    onClose();
  };

  const handleToggleStopVisited = (idx: number) => {
    sound.playClick();
    if (!generatedItinerary) return;
    const updatedStops = [...generatedItinerary.stops];
    updatedStops[idx].isVisited = !updatedStops[idx].isVisited;
    const updated = { ...generatedItinerary, stops: updatedStops };
    setGeneratedItinerary(updated);
    saveActiveItinerary(updated);
  };

  const currentStop = generatedItinerary?.stops[selectedStopIdx];
  const matchedLocation = currentStop ? locations.find(l => l.id === currentStop.locationId) : null;
  const currentGuide = getAITourGuide(options.tourGuideId);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-6xl bg-stone-900 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl text-stone-100 relative max-h-[94vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-stone-950 text-stone-400 hover:text-stone-100 hover:bg-red-950/40 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-500/20 pb-3 gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 shadow-lg">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Cinzel',serif] text-lg sm:text-2xl font-bold text-amber-200">
                  Lộ Trình AI & Hướng Dẫn Viên Dẫn Tour Theo Chủ Đề
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                  AI Tour Guide
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Chọn phong cách du lịch & người đồng hành AI ảo để được dẫn dắt, thuyết minh và trải nghiệm di sản Nam Bộ
              </p>
            </div>
          </div>
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-3 flex-1 overflow-y-auto pr-1">
          
          {/* Left Column: Preferences, Guide Selection & Form (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3.5 p-4 rounded-2xl bg-stone-950 border border-amber-500/30">
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Thiết Lập Phong Cách & Hướng Dẫn Viên AI
            </h3>

            {/* 1. Chọn Hướng Dẫn Viên Du Lịch AI */}
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-amber-400" /> 1. Chọn Hướng Dẫn Viên Du Lịch AI Ảo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AI_TOUR_GUIDES.map(g => (
                  <button
                    key={g.id}
                    onClick={() => {
                      sound.playClick();
                      setOptions(o => ({ ...o, tourGuideId: g.id }));
                    }}
                    className={`p-2 rounded-xl border text-left flex items-start gap-2 transition-all ${
                      options.tourGuideId === g.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/50 shadow-md'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <img src={g.avatar} alt={g.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-amber-500/50 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-stone-200 truncate">{g.name}</p>
                      <p className="text-[9px] text-amber-300/90 truncate">{g.badge}</p>
                      <p className="text-[9px] text-stone-400 line-clamp-1">{g.tagline}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Chủ Đề / Sở Thích Di Sản */}
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">2. Chủ Đề & Phong Cách Du Lịch</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {[
                  { id: 'architecture_classic', label: '🏛️ Kiến Trúc & Di Sản Đông Dương', desc: 'Dinh Độc Lập, Bưu Điện, Đường Sách...' },
                  { id: 'river_ports_300', label: '🛶 Ký Ức Sông Nước & Bến Cảng 300 Năm', desc: 'Thủ Ngữ, Bến Nhà Rồng, Xưởng Ba Son...' },
                  { id: 'cuisine_flavors', label: '🍲 Ẩm Thực Đô Thành & Cà Phê Vợt Chợ Xưa', desc: 'Chợ Bến Thành, Chợ Thủ Dầu Một, Chè ba màu...' },
                  { id: 'pottery_spiritual', label: '🏺 Làng Nghề Gốm Sứ & Danh Lam Tâm Linh', desc: 'Lò gốm Lái Thiêu, Chùa Hội Khánh...' },
                  { id: 'coastal_heroes', label: '🌊 Hải Trình Biển Đảo & Di Tích Lịch Sử', desc: 'Hải Đăng Vũng Tàu, Bạch Dinh, Côn Đảo...' },
                  { id: 'heroic_tunnels', label: '🎖️ Huyền Thoại Đất Thép & Rừng Sác', desc: 'Địa đạo Củ Chi, Chiến khu Rừng Sác...' },
                  { id: 'urban_sketch_vintage', label: '🎨 Ký Họa Nghệ Thuật & Nhiếp Ảnh Hoài Cổ', desc: 'Săn ảnh vintage, ban công cổ & góc phố thơ mộng...' },
                  { id: 'cipher_adventure', label: '🧩 Thám Hiểm Mật Thư & Giải Mã Di Sản', desc: 'Bóc tách mật mã cổ và vượt thử thách trí tuệ...' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      sound.playClick();
                      setOptions(o => ({ ...o, theme: t.id as any }));
                    }}
                    className={`w-full p-2 rounded-xl border text-left transition-all ${
                      options.theme === t.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <p className="text-xs font-bold text-stone-200">{t.label}</p>
                    <p className="text-[10px] text-stone-400 truncate">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Thời Lượng Khám Phá */}
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">3. Thời Lượng Dự Kiến</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'half_day', label: '⚡ Nửa Ngày', sub: '3-4 Giờ' },
                  { id: 'full_day', label: '☀️ 1 Ngày', sub: '7-8 Giờ' },
                  { id: 'two_days', label: '🌅 2N1Đ', sub: 'Liên Tỉnh' }
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => {
                      sound.playClick();
                      setOptions(o => ({ ...o, durationMode: d.id as any }));
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      options.durationMode === d.id
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-amber-500/40'
                    }`}
                  >
                    <span className="text-xs block font-bold">{d.label}</span>
                    <span className="text-[10px] opacity-80 block">{d.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Phương Tiện Di Chuyển */}
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">4. Phương Tiện Ưa Thích</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {[
                  { id: 'walk', label: 'Đi bộ', icon: '🚶' },
                  { id: 'cyclo', label: 'Xích lô', icon: '🚲' },
                  { id: 'waterbus', label: 'Waterbus', icon: '🛥️' },
                  { id: 'hop_on_bus', label: 'Hop-On', icon: '🚌' },
                  { id: 'motorbike', label: 'Xe máy', icon: '🛵' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      sound.playClick();
                      setOptions(o => ({ ...o, transportMode: m.id as any }));
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      options.transportMode === m.id
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-amber-500/40'
                    }`}
                  >
                    <span className="text-base block">{m.icon}</span>
                    <span className="text-[10px] font-bold block truncate">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>AI Đang Tối Ưu Lộ Trình & Lời Thuyết Minh...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Khởi Tạo Lộ Trình & HDV Dẫn Tour Ngay</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Generated Itinerary Timeline & Details (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            {generatedItinerary ? (
              <>
                {/* Route Header Overview Card with Guide Info */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-stone-900 to-stone-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={generatedItinerary.tourGuide?.avatar || currentGuide.avatar} 
                      alt="HDV" 
                      className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-['Cinzel',serif] text-base font-bold text-amber-200">
                          {generatedItinerary.title}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-300 mt-0.5">
                        HDV Đồng Hành: <strong className="text-amber-300">{generatedItinerary.tourGuide?.name || currentGuide.name}</strong> ({generatedItinerary.tourGuide?.title || currentGuide.title})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <div className="px-3 py-1 rounded-xl bg-stone-950 border border-stone-800 text-right">
                      <span className="text-[10px] text-stone-400 block uppercase">Quãng Đường</span>
                      <span className="text-xs font-mono font-bold text-amber-400">{generatedItinerary.totalDistanceKm} km</span>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-stone-950 border border-stone-800 text-right">
                      <span className="text-[10px] text-stone-400 block uppercase">Điểm Thưởng</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">+{generatedItinerary.totalLPBonus} LP</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Stops Horizontal/Vertical Grid */}
                <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                      Danh Sách {generatedItinerary.stops.length} Trạm Dừng Chân Được HDV Dẫn Dắt
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Bấm vào từng trạm để xem lời thuyết minh & mẹo di sản
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {generatedItinerary.stops.map((stop, idx) => {
                      const isSelected = selectedStopIdx === idx;
                      const targetLoc = locations.find(l => l.id === stop.locationId);

                      return (
                        <div
                          key={stop.locationId + idx}
                          onClick={() => {
                            sound.playClick();
                            setSelectedStopIdx(idx);
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-950/30 border-amber-400 shadow-lg ring-1 ring-amber-400'
                              : 'bg-stone-950 border-stone-800 hover:border-amber-500/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 text-xs font-black flex items-center justify-center shrink-0 shadow">
                                {stop.order}
                              </span>
                              <div>
                                <h5 className="font-bold text-xs text-stone-100">{stop.locationName}</h5>
                                <div className="flex items-center gap-2 text-[10px] text-stone-400">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-400" /> {stop.timeSlot}
                                  </span>
                                  <span>•</span>
                                  <span>{stop.province || 'Phương Nam'}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStopVisited(idx);
                              }}
                              className={`p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                                stop.isVisited
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : 'bg-stone-900 text-stone-500 border-stone-800 hover:text-stone-300'
                              }`}
                              title={stop.isVisited ? 'Đã check-in trạm này' : 'Đánh dấu đã check-in'}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="text-[10px] hidden sm:inline">
                                {stop.isVisited ? 'Đã Đến' : 'Chưa Đến'}
                              </span>
                            </button>
                          </div>

                          {/* Expanded Details when selected */}
                          {isSelected && (
                            <div className="mt-2.5 pt-2.5 border-t border-stone-800 text-xs space-y-2 animate-fadeIn">
                              
                              {/* Guide Voice Narration Preview */}
                              {stop.guideVoiceNarration && (
                                <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/95 space-y-1">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                                    <span className="flex items-center gap-1">
                                      <Bot className="w-3.5 h-3.5" /> Lời Thuyết Minh Của HDV AI:
                                    </span>
                                  </div>
                                  <p className="text-[11px] italic leading-relaxed text-stone-300">
                                    "{stop.guideVoiceNarration}"
                                  </p>
                                </div>
                              )}

                              <p className="text-stone-300 leading-relaxed">
                                {stop.activityHighlight}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                <div className="p-2 rounded-xl bg-stone-900 border border-stone-800/80 flex items-start gap-1.5">
                                  <Camera className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="text-amber-300">Khung Giờ Chụp Ảnh:</strong>
                                    <p className="text-stone-300">{stop.goldenPhotoHour}</p>
                                  </div>
                                </div>

                                <div className="p-2 rounded-xl bg-stone-900 border border-stone-800/80 flex items-start gap-1.5">
                                  <Utensils className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="text-amber-300">Món Ngon Lân Cận:</strong>
                                    <p className="text-stone-300">{stop.mustTryCuisine}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="p-2 rounded-xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-start gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                  <strong>Mẹo Di Sản AI: </strong>{stop.aiLocalTip}
                                </div>
                              </div>

                              {/* Teleport / Actions */}
                              {targetLoc && onSelectAndTeleport && (
                                <div className="flex items-center justify-end gap-2 pt-1">
                                  <button
                                    onClick={() => {
                                      sound.playSuccess();
                                      onSelectAndTeleport(targetLoc);
                                      onClose();
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                                  >
                                    <Navigation className="w-3 h-3" />
                                    <span>Xem Trên Bản Đồ 3D</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-3">
                <Compass className="w-12 h-12 text-stone-600 animate-spin-slow" />
                <h4 className="font-bold text-stone-300 text-sm">Chưa Có Lộ Trình Nào Được Tạo</h4>
                <p className="text-xs text-stone-500 max-w-sm">
                  Hãy chọn chủ đề và bấm nút "Khởi Tạo Lộ Trình & HDV Dẫn Tour Ngay" để AI thiết kế chuyến du hành hoàn hảo cho bạn.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-amber-500/20 shrink-0">
          <button
            onClick={() => {
              if (onShareToForum && generatedItinerary) {
                onShareToForum(
                  `Lộ trình khám phá cùng HDV AI: ${generatedItinerary.title}`,
                  `Mình vừa cùng HDV ${generatedItinerary.tourGuide?.name || 'Cố Vấn Ba Son'} tạo lộ trình di sản cá nhân hóa "${generatedItinerary.title}" với ${generatedItinerary.stops.length} trạm dừng chân độc đáo (${generatedItinerary.stops.map(s => s.locationName).join(' ➔ ')}). Lộ trình dài ${generatedItinerary.totalDistanceKm} km, rất phù hợp cho những ai yêu thích văn hóa Nam Bộ!`,
                  generatedItinerary.stops[0]?.locationName || 'Sài Gòn'
                );
                onClose();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-amber-200 border border-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chia Sẻ Lên Diễn Đàn</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-semibold transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleActivate}
              disabled={!generatedItinerary}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 text-xs font-black shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
            >
              <Navigation className="w-4 h-4 fill-stone-950" />
              <span>Bật HDV AI Dẫn Tour Trên Bản Đồ 3D</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
