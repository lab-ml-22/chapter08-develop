![431680273-039a01ed-3b56-4e09-aa28-75e46b716bcc](https://github.com/user-attachments/assets/81ca9bc3-dcfa-4392-871f-c633f1590bfb)
<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://camo.githubusercontent.com/f538d9a749f7c49325cb8264739fecac0280f8ff1375937e7095737ef97d9048/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d526561637425323051756572792d4646343135343f7374796c653d666f722d7468652d6261646765266c6f676f3d72656163742532307175657279266c6f676f436f6c6f723d7768697465">
  <br>
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white">
  <img src="https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white">
  <br>
  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">
  <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white">
</p>
<br>
<p align="center">
   <h1><strong>React-appStore 프로젝트</strong>🛒</h1>

  <ul>
    <li><span>목표: Apple appStore API활용하여, 앱스토어를 웹버전으로 만들기</span></li>
    <li><span>기술스택: react, react-query, scss, axios, firebaseHosting</li>
    <li><span>배포링크: https://chapter08-develop.vercel.app/</span></li>
    <li>
      <span>주요기능</span>
      <ol>
        <li>queryCache</li>
        <li>검색</li>
        <li>상세</li>
        <li>infinite Scroll (INF)</li>
        <li>INF이벤트 시 throttle</li>
      </ol>
    </li>
  </ul>

  <h2>ISSUE</h2>
  <ul>
    <li>
      <span>1). 2025-07-29(화): 오류들에 대한 수정사항</span>
      <ol>
        <li>
          <span>브라우저에서 모바일에뮬레이터로 볼 때, 아이튠즈api 호출이 안되던 오류</span>
          <p>원인: 프록시 설정오류, API서버 경로 불일치</p>
          <p>해결방법: 프록시 설정 수정, API서버에 경로추가, Express서버 생성</p>
        </li>
        <li>
          <span>HTML 응답 반환문제(json이 아니라, html로 응답이 떨어짐)</span>
          <p>원인: API요청이 아이튠즈api로 전달안되고 react앱의 index.html을 반환, 프록시가 올바른 api서버로 요청을 전달 못함</p>
          <p>해결방법: api서버를 포트 3002에서 실행시켜서 프록시 설정을 수정, 아이튠즈api 호출시도는 cors오류로 실패되서 로컬프록시를 사용</p>
        </li>
        <li>
          <span>header컴포넌트에서 검색 시 '잘못된 경로' 라는 alert오류 뱉어냄</span>
          <p>원인: list.jsx에서 location.state가 없으면 메인페이지로 이동하는 예외처리 로직,  header에서 새로운검색을 하면 location.state가 초기화 되서 오류발생</p>
          <p>해결방법: location.date가 없거나, location.state에 searchQuery가 없거나 그리고 현재 검색어가 없음이라는 조건을 추가(총3가지 조건)</p>
        </li>
        <li>
          <span>스크롤 위치 복원 안됨</span>
          <p>원인: dom업데이트 전에 스크롤 복원시도, 데이터의 타입문제(로컬스토리지에 숫자를 문자열로 저장하지 않았음)</p>
          <p>해결방법: 새로운검색어 일때만 로컬스토리지 초기화, setTimeout을 이용해서 시간을 300ms에서 100ms로 타이밍개선, toString()메서드로 문자열 반환해서 데이터타입 통일</p>
        </li>
      </ol>
    </li>
    <li><span>2). 2025-03-26(수): appStore API의 CORS 이슈 -> cors이슈와 더불어 user-agent영향도 있음을 확인 -> 서버 프록시로 우회하기로 결정</li>
    <li><span>3). 2025-04-08(화): 모바일 에뮬레이터에서 itunesSearchAPI활용 시, user-agent에 따른 apple api응답차이로 인한 빈배열 발생 -> soultion 진행중(1번,2번 둘다 수정하여 진행중)</li>
    <li><span>4). 2025-04-08(화): 크롬 모바일 에뮬레이터가 아닌 상태로 브라우저 크기만 줄여서 볼때는 위에 적은 2가지 이슈 없이 빈배열에 대한 오류 없음(결국, 서버를 통해 중계가 필요하다)</li>
  </ul>
