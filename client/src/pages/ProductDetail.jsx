import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X, Play, Pause, Mic } from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [voiceLang, setVoiceLang] = useState("en-IN");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const wasSpeakingBeforeHide = useRef(false);
  const synthRef = useRef(null);
  const utterRef = useRef(null);

  const API_BASE = "https://backend-9lc5.onrender.com/api/ver1/product";

  // Fetch product from deployed backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/id/${id}`);
        const data = await res.json();
        const mergedMedia = [...(data.data.images || []), ...(data.data.videos || [])];
        setProduct({ ...data.data, mergedMedia });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const media = product?.mergedMedia || [];

  // Auto-carousel for media
  useEffect(() => {
    if (!media.length || isHovered || isVideoPlaying) return;
    const t = setInterval(() => setCurrentIndex((p) => (p + 1) % media.length), 3500);
    return () => clearInterval(t);
  }, [media, isHovered, isVideoPlaying]);

  // Handle video play/pause on carousel change
  useEffect(() => {
    const cur = media[currentIndex];
    if (!cur) return;
    if (cur.endsWith(".mp4")) {
      const v = videoRef.current;
      if (v) setTimeout(() => v.play().catch(() => {}), 250);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsVideoPlaying(false);
    }
  }, [currentIndex, media]);

  // Voice synthesis setup
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const synth = synthRef.current;
    const ensureVoices = () => {};
    window.addEventListener("voiceschanged", ensureVoices);
    return () => window.removeEventListener("voiceschanged", ensureVoices);
  }, []);

  const togglePlayPause = () => {
    if (!product?.description) return;
    const synth = synthRef.current;

    if (!isSpeaking && !isPaused) {
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(product.description);
      utter.lang = voiceLang;

      const voices = synth.getVoices() || [];
      const female = voices.find((v) => v.lang === voiceLang && /female/i.test(v.name)) ||
        voices.find((v) => v.lang === voiceLang) ||
        voices.find((v) => /female/i.test(v.name)) || voices[0];

      if (female) utter.voice = female;

      utter.onstart = () => { setIsSpeaking(true); setIsPaused(false); wasSpeakingBeforeHide.current = true; };
      utter.onend = () => { setIsSpeaking(false); setIsPaused(false); utterRef.current = null; wasSpeakingBeforeHide.current = false; };
      utter.onpause = () => setIsPaused(true);
      utter.onresume = () => setIsPaused(false);

      utterRef.current = utter;
      synth.speak(utter);
      return;
    }

    if (isSpeaking && !isPaused) { synth.pause(); setIsPaused(true); return; }
    if (isSpeaking && isPaused) { synth.resume(); setIsPaused(false); return; }
  };

  const stopSpeech = () => {
    const synth = synthRef.current;
    if (synth) synth.cancel();
    setIsSpeaking(false); setIsPaused(false); utterRef.current = null; wasSpeakingBeforeHide.current = false;
  };

  useEffect(() => {
    const onVisibility = () => {
      const synth = synthRef.current;
      if (document.visibilityState === "hidden") {
        if (synth?.speaking && !synth.paused) wasSpeakingBeforeHide.current = true;
      } else {
        if (wasSpeakingBeforeHide.current && synth?.paused) {
          try { synth.resume(); setIsPaused(false); setIsSpeaking(true); } catch {}
        }
        wasSpeakingBeforeHide.current = false;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => stopSpeech, []);

  if (loading) return <Loader />;
  if (!product) return <p className="text-center mt-10 text-gray-600">Product not found.</p>;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-3 md:px-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => { stopSpeech(); navigate(-1); }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto hide-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
            <button onClick={() => setShowVoicePanel((s) => { if (s) stopSpeech(); return !s; })}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
              <Mic size={18} className="text-gray-700"/>
            </button>
            <button onClick={() => { stopSpeech(); navigate(-1); }}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
              <X size={18} className="text-gray-700"/>
            </button>
          </div>

          {/* Voice Panel */}
          <AnimatePresence>
            {showVoicePanel && (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed top-5 left-1/2 -translate-x-1/2 bg-white p-3 rounded-xl shadow-lg z-[999] flex items-center gap-3"
              >
                <select value={voiceLang} onChange={(e) => setVoiceLang(e.target.value)}
                  className="text-sm px-2 py-1 border rounded">
                  <option value="en-IN">Male</option>
                  <option value="hi-IN">Female</option>
                </select>
                <button onClick={togglePlayPause} className="bg-blue-600 p-2 rounded-full text-white shadow hover:bg-blue-700">
                  {isSpeaking && !isPaused ? <Pause size={16}/> : <Play size={16}/>}
                </button>
                <div className="flex items-end gap-1 w-28 h-6" aria-hidden>
                  {Array.from({length:6}).map((_, i) => (
                    <span key={i} className="block bg-blue-400 rounded-sm transition-all origin-bottom"
                      style={{
                        width: 4,
                        height: isSpeaking && !isPaused ? `${8 + (i%4)*6}px` : "6px",
                        animation: isSpeaking && !isPaused ? `wave 900ms ${i*80}ms infinite ease-in-out` : "none"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Media Carousel */}
          <div
            className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] bg-gray-100 flex justify-center items-center overflow-hidden rounded-t-2xl"
            onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
          >
            {media.length ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity:0, scale:0.97 }}
                    animate={{ opacity:1, scale:1 }}
                    exit={{ opacity:0 }}
                    transition={{ duration:0.35 }}
                    className="absolute inset-0 flex justify-center items-center"
                  >
                    {media[currentIndex].endsWith(".mp4") ? (
                      <video
                        ref={videoRef} src={media[currentIndex]} muted autoPlay loop playsInline controls
                        className="w-full h-full object-cover rounded-t-2xl"
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                      />
                    ) : (
                      <img src={media[currentIndex]} alt={product.title} className="w-full h-full object-contain"/>
                    )}
                  </motion.div>
                </AnimatePresence>

                {media.length>1 && (
                  <>
                    <button onClick={() => setCurrentIndex(p=>p===0?media.length-1:p-1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white"><ChevronLeft size={20}/></button>
                    <button onClick={() => setCurrentIndex(p=>(p+1)%media.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white"><ChevronRight size={20}/></button>
                  </>
                )}
              </>
            ) : <p className="text-gray-500">No media found.</p>}
          </div>

          {/* Product Info */}
          <div className="p-6 sm:p-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.title}</h1>
            <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full font-mono">ID: {product.productId}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">{product.category?.name}</span>
            </div>
            <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed mt-4 text-sm sm:text-base">{product.description}</p>
            {product.link && (
              <a href={product.link} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg mt-4 hover:bg-blue-700 transition">
                <ExternalLink size={16}/> View Product
              </a>
            )}
          </div>

          <style>{`
            @keyframes wave {
              0% { transform: scaleY(0.4); opacity:0.6; }
              50% { transform: scaleY(1); opacity:1; }
              100% { transform: scaleY(0.4); opacity:0.6; }
            }
            .hide-scrollbar::-webkit-scrollbar { display:none; }
            .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProductDetail;
