import requests
import json

url = "http://localhost:8000/diaries"

def test_mood(content, expected_mood):
    response = requests.post(url, json={"content": content})
    data = response.json()
    print(f"Content: '{content}' -> Mood: {data.get('mood')} (Expected: {expected_mood})")
    if data.get("mood") == expected_mood:
        print("PASS")
    else:
        print("FAIL")

test_mood("悲しいことがあった", "negative")
test_mood("良いことがあった", "positive")
test_mood("普通の1日", "neutral")
test_mood("今日はプログラムが学べて嬉しかった", "positive")
# 新しい単語のテスト
test_mood("今日は冷たい一日だった", "negative")
test_mood("外が寒くて辛い", "negative")
test_mood("テストに合格してハッピー", "positive")
test_mood("何もやる気が起きなくてだるい", "negative")
test_mood("なんとなく一日が過ぎた", "neutral")
# 拡充した辞書のテスト
test_mood("友達と会えて幸せな気分", "positive")
test_mood("頭が痛くて具合悪い", "negative")
test_mood("美味しいご飯を食べて満足", "positive")
test_mood("一人で寂しかった", "negative")
test_mood("明日から頑張ろうと思う", "positive")
