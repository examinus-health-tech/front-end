import { Children, ReactNode } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
  children: ReactNode;
  startDelay?: number;
  stepDelay?: number;
  duration?: number;
  /**
   * Índice(s) (0-based) do(s) filho(s) que deve(m) ter `flex: 1`. Útil quando
   * um ou mais filhos precisam expandir no VStack pai (ex: Box do slider,
   * HStacks com cards).
   */
  flexChildIndex?: number | number[];
  /**
   * Espaçamento entre filhos, em unidades native-base (1 unidade = 4px).
   * Equivale ao `space={N}` do VStack — necessário porque o VStack pai não
   * enxerga os filhos através do Fragment do StaggeredStep.
   */
  space?: number;
}

/**
 * Wrap pra fazer stagger reveal: cada filho recebe FadeInDown com delay
 * incremental. Use dentro de um VStack/HStack do onboarding.
 *
 * Quando algum filho precisar `flex: 1` (ex: container do slider que
 * deve preencher o espaço), passe `flexChildIndex={N}`.
 */
export function StaggeredStep({
  children,
  startDelay = 0,
  stepDelay = 80,
  duration = 400,
  flexChildIndex,
  space,
}: Props) {
  const flexSet =
    flexChildIndex === undefined
      ? null
      : Array.isArray(flexChildIndex)
        ? new Set(flexChildIndex)
        : new Set([flexChildIndex]);

  const gapPx = space !== undefined ? space * 4 : 0;

  return (
    <>
      {Children.map(children, (child, index) => {
        if (child === null || child === undefined || child === false) return null;
        const isFlex = flexSet?.has(index) ?? false;
        const style: Record<string, number> = {};
        if (isFlex) style.flex = 1;
        if (gapPx > 0 && index > 0) style.marginTop = gapPx;
        return (
          <Animated.View
            key={index}
            entering={FadeInDown.duration(duration).delay(startDelay + index * stepDelay)}
            style={Object.keys(style).length ? style : undefined}
          >
            {child}
          </Animated.View>
        );
      })}
    </>
  );
}
