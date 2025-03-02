import firebase_admin
from firebase_admin import credentials, firestore

# Load Firebase Admin Credentials
cred = credentials.Certificate("serviceAccountKey.json")

# Initialize Firebase Admin SDK
firebase_admin.initialize_app(cred)

# Get Firestore Database
db = firestore.client()

print("✅ Firestore is set up successfully!")
