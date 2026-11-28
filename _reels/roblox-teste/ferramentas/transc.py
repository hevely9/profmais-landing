import sys, json
from faster_whisper import WhisperModel
m = WhisperModel(sys.argv[2], device="cpu", compute_type="int8")
segs, _ = m.transcribe(sys.argv[1], language="pt", word_timestamps=True, vad_filter=False, beam_size=5)
out = []
for s in segs:
    print(f"[{s.start:.2f}-{s.end:.2f}] {s.text}", flush=True)
    for w in s.words: out.append({"text": w.word.strip(), "start": round(w.start,3), "end": round(w.end,3), "p": round(w.probability,2)})
json.dump({"words": out}, open(sys.argv[3], "w"), ensure_ascii=False, indent=0)
