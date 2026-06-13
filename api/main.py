from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import sos, chat, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SafeHer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sos.router)
app.include_router(chat.router)
app.include_router(admin.router)

@app.get("/health")
def health():
    return {"status": "ok"}