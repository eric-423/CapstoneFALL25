"use client";

import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "",
  rows = 3,
  disabled = false,
}: AddressAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isScriptError, setIsScriptError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isFetching, setIsFetching] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null
  );
  const requestIdRef = useRef(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);
  const justSelectedRef = useRef(false);

  const MIN_CHARS = 1;
  const DEBOUNCE_MS = 300;

  useEffect(() => {
    const checkExistingScript = () => {
      if (window.google?.maps?.places) {
        try {
          autocompleteServiceRef.current =
            new window.google.maps.places.AutocompleteService();
          const div = document.createElement("div");
          placesServiceRef.current =
            new window.google.maps.places.PlacesService(div);
          setIsScriptLoaded(true);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    };

    if (!checkExistingScript()) {
      const timeout = setTimeout(() => {
        checkExistingScript();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (!isFocused && !justSelectedRef.current) {
      setInputValue(value ?? "");
    }
  }, [value, isFocused]);

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
    if (window.google?.maps?.places) {
      try {
        autocompleteServiceRef.current =
          new window.google.maps.places.AutocompleteService();
        const div = document.createElement("div");
        placesServiceRef.current = new window.google.maps.places.PlacesService(
          div
        );
        setIsScriptLoaded(true);
        return;
      } catch {
        setIsScriptError(true);
        return;
      }
    }

    let checkInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let attempts = 0;
    const maxAttempts = 50;

    checkInterval = setInterval(() => {
      attempts++;
      if (window.google?.maps?.places) {
        if (checkInterval) clearInterval(checkInterval);
        if (timeoutId) clearTimeout(timeoutId);
        try {
          autocompleteServiceRef.current =
            new window.google.maps.places.AutocompleteService();
          const div = document.createElement("div");
          placesServiceRef.current =
            new window.google.maps.places.PlacesService(div);
          setIsScriptLoaded(true);
        } catch {
          setIsScriptError(true);
        }
      } else if (attempts >= maxAttempts) {
        if (checkInterval) clearInterval(checkInterval);
        if (timeoutId) clearTimeout(timeoutId);
      }
    }, 100);

    timeoutId = setTimeout(() => {
      if (checkInterval) clearInterval(checkInterval);
      setIsScriptError(true);
    }, 5000);
  }, []);

  const search = useCallback(
    (query: string) => {
      if (!autocompleteServiceRef.current || !isScriptLoaded) {
        return;
      }

      const id = ++requestIdRef.current;
      setIsFetching(true);
      setPredictions([]);

      autocompleteServiceRef.current!.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: "vn" },
          types: ["address"],
        },
        (results, status) => {
          if (id !== requestIdRef.current) {
            return;
          }

          setIsFetching(false);
          if (status === "OK" && results && results.length > 0) {
            setPredictions(results.slice(0, 5));
          } else {
            setPredictions([]);
          }
        }
      );
    },
    [isScriptLoaded]
  );

  const debouncedSearch = useCallback(
    (q: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(q), DEBOUNCE_MS);
    },
    [search]
  );

  useEffect(() => {
    if (justSelectedRef.current) {
      return;
    }

    const normalizedValue =
      typeof inputValue === "string"
        ? inputValue
        : inputValue !== undefined && inputValue !== null
          ? String(inputValue)
          : "";
    const q = normalizedValue.trim();

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!isFocused) {
      setPredictions([]);
      setIsFetching(false);
      return;
    }

    if (disabled || !isScriptLoaded) {
      setPredictions([]);
      setIsFetching(false);
      return;
    }

    if (q.length < MIN_CHARS) {
      setPredictions([]);
      setIsFetching(false);
      return;
    }

    debouncedSearch(q);
  }, [inputValue, isFocused, isScriptLoaded, disabled, debouncedSearch]);

  const handleSelect = useCallback(
    (p: google.maps.places.AutocompletePrediction) => {
      isSelectingRef.current = true;
      justSelectedRef.current = true;

      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }

      setPredictions([]);
      setIsFetching(false);
      setIsFocused(false);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      const finalize = (addr: string) => {
        setInputValue(addr);
        onChange(addr);

        setTimeout(() => {
          isSelectingRef.current = false;
          justSelectedRef.current = false;
        }, 500);
      };

      if (!placesServiceRef.current || !isScriptLoaded) {
        finalize(p.description);
        return;
      }

      placesServiceRef.current!.getDetails(
        { placeId: p.place_id, fields: ["formatted_address"] },
        (place, status) => {
          finalize(
            status === "OK" && place?.formatted_address
              ? place.formatted_address
              : p.description
          );
        }
      );
    },
    [onChange, isScriptLoaded]
  );

  const canUse = Boolean(apiKey) && !isScriptError;
  const isAutocompleteReady = canUse && isScriptLoaded;

  return (
    <div ref={containerRef} className="relative w-full overflow-visible">
      {canUse && (
        <Script
          id="google-maps-places-script"
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
          onLoad={() => {
            handleScriptLoad();
          }}
          onError={() => {
            setIsScriptError(true);
          }}
          onReady={() => {
            if (window.google?.maps?.places && !isScriptLoaded) {
              handleScriptLoad();
            }
          }}
          strategy="afterInteractive"
        />
      )}

      <Textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => {
          const newValue = e.target.value;
          setInputValue(newValue);
          if (!disabled) {
            setIsFocused(true);
          }
        }}
        onFocus={() => {
          if (!disabled) {
            isSelectingRef.current = false;
            if (blurTimeoutRef.current) {
              clearTimeout(blurTimeoutRef.current);
              blurTimeoutRef.current = null;
            }
            setIsFocused(true);
          }
        }}
        onBlur={() => {
          if (!isSelectingRef.current) {
            blurTimeoutRef.current = setTimeout(() => {
              if (!isSelectingRef.current && predictions.length === 0) {
                setIsFocused(false);
              }
            }, 300);
          }
        }}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="resize-none"
      />

      {!canUse && (
        <p className="mt-1 text-xs text-muted-foreground">
          {!apiKey ? "API Key chưa được cấu hình. " : ""}Không thể tải Google
          Autocomplete. Bạn vẫn có thể nhập địa chỉ thủ công.
        </p>
      )}
      {canUse && !isScriptLoaded && !isScriptError && (
        <p className="mt-1 text-xs text-muted-foreground">
          Đang tải Google Maps API...
        </p>
      )}
      {canUse && isScriptError && (
        <p className="mt-1 text-xs text-destructive">
          Lỗi khi tải Google Maps API. Vui lòng kiểm tra lại API key hoặc kết
          nối mạng.
        </p>
      )}

      {isAutocompleteReady &&
        !disabled &&
        isFocused &&
        (isFetching || predictions.length > 0) && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 bottom-full z-[9999] mb-1 overflow-hidden rounded-lg border border-border bg-white shadow-xl max-h-[300px] overflow-y-auto"
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onMouseEnter={() => {
              if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
                blurTimeoutRef.current = null;
              }
              isSelectingRef.current = true;
            }}
            onMouseLeave={() => {
              isSelectingRef.current = false;
            }}
          >
            {isFetching && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Đang tìm...
              </div>
            )}
            {predictions.length > 0 &&
              predictions.map((p) => (
                <button
                  key={p.place_id}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    isSelectingRef.current = true;
                  }}
                  onClick={() => handleSelect(p)}
                >
                  <div className="font-medium">
                    {p.structured_formatting?.main_text || p.description}
                  </div>
                  {p.structured_formatting?.secondary_text && (
                    <div className="text-xs text-muted-foreground">
                      {p.structured_formatting.secondary_text}
                    </div>
                  )}
                </button>
              ))}
          </div>
        )}
    </div>
  );
}
