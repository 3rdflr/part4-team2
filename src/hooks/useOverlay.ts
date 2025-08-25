import { useContext, useRef, useMemo } from 'react';
import { OverlayContext } from '../components/common/OverlayProvider';

export type OverlayElement = (props: { isOpen: boolean; close: () => void }) => JSX.Element;

let elementId = 1;

export function useOverlay() {
  const context = useContext(OverlayContext);

  if (!context) throw new Error('useOverlay는 OverlayProvider 안에서만 사용 가능합니다.');

  const { mount, unmount } = context;

  const overlayRefs = useRef<Record<string, { close: () => void }>>({});

  return useMemo(() => {
    const open = (overlayElement: OverlayElement): Promise<void> => {
      const id = (elementId++).toString();
      return new Promise((resolve) => {
        const close = () => {
          unmount(id);
          delete overlayRefs.current[id];
          resolve();
        };

        overlayRefs.current[id] = { close };

        mount(
          id,
          overlayElement({
            isOpen: true,
            close,
          }),
        );
      });
    };

    const close = (targetId?: string) => {
      const key = targetId || Object.keys(overlayRefs.current)[0];
      overlayRefs.current[key]?.close?.();
    };

    return { open, close };
  }, [mount, unmount]);
}
