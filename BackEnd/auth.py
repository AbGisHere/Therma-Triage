"""
JWT-based authentication system for hospital endpoints.
Provides secure token generation and validation.
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from schemas import TokenData, UserInDB

# Security configuration
SECRET_KEY = "therma-triage-secret-key-change-in-production-2026"  # Change this in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Demo user database (in production, use a real database with proper password hashing)
fake_users_db = {
    "admin": {
        "username": "admin",
        "full_name": "System Administrator",
        "email": "admin@therma-triage.org",
        "password": "admin123",  # Plain text for demo (NEVER do this in production!)
        "role": "admin"
    },
    "hospital_staff": {
        "username": "hospital_staff",
        "full_name": "Hospital Staff",
        "email": "staff@hospital.org",
        "password": "staff123",
        "role": "hospital_staff"
    }
}


def verify_password(plain_password: str, stored_password: str) -> bool:
    """Verify a password (simplified for demo)."""
    return plain_password == stored_password


def get_user(username: str) -> Optional[dict]:
    """Get a user from the database."""
    if username in fake_users_db:
        return fake_users_db[username]
    return None


def authenticate_user(username: str, password: str) -> Optional[dict]:
    """Authenticate a user with username and password."""
    user = get_user(username)
    if not user:
        return None
    if not verify_password(password, user["password"]):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency to get the current authenticated user from the JWT token.
    Use this to protect endpoints.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user_dict = get_user(username=token_data.username)
    if user_dict is None:
        raise credentials_exception
    
    # Convert dict to User model (without password field)
    from schemas import User
    return User(
        username=user_dict["username"],
        email=user_dict.get("email"),
        full_name=user_dict.get("full_name"),
        role=user_dict["role"]
    )


async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    """
    Dependency to get the current active user.
    Can be extended to check if user is disabled/inactive.
    """
    return current_user


# Utility function to generate password hashes for new users
def generate_password_hash(password: str):
    """Helper function to generate password hashes."""
    print(f"Password hash for '{password}': {get_password_hash(password)}")


# Uncomment to generate hashes for demo users
# if __name__ == "__main__":
#     generate_password_hash("admin123")
#     generate_password_hash("staff123")
