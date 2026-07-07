# Public profile endpoint — no auth required to VIEW someone's profile.
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.session import CodingSession
from app.schemas.session import SessionOut
from app.schemas.user import UserPublic
from app.services.auth import get_user_by_username

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/{username}", response_model=dict)
def get_public_profile(username: str, db: Session = Depends(get_db)):
    """
    Returns a user's public profile.
    Only works if the user has is_public set to true.
    """
    user = get_user_by_username(db, username)
    if not user or not user.is_public:
        raise HTTPException(status_code=404, detail="Profile not found")

    sessions = (
        db.query(CodingSession)
        .filter(CodingSession.user_id == user.id)
        .order_by(CodingSession.logged_at.desc())
        .limit(50)  # last 50 sessions is plenty for the public view
        .all()
    )

    total_hours = sum(s.hours for s in sessions)

    return {
        "username": user.username,
        "member_since": user.created_at,
        "total_hours": total_hours,
        "total_sessions": len(sessions),
        "recent_sessions": [SessionOut.model_validate(s) for s in sessions[:10]],
    }