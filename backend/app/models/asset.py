from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    func,
    Float,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from app.db.base import Base


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    coin_symbol = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="assets")
    transactions = relationship(
        "Transaction", back_populates="asset", cascade="all, delete"
    )
    __table_args__ = (UniqueConstraint("user_id", "coin_symbol", name="_user_coin_uc"),)
