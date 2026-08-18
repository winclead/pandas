import os
import glob

# pages 폴더 내의 모든 html 파일을 찾습니다.
html_files = glob.glob("pages/*.html")

for filepath in html_files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 40개 파일 안에 숨어있는 구형 버전 꼬리표를 최신(v=6)으로 일괄 교체
    content = content.replace("style.css?v=3", "style.css?v=6")
    content = content.replace("style.css?v=4", "style.css?v=6")
    content = content.replace("style.css?v=5", "style.css?v=6")
    
    content = content.replace("main.js?v=3", "main.js?v=6")
    content = content.replace("main.js?v=4", "main.js?v=6")
    content = content.replace("main.js?v=5", "main.js?v=6")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print(f"🎉 총 {len(html_files)}개 파일의 캐시 버전이 완벽하게 업데이트되었습니다!")
