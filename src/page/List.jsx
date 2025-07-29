import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from './inc/Header';
import Star from './Star';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSearchWord } from '../api/searchApi';
import { throttle } from 'lodash';

const List = () => {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로드 완료 상태
  const [displayData, setDisplayData] = useState([]); // 보여지는 데이터
  const observerRef = useRef(null); // ref 관찰 대상
  const [touchBottom, setTouchBottom] = useState(false); // 스크롤이 끝에 닿았는지 여부
  const scrollPositionRef = useRef(null); // 스크롤 위치 저장용 ref

  const location = useLocation()
  const navigate = useNavigate()

  const searchQuery = location.state?.searchQuery // data객체안에있는 searchQuery속성(검색어가 필요할때)
  const dataFromState = location.state?.data // data객체(검색한 데이터관련 전체가 필요할때)

  const { data: cacheData } = useQuery({
    queryKey: ['resultSearchWord', searchQuery],
    queryFn: () => fetchSearchWord(searchQuery),
    // enabled: !!location.state?.data, // location.state?.data가 있을 때에만 실행
    enabled: !!searchQuery // searchQuery가 있을때만 실행
  });

  // list.jsx에서 state가 없을때의 예외처리
  useEffect(() => {
    // Header에서 새로운 검색을 하는 경우를 제외하고, 초기 접근 시에만 체크
    if (!location.state?.data && !location.state?.searchQuery && !searchQuery) {
      alert("잘못된 접근입니다. 메인 페이지로 이동합니다.")
      navigate("/", { replace: true }) // replace:true가 뒤로가기 방지
    }
  }, [location.state, navigate, searchQuery])

  // if (!location.state?.data) return null; // location.state가 없으면 렌더링하지 않음
  
  // const initialData = dataFromState || cacheData || []
  // dataFromState : 검색한 데이터 (=캐싱이 안된, 새로검색한 데이터 전부)
  // cacheData: 이전에 검색한 데이터 (=캐싱된, 이전에검색한 데이터 전부)
  const initialData = useMemo(() => { // useMemo로 감싸서 initialData의 불필요한 재계산 방지
    return dataFromState || cacheData || []
  }, [dataFromState, cacheData])

  useEffect(() => {
    if (initialData.length > 0) {
      setIsDataLoaded(true)
    }
  }, [initialData])

  // 사용자의 스크롤위치랑 페이징번호를 로컬스토리지에 저장
  useEffect(() => {
    if (isDataLoaded) {      
      const savedScrollPosition = localStorage.getItem('scrollPosition')
      const savedCurrentPage = localStorage.getItem('currentPage')
      console.log('저장된 스크롤 위치:', savedScrollPosition, '저장된 페이지:', savedCurrentPage)
      
      // 로컬스토리지에서 가져온 스크롤 위치와 현재 페이지 번호가 유효하면 그 값으로 설정
      if (savedScrollPosition !== null && !isNaN(savedScrollPosition) && savedCurrentPage !== null && !isNaN(savedCurrentPage)) {
        const scrollPosition = parseInt(savedScrollPosition, 10)
        const restoredPageNumber = parseInt(savedCurrentPage, 10)

        console.log('스크롤 복원 시도:', scrollPosition, '페이지:', restoredPageNumber)
        
        setCurrentPage(restoredPageNumber)
        setDisplayData(initialData.slice(0, restoredPageNumber * 5))

        // DOM이 업데이트된 후 스크롤 위치 복원
        setTimeout(() => {
          window.scrollTo(0, scrollPosition)
          console.log(`스크롤 위치 복원 완료: ${scrollPosition}`)
          // 복원 후 로컬스토리지 정리
          localStorage.removeItem('scrollPosition')
          localStorage.removeItem('currentPage')
        }, 100) // 시간을 줄여서 더 빠르게 복원
      } else {
        console.log('저장된 스크롤 정보가 없어서 처음부터 표시')
        setDisplayData(initialData.slice(0, 5))
        window.scrollTo(0, 0) // 리스트상단 검색영역에서 검색어 입력시에 스크롤top 0으로
      }
    }
  }, [isDataLoaded, initialData])

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (observerRef.current) {
        const { top } = observerRef.current.getBoundingClientRect();

        if (top <= window.innerHeight && !touchBottom) {
          console.log(`스크롤이 화면 끝에 닿았음`)
          setCurrentPage((prev) => prev + 1)
          setTouchBottom(true)
        }

        if (top > window.innerHeight && touchBottom) {
          setTouchBottom(false)
        }
      }
    },200) // 200ms마다 한번만 실행되게 쓰로틀 적용
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [touchBottom])

  useEffect(() => {
    if (currentPage === 1) return

    const loadMoreData = () => {
      const start = (currentPage - 1) * 5
      const end = currentPage * 5
      const slicedData = initialData.slice(start, end)
      setDisplayData((prev) => [...prev, ...slicedData])
    }

    loadMoreData()
  }, [currentPage, initialData])

  // 캐시가 없으면 검색 결과를 반영
  useEffect(() => {
    if (!cacheData && dataFromState) {
      setDisplayData(dataFromState.slice(0, 5));
    }
  }, [cacheData, dataFromState])

console.log(`displayData = ${JSON.stringify(displayData)}`);

// 새로운검색결과가 오면 initialData업데이트
  useEffect(() => {
    if (dataFromState) {
      setDisplayData(dataFromState.slice(0, 5)) // 처음 5개만 표시
      setCurrentPage(1) // 페이지 초기화
    }
  }, [initialData, dataFromState])

 // 검색어가 바뀔 때 로컬스토리지 초기화 (새로운 검색일 때만)
  useEffect(() => {
    // 새로운 검색어로 검색할 때만 초기화
    if (searchQuery && searchQuery !== location.state?.searchQuery) {
      localStorage.removeItem('scrollPosition')
      localStorage.removeItem('currentPage')
      setCurrentPage(1)
      setDisplayData([])
      scrollPositionRef.current = null
    }
  }, [searchQuery, location.state?.searchQuery])

  const onDetail = (idx, item) => {
    const scrollPosition = window.scrollY
    console.log('스크롤 위치 저장:', scrollPosition, '현재 페이지:', currentPage)
    localStorage.setItem('scrollPosition', scrollPosition.toString())
    localStorage.setItem('currentPage', currentPage.toString())

    navigate(`/detail`, {
      state: { idx, item }
    })
  }

console.log('dataFromState:', dataFromState);
console.log('searchQuery:', searchQuery);
console.log('cacheData:', cacheData);
console.log('initialData:', initialData);
console.log('location.state:', location.state);
  return (
    <>
      <Header />
      <div className="box-wrap">
        {displayData.map((item, idx) => (
          <div className="box" key={idx} onClick={() => onDetail(idx, item)}>
            <div className="top">
              <div className="left">
                <img src={item.artworkUrl60} alt={item.trackName} />
                <div className="center">
                  <span className="title">{item.trackName}</span>
                  <span className="genre">{item.primaryGenreName}</span>
                </div>
              </div>
              <div className="right">
                <button type="button">받기</button>
              </div>
            </div>
            <div className="middle">
              <Star item={item} />
            </div>
            <div className="bottom">
              <ul className="imgbox">
                {item.screenshotUrls.slice(0, 3).map((url, idx) => (
                  <li key={idx}><img src={url} alt="" /></li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        <div id="observer" ref={observerRef} style={{ height: '50px', backgroundColor: 'transparent' }}></div>
      </div>
    </>
  );
};

export default List;
