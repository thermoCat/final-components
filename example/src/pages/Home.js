import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/find/map?query=${searchTerm}`);
  };

  const stores = [
    {
      id: 1,
      name: "가게이름1",
      description: "신규 가게로 선정되었습니다",
      src: "https://www.goodprice.go.kr/comm/showImageFile.do?fileCours=/bssh/20240913/thumb/&fileId=8F3F0544772546B495E739C636D3016D.png",
    },
    {
      id: 2,
      name: "가게이름2",
      description: "신규 가게로 선정되었습니다",
      src: "https://www.goodprice.go.kr/comm/showImageFile.do?fileCours=/bssh/20250103/thumb/&fileId=242347F596B148BCBF01200AEA69E451.jpeg",
    },
    {
      id: 3,
      name: "가게이름3",
      description: "신규 가게로 선정되었습니다",
      src: "https://www.goodprice.go.kr/comm/showImageFile.do?fileCours=/bssh/20250103/thumb/&fileId=A90AB53F5ADF433DBDCE33F5428D588E.jpeg",
    },
    {
      id: 4,
      name: "가게이름4",
      description: "신규 가게로 선정되었습니다",
      src: "https://www.goodprice.go.kr/comm/showImageFile.do?fileCours=/bssh/20241011/thumb/&fileId=1CAA071456D74DCA808DAF8A48DBC491.jpeg",
    },
  ];

  const reviews = [
    { id: 1, storeName: "가게이름1", reviewer: "회원아이디", rating: 4.5 },
    { id: 2, storeName: "가게이름2", reviewer: "회원아이디", rating: 4.5 },
    { id: 3, storeName: "가게이름3", reviewer: "회원아이디", rating: 4.5 },
    { id: 4, storeName: "가게이름4", reviewer: "회원아이디", rating: 4.5 },
  ];

  const notices = [
    { id: 1, title: "공지사항 제목", content: "가나다라마바" },
    { id: 2, title: "공지사항 제목", content: "가나다라마바" },
    { id: 3, title: "공지사항 제목", content: "가나다라마바" },
  ];
  return (
    <>
      <div className="bg-blue-100 dark:bg-gray-700 text-center">
        <div className="bg-blue-100 dark:bg-gray-700 py-20 text-left">
          {/* 검색 및 이동 */}
          <div className="flex items-center justify-end space-x-2 mb-6 mr-[20%]">
            {/* <input
            type="text"
            placeholder="가게명 검색"
            className="p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
            <div class="relative w-96">
              <input
                type="text"
                placeholder="가게명 검색"
                class="input input-floating peer"
                id="floatingInput"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <label class="input-floating-label" for="floatingInput">
                가게명 검색
              </label>
            </div>
            <button
              className="p-2 bg-blue-500 text-white rounded"
              onClick={handleSearch}
            >
              검색
            </button>
            <Link
              to="/find/map"
              className="p-2 bg-green-500 text-white rounded"
            >
              바로 이동
            </Link>
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
                <p className="text-left mt-3 ml-3 mb-3">
                  부연설명은 시그마 보이 시그마 보이 시그마 보이 시그마 보이
                  시그마 보이
                </p>
                <button className="p-2 w-25 bg-blue-500 text-white rounded-full mb-10">
                  Shop Now
                </button>
                <div className="grid grid-cols-3 gap-4 text-center pt-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-800">9,700+</h1>
                    <p className="text-sm text-gray-500">착한가격업소</p>
                  </div>
                  <div className="border-l border-r border-gray-300">
                    <h1 className="text-4xl font-bold text-gray-800">2,000+</h1>
                    <p className="text-sm text-gray-500">리뷰수</p>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-800">
                      50,800+
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
            {/* 검색 및 이동 */}
            <div className="flex items-center justify-start space-x-2 mb-6">
              <input
                type="text"
                placeholder="가게명 검색"
                className="p-2 border border-gray-300 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="p-2 bg-blue-500 text-white rounded"
                onClick={handleSearch}
              >
                검색
              </button>
              <Link
                to="/find/map"
                className="p-2 bg-green-500 text-white rounded"
              >
                바로 이동
              </Link>
            </div>

            {/* 착한가격업소 */}
            <h2 className="text-xl font-bold mb-4">오늘의 착한가격업소</h2>
            <div className="grid grid-cols-4 gap-4 mb-6 justify-center">
              {stores.map((store) => (
                <Link
                  key={store.id}
                  to={`/store/${store.id}`}
                  className="border p-4 rounded shadow hover:bg-gray-100"
                >
                  <img
                    src={store.src}
                    alt="업소사진"
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <div className="text-lg font-semibold">{store.name}</div>
                  <div className="text-sm text-gray-500">
                    {store.description}
                  </div>
                </Link>
              ))}
            </div>

            {/* 베스트 포토후기 */}
            <h2 className="text-xl font-bold mb-4">베스트 포토후기</h2>
            <div className="grid grid-cols-4 gap-4 mb-6 justify-center">
              {reviews.map((review) => (
                <Link
                  key={review.id}
                  to={`/review/${review.id}`}
                  className="border p-4 rounded shadow hover:bg-gray-100"
                >
                  <img
                    src={review.src}
                    alt="포토후기"
                    className="w-full h-48 object-cover"
                  />
                  <div className="text-lg font-semibold">
                    {review.storeName}
                  </div>
                  <div className="text-sm text-gray-500">{review.reviewer}</div>
                  <div className="text-yellow-500">⭐ {review.rating}</div>
                </Link>
              ))}
            </div>

            {/* 공지사항 */}
            <h2 className="text-xl font-bold mb-4">공지사항</h2>
            <div className="grid grid-cols-3 gap-4 justify-center">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  to={`/review/${notice.id}`}
                  className="border p-4 rounded shadow hover:bg-gray-100"
                >
                  <div className="text-lg font-semibold">{notice.title}</div>
                  <div className="text-sm text-gray-500">{notice.content}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
