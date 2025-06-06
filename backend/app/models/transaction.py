from sqlalchemy import Column, Integer, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(
        Integer, ForeignKey("assets.id", ondelete="CASCADE"), nullable=False
    )
    amount = Column(Numeric(20, 8), nullable=False)
    price = Column(Numeric(20, 2), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    asset = relationship("Asset", back_populates="transactions")
