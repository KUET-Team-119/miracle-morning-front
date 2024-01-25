function useQuote() {
  const quotes = [
    {
      quote: "사람들은 생각하는 대로 살지 않으면 사는 대로 생각한다.",
      author: "폴 발레리",
    },
    {
      quote: "자신감은 위대한 과업의 첫째 요건이다.",
      author: "사무엘 존슨",
    },
    {
      quote: "내일 죽을 것처럼 살라. 그리고 영원히 살 것처럼 배우라.",
      author: "마하트마 간디",
    },
    {
      quote: "위대한 사람은 목적을 가지고, 소인들은 공상을 가지고 있다.",
      author: "워싱턴 어빙",
    },
    {
      quote: "인간의 고통 속에는 무엇인가 창조의 씨앗이 숨어있다.",
      author: "이어령",
    },
    {
      quote: "최고의 경쟁력은 열정이다.",
      author: "잭 웰치",
    },
    {
      quote: "자식보다 상상력이 더욱 중요하다.",
      author: "알버트 아인슈타인",
    },
    {
      quote: "사랑 받고 싶다면 사랑하라, 그리고 사랑스럽게 행동하라.",
      author: "벤자민 프랭클린",
    },
    {
      quote: "실패란 없다. 다만 피드백만 있을 뿐이다.",
      author: "빌 게이츠",
    },
    {
      quote: "가장 현명한 사람은 늘 배우려고 노력하는 사람이다.",
      author: "괴테",
    },
    {
      quote: "남에게 이기는 방법의 하나는 예의범절로 이기는 것이다.",
      author: "조쉬 빌링스",
    },
    {
      quote:
        "나의 어느 부분도 원래부터 있었던 것이 아니다. 나는 모든 지인들의 노력의 집합체다.",
      author: "척 팔라닉",
    },
    {
      quote:
        "용기란 두려움에 대한 저항이고, 두려움의 정복이다. 두려움이 없는 게 아니다.   ",
      author: "마크 트웨인",
    },
    {
      quote: "모든 고귀한 일은 찾기 드문만큼 하기도 어렵다.",
      author: "바뤼흐 스피노자",
    },
    {
      quote:
        "나머지 인생을 설탕물이나 팔면서 보내고 싶습니까, 아니면 세상을 바꿔놓을 기회를 갖고 싶습니까?",
      author: "스티브 잡스",
    },
    {
      quote: "성공은 영원하지 않고, 실패는 치명적이지 않다.",
      author: "마이크 디트카",
    },
    {
      quote: "행복은 우리에게 건강의 근본이 되는 에너지를 준다.",
      author: "앙리 프레데릭 아미엘",
    },
    {
      quote: "기운과 끈기는 모든 것을 이겨낸다.",
      author: "벤자민 프랭클린",
    },
    {
      quote:
        "믿음이 부족하기 때문에 도전하길 두려워하는 바, 나는 스스로를 믿는다.",
      author: "무하마드 알리",
    },
    {
      quote: "이 세상에 열정없이 이루어진 위대한 것은 없다.",
      author: "게오르크 빌헬름",
    },
    {
      quote:
        "여러분이 할 수 있는 가장 큰 모험은 바로 여러분이 꿈꿔오던 삶을 사는 것입니다.",
      author: "오프라 윈프리",
    },
    {
      quote: "나는 삶에서 언제나 치열함을 추구하라고, 삶을 만끽하라고 배웠다.",
      author: "니나 베르베로바",
    },
    {
      quote: "위대한 업적은 대개 커다란 위험을 감수한 결과이다.",
      author: "헤로도토스",
    },
    {
      quote:
        "자신의 본성이 어떤 것이든 그에 충실 하라. 자신이 가진 재능의 끈을 놓아버리지 마라. 본성이 이끄는 대로 따르면 성공할 것이다.",
      author: "시드니 스미스",
    },
    {
      quote:
        "그 투쟁에서 실패할 수도 있다는 개연성 때문에 정당하다고 믿는 대의를 지지하는 데서 물러 서서는 안된다.",
      author: "게오르크 빌헬름",
    },
    {
      quote: "이 세상에 열정없이 이루어진 위대한 것은 없다.",
      author: "에이브러햄 링컨",
    },
    {
      quote: "사람을 존경하라, 그러면 그는 더 많은 일을 해 낼 것이다.",
      author: "제임스 오웰",
    },
    {
      quote:
        "자신을 믿어라. 자신의 능력을 신뢰하라. 겸손하지만 합리적인 자신감없이는 성공할 수도 행복할 수도 없다.",
      author: "노먼 빈센트 필",
    },
    {
      quote: "자능력이 부족할 수록 자만심이 더 강하다.",
      author: "아하드 하암",
    },
    {
      quote:
        "자신의 능력을 감추지 마라. 재능은 쓰라고 주어진 것이다. 그늘 속의 해시계가 무슨 소용이랴.",
      author: "벤자민 프랭클린",
    },
    {
      quote:
        "나는 중요한 슛을 놓친 결과에 절대 개의치 않는다. 그 결과에 대해 생각하면 언제나 부정적인 결과만 생각하게 된다.",
      author: "마이클 조던",
    },
    {
      quote: "세월을 헛되이 보내지 마라. 청춘은 다시 돌아오지 않는다.",
      author: "안중근",
    },
    {
      quote:
        "내 인생에 문제가 생겼다고 안타까워하거나 슬퍼하지 마세요. 이것 또한 지나갑니다. 시간이 지나면 별 것 아닌 문제였다고 얘기할 수도 있습니다.",
      author: "김수환",
    },
  ];

  const todayQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return todayQuote;
}

export default useQuote;
