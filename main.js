let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("search-button");
let url;

// 각 함수에서 필요한 url을 만든다
// api 호출 함수를 부른다

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "3A_4IzBS_nAdTsnC9sYcaYQRj1Bcr6rwrDMLFO6OyGI",
    });
    url.searchParams.set("page", page);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }
      console.log("data : ", data);
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      console.log("news : ", news);

      render();

      pageNation();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("Error : ", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=news&page_size=10`
  );

  getNews();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`
  );

  getNews();
};

const getNewsByKeyword = async () => {
  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );

  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
    <div class="col-lg-4">
      <img
        class="news-img-size"
        src="${
          item.media ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
        }"
      />
    </div>
    <div class="col-lg-8">
      <a class="title" target="_blank" href="${item.link}">${item.title}</a>
      <p>
        ${
          item.summary == null || item.summary == ""
            ? "내용없음"
            : item.summary.length > 200
            ? item.summary.substring(0, 200) + "..."
            : item.summary
        }
      </p>
      <div>${item.clean_url || "no source"} ${moment(
        item.published_date
      ).fromNow()}</div>
    </div>
  </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

const errorRender = (message) => {
  let errorHTML = `<section class="page_404">
	<div class="container">
		<div class="row">	
		<div class="col-sm-12 ">
		<div class="col-sm-10 col-sm-offset-1 text-center">
		<div class="four_zero_four_bg">
			<h1 class="text-center "></h1>
		</div>		
		<div class="contant_box_404">	
		<a href="" onClick="${getNewsByTopic(news)}" class="link_404">Go to Home</a>
	</div>
		</div>
		</div>
		</div>
	</div>
</section>

<div class="alert alert-danger text-center" role="alert">
  ${message}
  </div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const pageNation = () => {
  let pagenationHTML = "";
  // total_pages
  // page
  //page group
  let pageGroup = Math.ceil(page / 5);
  // last
  let last = pageGroup * 5;
  // first
  let first = last - 4;
  // first ~ last

  // total page 3일 경우 3개의 페이지만 프린트 하는 법

  // << >> 버튼 만들기

  pagenationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onClick="moveToPage(${
    page - 1
  })">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;

  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onClick="moveToPage(${i})">${i}</a></li>`;
  }

  pagenationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onClick="moveToPage(${
    page + 1
  })">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>`;

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
  // 1 이동하고 싶은 페이지를 알아야함
  page = pageNum;
  // 2 이동하고 싶은 페이지를 가지고 api 다시 호출
  getNews();
};

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};
