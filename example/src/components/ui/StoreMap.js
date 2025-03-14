import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, MapMarker, ZoomControl, MapTypeControl, MarkerClusterer } from 'react-kakao-maps-sdk';

const center = {
    lat: 36.326784862,
    lng: 127.40783579,
};

function StoreMap() {
    const [address, setAddress] = useState([]); // 주소 목록
    const [targets, setTargets] = useState([]); // 마커 상태 관리
    const [isSdkLoaded, setIsSdkLoaded] = useState(false); // SDK 로드 상태
    const [bounds, setBounds] = useState({
        sw: { lat: 0, lng: 0 }, // 남서(South-West) 좌표
        ne: { lat: 0, lng: 0 }, // 북동(North-East) 좌표
    });

    // 마커 데이터 업데이트 (현재 보이는 영역 내의 마커만 필터링)
    useEffect(() => {
        if (!address || address.length === 0) return;

        const filteredTargets = address
            .map((building) => {
                if (building.lat && building.lng) {
                    return {
                        lat: building.lat,
                        lng: building.lng,
                    };
                }
                return null;
            })
            .filter(Boolean);

        setTargets(filteredTargets);
    }, [address]);

    // 주소 데이터 가져오기
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/address`);
                setAddress(res.data); // 주소 데이터 업데이트
            } catch (error) {
                console.error('fetchAddress error', error);
            }
        };
        fetchAddress();
    }, []);

    // 마커 데이터 업데이트
    useEffect(() => {
        if (!address || address.length === 0) return;

        const filteredTargets = address
            .map((building) => {
                if (building.lat && building.lng) {
                    return {
                        lat: building.lat,
                        lng: building.lng,
                    };
                }
                return null;
            })
            .filter(Boolean);

        setTargets(filteredTargets);
    }, [address]);

    // 카카오 맵 SDK 로드
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_KEY}&libraries=clusterer&autoload=false`;
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                setIsSdkLoaded(true); // SDK가 로드되면 true로 변경
            });
        };
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // 지도 바운드 업데이트 (보이는 영역의 좌표)
    const handleBoundsChange = (map) => {
        const newBounds = map.getBounds();
        const sw = newBounds.getSouthWest(); // 남서(South-West)
        const ne = newBounds.getNorthEast(); // 북동(North-East)

        setBounds({
            sw: { lat: sw.getLat(), lng: sw.getLng() },
            ne: { lat: ne.getLat(), lng: ne.getLng() },
        });

        // console.log("현재 지도 영역");
        // console.log("남서 좌표:", sw.getLat(), sw.getLng());
        // console.log("북동 좌표:", ne.getLat(), ne.getLng());

        // 현재 보이는 영역 내의 마커 필터링
        const visibleMarkers = address.filter(
            (pos) =>
                pos.lat >= sw.getLat() && pos.lat <= ne.getLat() && pos.lng >= sw.getLng() && pos.lng <= ne.getLng()
        );

        setTargets(visibleMarkers);
    };

    // SDK가 로드되지 않으면 스피너 표시
    if (!isSdkLoaded) {
        return <span className="loading loading-spinner loading-lg" />;
    }

    return (
        <div className="w-full h-full">
            <Map
                center={center}
                className="w-full h-full"
                level={3} // 지도 확대 레벨
                minLevel={15} // 클러스터 할 최소 지도 레벨
                onBoundsChanged={handleBoundsChange} // 지도 영역 변경 감지
            >
                {/* 줌 컨트롤러 추가 */}
                <ZoomControl position={'RIGHT'} />

                {/* 지도 타입 컨트롤러 추가 */}
                <MapTypeControl position={'TOPRIGHT'} />

                {/* 클러스터러 */}
                <MarkerClusterer
                    averageCenter={true} // 클러스터 중심을 평균 위치로 설정
                    minLevel={4} // 클러스터링 적용 최소 줌 레벨
                >
                    {targets.map((pos, i) => (
                        <MapMarker
                            key={i}
                            position={{
                                lat: pos.lat,
                                lng: pos.lng,
                            }}
                        />
                    ))}
                </MarkerClusterer>

                {/* 기준좌표 마커 */}
                <MapMarker
                    position={center}
                    image={{
                        src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                        size: { width: 30, height: 35 },
                    }}
                />
            </Map>
        </div>
    );
}

export default StoreMap;
