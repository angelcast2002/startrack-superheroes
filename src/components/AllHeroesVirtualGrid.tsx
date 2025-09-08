/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

export type VirtualGridHandle = {
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end') => void;
};

type Props<T> = {
  items: T[];
  maxHeightPx: number;          
  renderItem: (item: T, index: number) => React.ReactNode;
  cardW?: number;
  cardH?: number;
  gap?: number;
  overscanRows?: number;
  autoShrink?: boolean;
  className?: string;
};

function VirtualGridInner<T>(
  {
    items,
    maxHeightPx,
    renderItem,
    cardW = 285,
    cardH = 174,
    gap = 16,
    overscanRows = 2,
    autoShrink = true,
    className = '',
  }: Props<T>,
  ref: React.Ref<VirtualGridHandle>
) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const { colCount, rowHeight, totalRows, sidePad, totalHeight } = useMemo(() => {
    const colW = cardW + gap;
    const cols = Math.max(1, Math.floor((width + gap) / colW));
    const contentW = cols * cardW + (cols - 1) * gap;
    const pad = Math.max(0, (width - contentW) / 2);
    const rH = cardH + gap;
    const rows = Math.ceil(items.length / cols);
    return {
      colCount: cols,
      rowHeight: rH,
      totalRows: rows,
      sidePad: pad,
      totalHeight: rows * rH,
    };
  }, [width, items.length, cardW, cardH, gap]);

  const heightPx = autoShrink ? Math.min(maxHeightPx, totalHeight || cardH + gap) : maxHeightPx;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscanRows);
  const endRow   = Math.min(totalRows, Math.ceil((scrollTop + heightPx) / rowHeight) + overscanRows);
  const startIdx = startRow * colCount;
  const endIdx   = Math.min(items.length, endRow * colCount);

  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number, align: 'start' | 'center' | 'end' = 'center') => {
      if (!viewportRef.current) return;
      const row = Math.floor(index / colCount);
      const targetTop = row * rowHeight;
      let offset = targetTop;
      if (align === 'center') offset = Math.max(0, targetTop - heightPx / 2 + rowHeight / 2);
      if (align === 'end')    offset = Math.max(0, targetTop - heightPx + rowHeight);
      viewportRef.current.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }), [colCount, rowHeight, heightPx]);

  return (
    <div
      ref={viewportRef}
      className={`no-scrollbar w-full overflow-auto rounded-2xl ${className}`}
      style={{ height: heightPx }}
    >
      <div style={{ position: 'relative', height: totalHeight }}>
        {items.slice(startIdx, endIdx).map((item, i) => {
          const index = startIdx + i;
          const row = Math.floor(index / colCount);
          const col = index % colCount;
          const top  = row * rowHeight;
          const left = sidePad + col * (cardW + gap);

          return (
            <div
              key={(item as any)?.id ?? index}
              style={{
                position: 'absolute',
                top,
                left,
                width: cardW,
                height: rowHeight,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const VirtualGrid = React.forwardRef(VirtualGridInner) as <T>(
  p: Props<T> & { ref?: React.Ref<VirtualGridHandle> }
) => ReturnType<typeof VirtualGridInner>;

export default VirtualGrid;
