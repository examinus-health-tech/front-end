import React, { useEffect, useRef, useState } from 'react';
import { View, Animated as RNAnimated, Easing } from 'react-native';
import Svg, { Path, Circle, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';

interface ScoreGaugeProps {
  score: number; // 0-1000
  size?: number;
  delay?: number;
}

// Cor suave interpolada (degradê entre regiões)
function getColorForPct(pct: number): string {
  const score = pct * 1000;
  if (score <= 200) return '#FA4D5E';
  if (score <= 333) {
    // Transição vermelho → laranja
    const t = (score - 200) / 133;
    return lerpColor('#FA4D5E', '#F59E0B', t);
  }
  if (score <= 500) return '#F59E0B';
  if (score <= 666) {
    // Transição amarelo → verde
    const t = (score - 500) / 166;
    return lerpColor('#F59E0B', '#0CC1AF', t);
  }
  return '#0CC1AF';
}

function lerpColor(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16), ag = parseInt(a.slice(3, 5), 16), ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16), bg = parseInt(b.slice(3, 5), 16), bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

export function ScoreGauge({ score, size = 180, delay = 400 }: ScoreGaugeProps) {
  const width = size;
  const height = size * 0.55;
  const centerX = width / 2;
  const centerY = height - 4;
  const radius = width * 0.36;
  const strokeWidth = width * 0.075;

  const clampedScore = Math.min(Math.max(score, 0), 1000);
  const fillPct = clampedScore / 1000;

  const animValue = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    animValue.setValue(0);
    const timer = setTimeout(() => {
      RNAnimated.timing(animValue, {
        toValue: fillPct,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [fillPct]);

  const zones = [
    { start: 180, end: 120, color: '#FA4D5E', opacity: 0.12 },
    { start: 120, end: 60, color: '#F59E0B', opacity: 0.12 },
    { start: 60, end: 0, color: '#0CC1AF', opacity: 0.12 },
  ];

  return (
    <View style={{ width, height: height + 4, alignItems: 'center' }}>
      <AnimatedGauge
        animValue={animValue}
        width={width}
        height={height + 4}
        centerX={centerX}
        centerY={centerY}
        radius={radius}
        strokeWidth={strokeWidth}
        zones={zones}
      />
    </View>
  );
}

function AnimatedGauge({ animValue, width, height, centerX, centerY, radius, strokeWidth, zones }: any) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const id = animValue.addListener(({ value }: { value: number }) => {
      setPct(value);
    });
    return () => animValue.removeListener(id);
  }, [animValue]);

  // Cor degradê suave
  const currentColor = getColorForPct(pct);

  const fillAngleDeg = 180 - pct * 180;
  const fillRad = fillAngleDeg * (Math.PI / 180);

  // Bolinha indicadora
  const dotX = centerX + radius * Math.cos(fillRad);
  const dotY = centerY - radius * Math.sin(fillRad);

  // Ponteiro triangular
  const needleLen = radius * 0.68;
  const needleTipX = centerX + needleLen * Math.cos(fillRad);
  const needleTipY = centerY - needleLen * Math.sin(fillRad);
  const baseW = 4.5;
  const perpRad = fillRad + Math.PI / 2;
  const baseX1 = centerX + baseW * Math.cos(perpRad);
  const baseY1 = centerY - baseW * Math.sin(perpRad);
  const baseX2 = centerX - baseW * Math.cos(perpRad);
  const baseY2 = centerY + baseW * Math.sin(perpRad);

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  }

  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
  }

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Regiões coloridas de fundo */}
      {zones.map((zone: any, i: number) => (
        <Path
          key={`zone-${i}`}
          d={describeArc(centerX, centerY, radius, zone.start, zone.end)}
          stroke={zone.color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap={i === 0 || i === 2 ? 'round' : 'butt'}
          opacity={zone.opacity}
        />
      ))}

      {/* Progresso — cor degradê suave */}
      {pct > 0.01 && (
        <Path
          d={describeArc(centerX, centerY, radius, 180, fillAngleDeg)}
          stroke={currentColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* Bolinha indicadora */}
      {pct > 0.01 && (
        <>
          <Circle cx={dotX} cy={dotY} r={strokeWidth / 2 + 3} fill="white" />
          <Circle cx={dotX} cy={dotY} r={strokeWidth / 2} fill={currentColor} />
        </>
      )}

      {/* Ponteiro triangular */}
      <Polygon
        points={`${needleTipX},${needleTipY} ${baseX1},${baseY1} ${baseX2},${baseY2}`}
        fill="#9CA3AF"
      />
      <Circle cx={centerX} cy={centerY} r={5.5} fill="#9CA3AF" />
      <Circle cx={centerX} cy={centerY} r={2.5} fill="white" />
    </Svg>
  );
}
