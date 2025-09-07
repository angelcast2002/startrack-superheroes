import { useEffect, useId, useMemo, useState } from 'react';
import Cancel from '../assets/cancel/cancel.svg?react';
import Search from '../assets/search/search.svg?react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
};

export const SearchBar: React.FC<Props> = ({ value, onChange, placeholder = 'Search', className = '', debounceMs = 150 }) => {
  const id = useId();

  const [inner, setInner] = useState(value);

  useEffect(() => setInner(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(inner), debounceMs);
    return () => clearTimeout(t);
  }, [inner, debounceMs, onChange]);

  const hasText = inner.trim().length > 0;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInner(e.target.value);
  };

  const clear = () => setInner('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && hasText) {
      e.preventDefault();
      clear();
    }
  };

  const inputPaddingRight = useMemo(() => (hasText ? 'pr-10 sm:pr-12' : 'pr-2'), [hasText]);

  return (
    <div className={className}>
      <div className="w-full">
        <label
          htmlFor={id}
          className="
            group relative flex items-center gap-3
            rounded-full px-4 py-3
            bg-[rgba(41,32,68,1)]
            backdrop-blur-[18px] backdrop-saturate-150
            shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_6px_24px_rgba(0,0,0,0.35)]
            focus-within:ring-2 focus-within:ring-[rgba(106,77,188,0.45)]
          "
        >
          <Search className="h-6 w-6 text-white" aria-hidden />

          <input
            id={id}
            value={inner}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`
              w-full bg-transparent outline-none border-0
              text-white/90 placeholder:text-white/40 text-lg leading-none
              ${inputPaddingRight}
            `}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="search"
          />

          {hasText && (
            <button
              type="button"
              onClick={clear}
              aria-label="Limpiar búsqueda"
              className="
                absolute right-3 inset-y-0 my-auto grid place-items-center
                h-7 w-7 rounded-full
                text-white/80 hover:text-white
                hover:bg-white/10 active:scale-95 transition
              "
            >
              <Cancel className="h-5 w-5" />
            </button>
          )}
        </label>
      </div>
    </div>
  );
};

export default SearchBar;
