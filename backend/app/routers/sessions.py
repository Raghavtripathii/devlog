# routers/sessions.py
# CRUD for coding sessions. All endpoints require a valid JWT token.

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.session import CodingSession
from app.models.user import User
from app.schemas.session import SessionCreate, SessionOut
from app.services.deps import get_current_user

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("/", response_model=SessionOut, status_code=201)
def create_session(
    payload: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Log a new coding session for the logged-in user."""
    session = CodingSession(**payload.model_dump(), user_id=current_user.id)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/", response_model=List[SessionOut])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all sessions for the logged-in user, newest first."""
    return (
        db.query(CodingSession)
        .filter(CodingSession.user_id == current_user.id)
        .order_by(CodingSession.logged_at.desc())
        .all()
    )


@router.delete("/{session_id}", status_code=204)
def delete_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a session. Only the owner can delete their own sessions."""
    session = (
        db.query(CodingSession)
        .filter(CodingSession.id == session_id, CodingSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()