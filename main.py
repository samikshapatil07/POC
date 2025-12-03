from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import models
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],       # allows GET, POST, OPTIONS, PUT, DELETE
    allow_headers=["*"],       # allows JSON headers
)


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------- Pydantic Schema -----------
class UserSchema(BaseModel):
    name: str
    dob: str
    email: str
    phone: str
    technical_domain: str

# ----------- API: POST (Create User) -----------
@app.post("/users")
def create_user(user: UserSchema, db: Session = Depends(get_db)):
    new_user = models.User(
        name=user.name,
        dob=user.dob,
        email=user.email,
        phone=user.phone,
        technical_domain=user.technical_domain
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "user": user}

# ----------- API: GET (All Users) -----------
@app.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

# ----------- API: GET (Users by Domain) -----------
@app.get("/users/domain/{domain}")
def get_users_by_domain(domain: str, db: Session = Depends(get_db)):
    users = db.query(models.User).filter(models.User.technical_domain == domain).all()
    return users
