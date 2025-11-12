'use client';

import { Textarea } from '@/components/ui/textarea';
import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface AddressAutocompleteProps {
    value: string;
    onChange: (address: string) => void;
    placeholder?: string;
    rows?: number;
}

declare global {
    interface Window {
        google: typeof google;
    }
}

export function AddressAutocomplete({
    value,
    onChange,
    placeholder = '',
    rows = 3,
}: AddressAutocompleteProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isScriptError, setIsScriptError] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [isFetchingPredictions, setIsFetchingPredictions] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
    const debounceTimerRef = useRef<number | null>(null);

    const MIN_QUERY_LENGTH = 3;
    const DEBOUNCE_DELAY = 350;
    const MAX_RESULTS = 5;

    useEffect(() => {
        if (!isScriptLoaded || typeof window === 'undefined') return;
        if (!window.google?.maps?.places) return;

        if (!autocompleteServiceRef.current) {
            autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        }

        if (!placesServiceRef.current) {
            const container = document.createElement('div');
            placesServiceRef.current = new window.google.maps.places.PlacesService(container);
        }
    }, [isScriptLoaded]);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                window.clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isFocused) {
            if (isFetchingPredictions) {
                setIsFetchingPredictions(false);
            }
            setPredictions([]);
            if (debounceTimerRef.current) {
                window.clearTimeout(debounceTimerRef.current);
            }
            return;
        }

        if (!autocompleteServiceRef.current || !window.google?.maps?.places) {
            if (isFetchingPredictions) {
                setIsFetchingPredictions(false);
            }
            setPredictions([]);
            return;
        }

        const trimmedValue = value?.trim() ?? '';

        if (!trimmedValue || trimmedValue.length < MIN_QUERY_LENGTH) {
            if (isFetchingPredictions) {
                setIsFetchingPredictions(false);
            }
            setPredictions([]);
            if (debounceTimerRef.current) {
                window.clearTimeout(debounceTimerRef.current);
            }
            return;
        }

        if (debounceTimerRef.current) {
            window.clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = window.setTimeout(() => {
            setIsFetchingPredictions(true);

            autocompleteServiceRef.current?.getPlacePredictions(
                {
                    input: trimmedValue,
                    componentRestrictions: { country: 'vn' },
                    types: ['address'],
                },
                (results, status) => {
                    setIsFetchingPredictions(false);

                    if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results) {
                        setPredictions([]);
                        return;
                    }

                    setPredictions(results.slice(0, MAX_RESULTS));
                },
            );
        }, DEBOUNCE_DELAY);

        return () => {
            if (debounceTimerRef.current) {
                window.clearTimeout(debounceTimerRef.current);
            }
        };
    }, [value, isFocused, isFetchingPredictions]);

    const handleSelectPrediction = useCallback(
        (prediction: google.maps.places.AutocompletePrediction) => {
            if (!window.google?.maps?.places) {
                onChange(prediction.description);
                setPredictions([]);
                setIsFocused(false);
                textareaRef.current?.focus();
                return;
            }

            const handleResult = (formattedAddress: string | undefined) => {
                onChange(formattedAddress ?? prediction.description);
                setPredictions([]);
                setIsFocused(false);
                textareaRef.current?.focus();
            };

            if (!placesServiceRef.current) {
                handleResult(prediction.description);
                return;
            }

            placesServiceRef.current.getDetails(
                {
                    placeId: prediction.place_id,
                    fields: ['formatted_address', 'geometry', 'address_components'],
                },
                (place, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.formatted_address) {
                        handleResult(place.formatted_address);
                        return;
                    }

                    handleResult(prediction.description);
                },
            );
        },
        [onChange],
    );

    const handleTextareaFocus = () => {
        if (isScriptError) return;
        setIsFocused(true);
    };

    const handleTextareaBlur = () => {
        window.setTimeout(() => {
            setIsFocused(false);
        }, 150);
    };

    const showSuggestions = isFocused && (predictions.length > 0 || isFetchingPredictions);
    const canUseAutocomplete = Boolean(apiKey) && !isScriptError;

    return (
        <div className='relative'>
            {canUseAutocomplete && (
                <Script
                    id='google-maps-places-script'
                    src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
                    onLoad={() => setIsScriptLoaded(true)}
                    onError={() => {
                        console.error('Không thể tải Google Maps Places API. Tính năng gợi ý địa chỉ sẽ bị vô hiệu.');
                        setIsScriptError(true);
                    }}
                    strategy='lazyOnload'
                />
            )}

            <Textarea
                ref={textareaRef}
                value={value}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
                onFocus={handleTextareaFocus}
                onBlur={handleTextareaBlur}
                placeholder={placeholder}
                rows={rows}
                autoComplete='off'
            />

            {canUseAutocomplete && showSuggestions && (
                <div className='absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-md border border-border bg-background shadow-lg'>
                    {isFetchingPredictions && (
                        <div className='px-3 py-2 text-sm text-muted-foreground'>Đang gợi ý địa chỉ...</div>
                    )}

                    {!isFetchingPredictions && predictions.length === 0 && (
                        <div className='px-3 py-2 text-sm text-muted-foreground'>Không tìm thấy địa chỉ phù hợp</div>
                    )}

                    {predictions.map((prediction) => (
                        <button
                            key={prediction.place_id}
                            type='button'
                            className='flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-muted'
                            onMouseDown={(event) => {
                                event.preventDefault();
                            }}
                            onClick={() => handleSelectPrediction(prediction)}
                        >
                            <span className='font-medium'>{prediction.structured_formatting.main_text}</span>
                            <span className='text-xs text-muted-foreground'>
                                {prediction.structured_formatting.secondary_text ?? prediction.description}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}