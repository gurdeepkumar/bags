from app.core.security import hash_password, verify_password


# Password hash test
def test_password_hashing():
    pw = "secure123"
    hashed = hash_password(pw)
    assert verify_password(pw, hashed)
    assert not verify_password("wrongpass", hashed)
