import { useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import { CONFIG } from "@/config-global";

interface MapViewProps {
    selectedDay?: any;
}

export default function MapView({
    selectedDay,
}: MapViewProps) {

    const mapRef = useRef<HTMLDivElement | null>(null);

    const mapInstanceRef =
        useRef<maplibregl.Map | null>(null);

    // lưu marker để clear khi đổi day
    const markersRef = useRef<
        maplibregl.Marker[]
    >([]);

    // parse coordinates
    const coordinates = useMemo(() => {
        return (
            selectedDay?.strListLocation
                ?.split("#")
                ?.filter(Boolean)
                ?.map((item: string) => {
                    const arr = item.split("!");

                    return [
                        Number(arr[2]), // lng
                        Number(arr[3]), // lat
                    ] as [number, number];
                })
                ?.filter(
                    ([lng, lat]: [number, number]) =>
                        !Number.isNaN(lng) &&
                        !Number.isNaN(lat)
                ) ?? []
        );
    }, [selectedDay]);

    // init map
    useEffect(() => {
        if (!mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapRef.current,

            style: `${CONFIG.serverUrl}mapproxy/style?type=outdoor-v2`,

            center:
                coordinates?.[0] || [105.8342, 21.0278],

            zoom: 5,
        });

        map.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );

        mapInstanceRef.current = map;

        return () => {
            map.remove();
        };
    }, []);

    // render route
    useEffect(() => {
        const map = mapInstanceRef.current;

        if (!map) return;

        if (!coordinates.length) return;

        const renderRoute = () => {
            // clear markers cũ
            markersRef.current.forEach((marker) => {
                marker.remove();
            });

            markersRef.current = [];

            // remove line cũ
            if (map.getLayer("route-line")) {
                map.removeLayer("route-line");
            }

            if (map.getSource("route")) {
                map.removeSource("route");
            }

            // START marker
            const startMarker =
                new maplibregl.Marker({
                    color: "green",
                })
                    .setLngLat(coordinates[0])
                    .addTo(map);

            markersRef.current.push(startMarker);

            // END marker
            if (coordinates.length > 1) {
                const endMarker =
                    new maplibregl.Marker({
                        color: "red",
                    })
                        .setLngLat(
                            coordinates[
                            coordinates.length - 1
                            ]
                        )
                        .addTo(map);

                markersRef.current.push(endMarker);
            }

            // MIDDLE markers
            coordinates.forEach(
                (coord: [number, number], index: number) => {
                    if (
                        index !== 0 &&
                        index !==
                        coordinates.length - 1
                    ) {
                        const middleMarker =
                            new maplibregl.Marker({
                                color: "#0A7BBD",
                            })
                                .setLngLat(coord)
                                .addTo(map);

                        markersRef.current.push(
                            middleMarker
                        );
                    }
                }
            );

            // LINE
            if (coordinates.length > 1) {
                map.addSource("route", {
                    type: "geojson",

                    data: {
                        type: "Feature",

                        geometry: {
                            type: "LineString",
                            coordinates,
                        },

                        properties: {},
                    },
                });

                map.addLayer({
                    id: "route-line",

                    type: "line",

                    source: "route",

                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },

                    paint: {
                        "line-color": "#549cff",
                        "line-width": 4,
                    },
                });
            }

            // fit bounds
            const bounds =
                new maplibregl.LngLatBounds();

            coordinates.forEach(
                (coord: [number, number]) => {
                    bounds.extend(coord);
                }
            );

            map.fitBounds(bounds, {
                padding: 80,
                duration: 1000,
            });
        };

        if (map.loaded()) {
            renderRoute();
        } else {
            map.on("load", renderRoute);
        }
    }, [coordinates]);

    return (
        <div
            ref={mapRef}
            className="h-full w-full"
        />
    );
}