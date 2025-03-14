import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SimpleSlider from '../components/ui/homeCarousel/HomeCarousel';
import { handleEnterKey } from '../utils/Keydown';
import SimpleSlider2 from '../components/ui/homeCarousel/HomeCarousel2';

function Home() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(null); //검색어
    const [stores, setStores] = useState([]); // 오늘의 착한가격업소
    const [homeCount, setHomeCount] = useState([]); // 홈페이지 카운트 화면
    const [homeNotice, setHomeNotice] = useState([]); // 홈페이지 최신 공지사항순

    // 가게, 품목검색
    const handleSearch = () => {
        if (!searchTerm || searchTerm.trim() === '') {
            alert('검색어를 입력해주세요');
            return;
        }
        navigate(`/find/map?query=${encodeURIComponent(searchTerm)}`);
    };

    // 공지사항 클릭
    const handleNotice = (notice) => {
        navigate('/answer', {
            state: { mainPageNotice: notice },
        });
    };

    useEffect(() => {
        const getTodayData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/home/likecount`);
                setStores(res.data);
            } catch (error) {
                console.error('ERROR');
            }
        };
        getTodayData();

        const getHomeCountData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/home/homecount`);
                setHomeCount(res.data);
            } catch (error) {
                console.error('ERROR');
            }
        };
        getHomeCountData();

        const getHomeNoticeData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/home/newnotice`);
                setHomeNotice(res.data);
            } catch (error) {
                console.error('ERROR');
            }
        };
        getHomeNoticeData();
    }, []);

    const totalUser = homeCount[0]?.totalStoreCount + homeCount[0]?.totalUserCount; // 홈페이지 카운트계산

    const reviews = [
        { id: 1, storeName: '가게이름1', reviewer: '회원아이디', rating: 4.5 },
        { id: 2, storeName: '가게이름2', reviewer: '회원아이디', rating: 4.5 },
        { id: 3, storeName: '가게이름3', reviewer: '회원아이디', rating: 4.5 },
        { id: 4, storeName: '가게이름4', reviewer: '회원아이디', rating: 4.5 },
    ];

    return (
        <>
            <div className="bg-blue-100 dark:bg-gray-700 text-center">
                <div className="bg-blue-100 dark:bg-gray-700 py-20 text-left">
                    {/* 검색 및 이동 */}
                    <div className="flex items-center justify-end space-x-2 mb-6 mr-[20%]">
                        <div className="relative w-96">
                            <input
                                type="text"
                                placeholder="가게명 검색"
                                className="input input-floating peer rounded-full"
                                id="floatingInput"
                                value={searchTerm || ''}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => handleEnterKey(e, handleSearch)}
                            />
                            <label className="input-floating-label" htmlFor="floatingInput">
                                가게명 검색
                            </label>
                        </div>
                        <button className="p-2 bg-blue-500 text-white rounded-full" onClick={handleSearch}>
                            검색
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-start items-center mx-auto max-w-screen-xl">
                        <div className="text-left w-full">
                            <div className="ml-10">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 dark:text-white text-left">
                                    착한가격
                                    <br />
                                    기분좋은 서비스
                                    <br />
                                    건강한 재료
                                </h1>
                                <p className="text-left mt-5 ml-3">
                                    착한 가격, 기분 좋은 서비스, 건강한 재료로 정성을 담아 최고의 만족을 제공합니다.
                                </p>
                                <button className="p-3 bg-blue-500 text-white rounded-full mb-10 mt-5">
                                    <Link to="/find/map">착한업소 보러가기</Link>
                                </button>
                                <div className="grid grid-cols-3 gap-4 text-center pt-4">
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-800">
                                            {homeCount[0]?.totalStoreCount.toLocaleString('en-US')}+
                                        </h1>
                                        <p className="text-sm text-gray-500">착한가격업소</p>
                                    </div>
                                    <div className="border-l border-r border-gray-300">
                                        <h1 className="text-4xl font-bold text-gray-800">
                                            {homeCount[0]?.totalReviewCount.toLocaleString('en-US')}+
                                        </h1>
                                        <p className="text-sm text-gray-500">리뷰수</p>
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-800">
                                            {totalUser.toLocaleString('en-US')}+
                                        </h1>
                                        <p className="text-sm text-gray-500">이용자수</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center">
                <div className="w-9/12 mx-auto">
                    <div className="p-6 text-left">
                        {/* 착한가격업소 */}

                        <h2 className="text-3xl text-center font-bold py-12">오늘의 착한가격업소</h2>

                        <SimpleSlider data={stores} />

                        {/* 베스트 포토후기 */}
                        <h2 className="text-3xl text-center font-bold my-4 pt-16 pb-12">착한녀석들 소식</h2>

                        <SimpleSlider2 />

                        {/* 공지사항 */}
                        <h2 className="text-xl font-bold mb-4 mt-20">공지사항</h2>
                        <div className="border p-6 rounded-lg bg-white ">
                            <div className="grid grid-cols-3 gap-6 justify-center">
                                {homeNotice.map((notice) => (
                                    <button
                                        key={notice.noticeId}
                                        to={`/notice/${notice.id}`}
                                        className="border p-5 rounded-lg  ease-in-out bg-gray-50 hover:bg-gray-100"
                                        onClick={() => handleNotice(notice)}
                                    >
                                        <div className="text-lg font-semibold text-gray-800 mb-2 text-left">
                                            {notice.noticeId}번 공지 : {notice.noticeTitle}
                                        </div>
                                        <div className="text-sm text-gray-600 text-left line-clamp-2">
                                            {notice.noticeContent}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
