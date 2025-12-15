from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# フロントエンド(Next.js)からのアクセスを許可する設定
app.add_middleware(
    CORSMiddleware,
    # ↓ 修正後のallow_origins
    allow_origins=[
        "http://localhost:3000",
        "https://ai-diary-app-plum.vercel.app",  # Vercelの公開URL
        # 必要であれば、あなたのVercelのドメインをここに追加
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
# データベースの準備
conn = sqlite3.connect("diary.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS diaries (id INTEGER PRIMARY KEY, content TEXT, mood TEXT)")
conn.commit()
# データを受け取るための型（封筒）
class DiaryEntry(BaseModel):
   content: str
# 簡易的なAI判定ロジック
def analyze_mood(text):
    # 活用形もカバーするために、語幹やバリエーションを追加
    # 判定辞書を大幅に拡充
    positive_words = [
        # 喜び・楽しさ
        "嬉し", "楽し", "わーい", "やった", "ワクワク", "ウキウキ", "ハッピー",
        # 好意・愛情
        "好き", "すき", "大好き", "愛", "素敵", "可愛", "かわいい", "いとおしい",
        # 満足・充実
        "満足", "充実", "最高", "素晴らしい", "完璧", "良", "いい", "よかった",
        # 成功・達成
        "成功", "できた", "達成", "勝った", "クリア", "合格", "上手", "優勝",
        # 感謝・ポジティブ感情
        "ありがとう", "感謝", "感動", "感激", "幸せ", "しあわせ",
        # 安心・癒やし
        "安心", "ほっと", "癒", "リラックス", "平和", "穏やか", "落ち着",
        # 元気・快調
        "元気", "快調", "調子いい", "回復", "健康", "爽快", "スッキリ",
        # その他ポジティブ
        "ラッキー", "運がいい", "美味", "おいしい", "綺麗", "美しい", "明るい",
        "前向き", "希望", "夢", "楽観", "プラス", "ポジティブ", "頑張", "やる気"
    ]
    
    negative_words = [
        # 悲しみ・落ち込み
        "悲し", "泣", "涙", "落ち込", "憂鬱", "ゆううつ", "沈", "ブルー",
        # 辛さ・苦しさ
        "辛", "つらい", "苦しい", "きつい", "しんどい", "キツイ",
        # 怒り・イライラ
        "怒", "イライラ", "ムカつく", "むかつく", "腹立", "ストレス",
        # 不安・心配
        "不安", "心配", "怖", "恐", "緊張", "焦", "ドキドキ",
        # 嫌悪・拒否
        "嫌", "いや", "ダメ", "無理", "最悪", "ひどい", "酷い",
        # 孤独・寂しさ
        "孤独", "寂し", "さみしい", "独り", "ひとり", "孤立",
        # 疲労・体調不良
        "疲れ", "だるい", "しんどい", "眠い", "痛い", "痛", "具合悪",
        # 寒さ・冷たさ
        "寒い", "冷たい", "凍", "冷え", "寒",
        # 失敗・残念
        "失敗", "負けた", "残念", "がっかり", "ショック", "挫折",
        # その他ネガティブ
        "悪", "面倒", "めんどう", "退屈", "つまらない", "虚しい", "空しい",
        "絶望", "後悔", "罪悪感", "申し訳", "すまない", "辞め", "やめ"
    ]
   
    if any(word in text for word in positive_words):
        return "positive"
    if any(word in text for word in negative_words):
        return "negative"
    return "neutral"
# ■ API 1: 日記を書く (POST)
@app.post("/diaries")
def create_diary(entry: DiaryEntry):
   mood = analyze_mood(entry.content)
   cursor.execute("INSERT INTO diaries (content, mood) VALUES (?, ?)", (entry.content, mood))
   conn.commit()
   return {"message": "保存しました！", "mood": mood}
# ■ API 2: 日記を読む (GET)
@app.get("/diaries")
def get_diaries():
   cursor.execute("SELECT * FROM diaries ORDER BY id DESC")
   rows = cursor.fetchall()
   return [{"id": row[0], "content": row[1], "mood": row[2]} for row in rows]