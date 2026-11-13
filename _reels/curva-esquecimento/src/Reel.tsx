import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { BgMesh, Grade, Grain, Vignette } from "./components/fx";
import { Captions } from "./components/Captions";
import { Calendar, Closing, Doc, Ebbinghaus, Graph, Hook, Motif, Progress, Whats } from "./scenes";

// 5 camadas: fundo vivo + motivo → arte em traço → legenda → grade de cor → grão + vinheta
export const Reel: React.FC<{ legenda: boolean; audio: boolean }> = ({ legenda, audio }) => (
  <AbsoluteFill style={{ background: "#08352A" }}>
    <BgMesh base="#08352A" a="#0E4B3C" />
    <Motif />
    <Hook /><Graph /><Ebbinghaus /><Calendar /><Doc /><Whats /><Closing />
    <Progress />
    {legenda && <Captions />}
    <Grade /><Grain /><Vignette />
    {audio && <Audio src={staticFile("audio/trilha.wav")} />}
  </AbsoluteFill>
);

export const Capa: React.FC = () => (
  <AbsoluteFill style={{ background: "#08352A" }}>
    <BgMesh base="#08352A" a="#0E4B3C" />
    <Motif /><Hook />
    <div style={{ position: "absolute", left: 108, right: 108, top: 1170, textAlign: "center", fontFamily: "Montserrat", fontWeight: 800,
      fontSize: 84, lineHeight: 1.05, letterSpacing: "-0.02em", color: "#F6F1E3", textShadow: "0 6px 24px rgba(0,0,0,0.5)" }}>
      SEU ALUNO ESQUECE MAIS DA <span style={{ color: "#E36B1F" }}>METADE</span> DA AULA
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1490, textAlign: "center", fontFamily: "JetBrains Mono", fontWeight: 700,
      fontSize: 28, letterSpacing: "0.2em", color: "#EFDCA9" }}>CURVA DO ESQUECIMENTO</div>
    <Grade /><Grain /><Vignette />
  </AbsoluteFill>
);
