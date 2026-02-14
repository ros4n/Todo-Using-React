# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
@csrf_exempt

@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        if not request.body:
            return JsonResponse({"error": "No data provided"}, status=400)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # Validate fields
        missing_fields = []
        if not username:
            missing_fields.append("username")
        if not password:
            missing_fields.append("password")
        if missing_fields:
            return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

        # Check existing username/email
        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)
        if email and User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)

        return JsonResponse({
            "message": "User registered successfully",
            "user_id": user.id,
            "username": user.username
        }, status=201)

    except Exception as e:
        # Log the error for debugging
        return JsonResponse({"error": str(e)}, status=500)
@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({"error": "Username and password required"}, status=400)

        user = authenticate(request, username=username, password=password)
        if user is None:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        login(request, user)  # creates session
        return JsonResponse({"message": f"Logged in successfully as {user.username}"})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

@csrf_exempt
def logout_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    logout(request)  # destroys session
    return JsonResponse({"message": "Logged out successfully"})
