# 행운부적 · Lucky Box

친구에게 **내 얼굴로 만든 행운부적**을 상자에 담아 선물하는 웹앱.

## 흐름
1. **행운부적을 만들어요** — 상자를 눌러 내 사진을 넣습니다.
2. **행운상자가 왔어요** — 상자를 오른쪽으로 밀면 뚜껑이 열리고 요술 램프가 튀어나옵니다.
3. **램프를 문질러봐!** — 램프를 문지르면 노란 빛과 함께 행운부적이 나타납니다.
4. **행운부적** — 네잎클로버 안에 내 얼굴이 담긴 부적을 저장·공유합니다.

## 실행
정적 사이트입니다. 아무 정적 서버로 열면 됩니다.

```bash
python3 -m http.server 8123
# http://localhost:8123
```

또는 GitHub Pages(Settings → Pages → Branch: main /root)로 배포해 바로 열 수 있습니다.

## 구성
- `index.html` · `styles.css` · `app.js`
- `image/` — 디자인 에셋(box/open box/lamp/main/네잎클로버), 효과음, `design.pen`
- `docs/MVP.md` — 기획서
