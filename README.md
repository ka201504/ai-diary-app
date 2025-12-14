# AI Diary App

## 起動方法 (How to Start)

このアプリは、バックエンド (Python/FastAPI) とフロントエンド (Next.js) の2つのサーバーを起動する必要があります。
それぞれ別のターミナルを開いて実行してください。

### 1. バックエンド (Backend)

ルートディレクトリまたは `backend` ディレクトリで以下のコマンドを実行します。

```bash
# 仮想環境の有効化 (Windows)
.venv\Scripts\activate

# ディレクトリ移動
cd backend

# サーバー起動
uvicorn main:app --reload
```
サーバーは `http://127.0.0.1:8000` で起動します。

### 2. フロントエンド (Frontend)

別のターミナルを開き、`frontend` ディレクトリで以下のコマンドを実行します。

```bash
# ディレクトリ移動
cd frontend

# サーバー起動
npm run dev
```
ブラウザで `http://localhost:3000` にアクセスしてください。
