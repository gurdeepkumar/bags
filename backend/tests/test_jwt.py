from app.core.jwt import (
    create_refresh_token,
    decode_refresh_token,
    create_access_token,
    decode_access_token,
    verify_access_token,
)


def test_refresh_token():
    user = "gurdeepkumar"
    refresh_token = create_refresh_token(user)
    decoded_user = decode_refresh_token(refresh_token)
    assert user == decoded_user
    assert not user == "kumar"


def test_access_token():
    user = "gurdeepkumar"
    refresh_token = create_refresh_token(user)
    access_token = create_access_token(refresh_token)
    assert True == verify_access_token(access_token, user)
    assert False == verify_access_token(access_token, "Kumar")
    decoded_user = decode_access_token(access_token)
    assert user == decoded_user
    assert not user == "kumar"
