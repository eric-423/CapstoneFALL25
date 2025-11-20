'use client';

import { Textarea } from '@/components/ui/textarea';
import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface AddressAutocompleteProps {
    value: string;
    onChange: (address: string) => void;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
}

declare global {
    interface Window { google: typeof google; }
}

export function AddressAutocomplete({
    value,
    onChange,
    placeholder = '',
    rows = 3,
    disabled = false,
}: AddressAutocompleteProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isScriptError, setIsScriptError] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [inputValue, setInputValue] = useState(value ?? '');

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
    const requestIdRef = useRef(0);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isSelectingRef = useRef(false);

    const MIN_CHARS = 1;
    const DEBOUNCE_MS = 300;

    useEffect(() => {
        // Sync value từ props nhưng không làm mất focus nếu user đang nhập
        if (!isFocused) {
            setInputValue(value ?? '');
        }
    }, [value, isFocused]);

    // Cleanup timeouts khi component unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
            }
        };
    }, []);

    const handleScriptLoad = useCallback(() => {
        if (!window.google?.maps?.places) return;
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        const div = document.createElement('div');
        placesServiceRef.current = new window.google.maps.places.PlacesService(div);
        setIsScriptLoaded(true);
    }, []);

    const search = useCallback((query: string) => {
        if (!autocompleteServiceRef.current || !isScriptLoaded) return;
        const id = ++requestIdRef.current;
        setIsFetching(true);
        setPredictions([]);

        autocompleteServiceRef.current!.getPlacePredictions(
            { input: query, componentRestrictions: { country: 'vn' }, types: ['address'] },
            (results, status) => {
                if (id !== requestIdRef.current) return;
                setIsFetching(false);
                if (status === 'OK' && results) setPredictions(results.slice(0, 5));
            }
        );
    }, [isScriptLoaded]);

    const debouncedSearch = useCallback((q: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(q), DEBOUNCE_MS);
    }, [search]);

    useEffect(() => {
        const normalizedValue =
            typeof inputValue === 'string'
                ? inputValue
                : inputValue !== undefined && inputValue !== null
                    ? String(inputValue)
                    : '';
        const q = normalizedValue.trim();

        // Clear timeout nếu có
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }

        // Nếu không đủ điều kiện, clear predictions
        if (disabled || !isFocused || !isScriptLoaded || q.length < MIN_CHARS) {
            setPredictions([]);
            setIsFetching(false);
            return;
        }

        // Chỉ search nếu có ít nhất MIN_CHARS và đang focus
        debouncedSearch(q);
    }, [inputValue, isFocused, isScriptLoaded, disabled, debouncedSearch]);

    const handleSelect = useCallback((p: google.maps.places.AutocompletePrediction) => {
        isSelectingRef.current = true;

        // Clear blur timeout
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
        }

        const finalize = (addr: string) => {
            setInputValue(addr);
            onChange(addr);
            setPredictions([]);
            // Đánh dấu đã chọn xong sau một chút
            setTimeout(() => {
                isSelectingRef.current = false;
                // Giữ focus để user có thể tiếp tục chỉnh sửa nếu muốn
                if (textareaRef.current && document.activeElement !== textareaRef.current) {
                    textareaRef.current.focus();
                }
            }, 100);
        };

        if (!placesServiceRef.current || !isScriptLoaded) {
            finalize(p.description);
            return;
        }

        placesServiceRef.current!.getDetails(
            { placeId: p.place_id, fields: ['formatted_address'] },
            (place, status) => {
                finalize(status === 'OK' && place?.formatted_address ? place.formatted_address : p.description);
            }
        );
    }, [onChange, isScriptLoaded]);

    const canUse = Boolean(apiKey) && !isScriptError;

    return (
        <div className="relative">
            {canUse && (
                <Script
                    src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
                    onLoad={handleScriptLoad}
                    onError={() => setIsScriptError(true)}
                    strategy="lazyOnload"
                />
            )}

            <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    // Đảm bảo focus được giữ khi user đang nhập
                    if (!isFocused && !disabled) {
                        setIsFocused(true);
                    }
                }}
                onFocus={() => {
                    if (!disabled) {
                        isSelectingRef.current = false;
                        // Clear blur timeout nếu có
                        if (blurTimeoutRef.current) {
                            clearTimeout(blurTimeoutRef.current);
                            blurTimeoutRef.current = null;
                        }
                        setIsFocused(true);
                    }
                }}
                onBlur={() => {
                    // Chỉ blur nếu không phải đang chọn từ dropdown
                    if (!isSelectingRef.current) {
                        // Delay blur để user có thể click vào dropdown
                        blurTimeoutRef.current = setTimeout(() => {
                            if (!isSelectingRef.current) {
                                setIsFocused(false);
                            }
                        }, 250);
                    }
                }}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled || !canUse}
                className="resize-none"
            />

            {canUse && isFocused && (isFetching || predictions.length > 0) && !disabled && (
                <div
                    className="absolute left-0 right-0 top-full z-[60] mt-1 overflow-hidden rounded-lg border border-border bg-background shadow-xl max-h-[300px] overflow-y-auto animate-in fade-in-0 slide-in-from-top-2 duration-200 ease-out"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onMouseEnter={() => {
                        if (blurTimeoutRef.current) {
                            clearTimeout(blurTimeoutRef.current);
                            blurTimeoutRef.current = null;
                        }
                    }}
                >
                    {isFetching && (
                        <div className="px-3 py-2 text-sm text-muted-foreground animate-pulse">
                            Đang tìm...
                        </div>
                    )}
                    {predictions.map((p, index) => (
                        <button
                            key={p.place_id}
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-all duration-150 hover:translate-x-1 opacity-0 animate-in fade-in-0 slide-in-from-left-2"
                            style={{
                                animationDelay: `${index * 30}ms`,
                                animationFillMode: 'forwards'
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                isSelectingRef.current = true;
                            }}
                            onClick={() => handleSelect(p)}
                        >
                            <div className="font-medium">{p.structured_formatting.main_text}</div>
                            <div className="text-xs text-muted-foreground">{p.structured_formatting.secondary_text}</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}