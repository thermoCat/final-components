import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { FaRegThumbsUp } from "react-icons/fa6";

// Material UI
import Rating from "@mui/material/Rating";

function Storereview({ data }) {
  const [review, setReview] = useState([]); // 리뷰 데이터 저장
  const [imgNum, setImgNum] = useState([]); // 이미지 ID 저장 (객체 형태)
  const [likedReviews, setLikedReviews] = useState(0); // 개별 공감 상태 관리
  const [modalOpen, setModalOpen] = useState(false); // 이미지 모달
  const [selectedImgs, setSelectedImgs] = useState([]); // 이미지 배열
  const modalBackground = useRef(); // 콘텐츠 바깥 클릭 시 닫히게
  const [sort, setSort] = useState(0); // 배댓 혹은 최신

  console.log("데이터받기", data);

  useEffect(() => {
    console.log("데이터받기 2", data);

    const fetchReviews = async () => {
      try {
        console.log("storeId", data.storeId);

        const received = await axios.get(
          `http://localhost:8080/store/reviews/${data.storeId}?sort=${sort}`
        );
        console.log("데이터받기 44444", received.data);

        setReview(received.data.content);

        // 이미지 ID 변환 및 저장
        const newImgNumList = {};
        received.data.content.forEach((item) => {
          newImgNumList[item.reviewId] = item.imageIds
            ? item.imageIds.split(",")
            : [];
        });

        // console.log("가공된 이미지 리스트:", newImgNumList);
        setImgNum(newImgNumList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
  }, [data, sort]);

  // 개별 리뷰 공감 상태 토글 함수
  const toggleLike = async (reviewId) => {
    const reviewItem = review.find((r) => r.reviewId === reviewId);
    if (!reviewItem) return; // 해당 리뷰가 없으면 실행 중단

    const storeId = reviewItem.storeId; // 리뷰에 해당하는 스토어 ID 가져오기
    const updatedLikedReviews = { ...likedReviews };

    // 현재 공감 상태 반전 (0 → 1, 1 → 0)
    const isLiked = likedReviews[reviewId] ? 0 : 1;
    updatedLikedReviews[reviewId] = isLiked;

    // 공감 수 업데이트 (UI 즉시 반영)
    setReview((prevReviews) =>
      prevReviews.map((review) =>
        review.reviewId === reviewId
          ? { ...review, likeCount: review.likeCount + (isLiked ? 1 : -1) }
          : review
      )
    );

    // 프론트엔드 상태 업데이트
    setLikedReviews(updatedLikedReviews);
    localStorage.setItem("likedReviews", JSON.stringify(updatedLikedReviews));

    try {
      // 백엔드에 PATCH 요청 보내기
      await axios.patch(`http://localhost:8080/${reviewId}/like`, {
        reviewId: reviewId,
        storeId: storeId,
        isLiked: isLiked,
      });
    } catch (error) {
      console.error("공감 업데이트 실패", error);

      // 요청 실패 시 UI 상태 롤백
      setReview((prevReviews) =>
        prevReviews.map((review) =>
          review.reviewId === reviewId
            ? { ...review, likeCount: review.likeCount + (isLiked ? -1 : 1) }
            : review
        )
      );

      updatedLikedReviews[reviewId] = likedReviews[reviewId] ? 0 : 1;
      setLikedReviews(updatedLikedReviews);
      localStorage.setItem("likedReviews", JSON.stringify(updatedLikedReviews));
    }
  };

  // 컴포넌트 마운트 시 localStorage에서 공감 상태 불러오기
  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedReviews")) || {};
    setLikedReviews(storedLikes);
  }, []);

  useEffect(() => {
    console.log("업데이트된 리뷰 상태:", imgNum);
  }, [imgNum, likedReviews]);

  const openModal = (reviewId) => {
    setSelectedImgs(imgNum[reviewId]);
    setModalOpen(true);
  };

  // 추천,평점 클릭 함수
  const handleSortClick = (value) => {
    setSort(value);
  };

  return (
    <div>
      {/* 추천순, 평점순 정렬 */}
      <div className="flex items-center text-gray-400 border-t pt-4  mb-3">
        <p
          onClick={() => handleSortClick(0)}
          className={`cursor-pointer ${
            sort === 0 ? "text-blue-500 font-bold" : "text-gray-400"
          }`}
        >
          Best후기
        </p>
        ㅣ
        <p
          onClick={() => handleSortClick(1)}
          className={`cursor-pointer ${
            sort === 1 ? "text-blue-500 font-bold" : "text-gray-400"
          }`}
        >
          최신순
        </p>
      </div>
      {review.length > 0 ? (
        review.map((v, index) => (
          <div key={`review-${index}`} className="border-t pt-4">
            {/* 사용자 정보 */}
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-700 text-xl">{v.userId}</p>
              <Rating
                name="half-rating-read"
                defaultValue={v.rating}
                precision={0.5}
                readOnly
              />
            </div>

            {/* 메뉴, 가격 */}
            <p className="text-xs text-gray-400">
              {v.reviewMenu}/{v.reviewPrice}원
            </p>
            {/* 작성일 */}
            <p className="text-xs text-gray-400">{v.createdAt}초</p>

            {/* 리뷰 내용 */}
            <p className="text-xl text-gray-600 mt-2">{v.content}</p>

            {/* 이미지 */}
            <div className="flex gap-2 mt-3">
              {imgNum[v.reviewId]?.slice(0, 3).map((imgId, i) => (
                <img
                  onClick={() => openModal(v.reviewId)}
                  className="w-36 h-36 object-cover cursor-pointer"
                  key={i}
                  src={`http://localhost:8080/review/attachments/${imgId}/download`}
                  alt={`review-${imgId}`}
                />
              ))}
              {imgNum[v.reviewId]?.length > 3 && (
                <button
                  onClick={() => openModal(v.reviewId)}
                  className="right-0 bottom-0 w-36 h-36 flex justify-center items-center bg-black bg-opacity-50 text-white font-bold cursor-pointer"
                >
                  더보기
                </button>
              )}
              {modalOpen && (
                <div
                  className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
                  ref={modalBackground}
                  onClick={(e) => {
                    if (e.target === modalBackground.current) {
                      setModalOpen(false);
                      setSelectedImgs([]);
                    }
                  }}
                >
                  <div className="bg-white rounded-lg p-4 max-w-3xl max-h-[80vh] overflow-auto relative">
                    <div className="flex gap-2 overflow-x-auto">
                      {selectedImgs.map((imgId, i) => (
                        <img
                          key={i}
                          className="w-40 h-40 object-cover flex-shrink-0"
                          src={`http://localhost:8080/review/attachments/${imgId}/download`}
                          alt={`modal-review-${imgId}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 공감수 버튼 */}
            <div className="flex items-center mt-2">
              <div className="text-black text-xl">
                이 리뷰가 마음에 들으셨나요?
              </div>
              <button
                onClick={() => toggleLike(v.reviewId)}
                className={`w-20 ml-3 flex items-center px-3 py-1 border rounded-full transition-all 
    ${
      likedReviews[v.reviewId] === 1
        ? "border-red-500 text-red-500"
        : "border-gray-300 text-gray-500"
    } 
    hover:border-gray-400`}
              >
                <FaRegThumbsUp
                  className={`w-5 h-5 mr-1 ${
                    likedReviews[v.reviewId] === 1
                      ? "fill-red-500 text-white"
                      : ""
                  }`}
                />
                <span className="pl-2 text-sm">{v.likeCount}</span>
              </button>
            </div>
          </div>
        ))
      ) : (
        <span className="loading loading-spinner loading-lg"></span>
      )}
    </div>
  );
}

export default Storereview;
