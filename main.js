let news = [];

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

    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }
      news = data.articles;
      console.log(news);

      render();
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
      <h2>
        ${item.title}
      </h2>
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
		
		
		<a href="" onClick="${getNewsByTopic(news)}" class="link_404">Go to Back</a>
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

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();

// const openNav = () => {
//   document.getElementById("mySidenav").style.width = "250px";
// };

// const closeNav = () => {
//   document.getElementById("mySidenav").style.width = "0";
// };
