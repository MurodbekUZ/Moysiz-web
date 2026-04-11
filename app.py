from flask import Flask, render_template, request, redirect, url_for, session, jsonify, send_file
import os
import io
import datetime

app = Flask(__name__)
app.secret_key = "moysiz_ultra_secret_key"

# --- Mock Data ---
MOCK_STATS = {
    "total_users": 15420,
    "total_services": 852,
    "total_vehicles": 12890,
    "total_logs": 42150
}

MOCK_REGIONS = [
    ("Toshkent shahri", 4500),
    ("Samarqand viloyati", 2100),
    ("Farg'ona viloyati", 1850),
    ("Namangan viloyati", 1600),
    ("Andijon viloyati", 1400),
    ("Buxoro viloyati", 950),
    ("Qashqadaryo viloyati", 800),
    ("Navoiy viloyati", 700),
    ("Xorazm viloyati", 600),
    ("Surxondaryo viloyati", 420)
]

MOCK_MONTHLY = [
    {"month": "Apr 2025", "count": 800},
    {"month": "May 2025", "count": 1200},
    {"month": "Jun 2025", "count": 1500},
    {"month": "Jul 2025", "count": 1800},
    {"month": "Aug 2025", "count": 2200},
    {"month": "Sep 2025", "count": 2800},
    {"month": "Oct 2025", "count": 3500},
    {"month": "Nov 2025", "count": 4200},
    {"month": "Dec 2025", "count": 5100},
    {"month": "Jan 2026", "count": 6500},
    {"month": "Feb 2026", "count": 8200},
    {"month": "Mar 2026", "count": 10500}
]

MOCK_TOP_SERVICES = [
    {"name": "MoyServis Pro", "region": "Samarqand", "count": 1245, "rating": 4.9, "phone": "90 123 45 67"},
    {"name": "AvtoLider", "region": "Toshkent", "count": 1120, "rating": 4.8, "phone": "94 555 00 11"},
    {"name": "Mega Oil", "region": "Farg'ona", "count": 980, "rating": 4.7, "phone": "99 888 77 00"},
    {"name": "Gold Service", "region": "Buxoro", "count": 850, "rating": 4.9, "phone": "91 444 33 22"},
    {"name": "Smart Oil", "region": "Namangan", "count": 720, "rating": 4.6, "phone": "90 999 00 99"}
]

# --- Auth Decorator ---
def require_admin(f):
    def decorated(*args, **kwargs):
        if not session.get("is_admin"):
            return redirect(url_for("login", next=request.path))
        return f(*args, **kwargs)
    decorated.__name__ = f.__name__
    return decorated

# --- Routes ---

@app.route("/")
def landing():
    return render_template("landing.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        token = request.form.get("token")
        # In a real app, check against database/config
        if token == "admin123":
            session["is_admin"] = True
            next_page = request.args.get("next")
            return redirect(next_page or url_for("dashboard"))
        return render_template("login.html", error="Noto'g'ri kirish kaliti!")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("landing"))

@app.route("/dashboard")
@require_admin
def dashboard():
    return render_template("dashboard.html", 
                           stats=MOCK_STATS, 
                           regions=MOCK_REGIONS, 
                           monthly=MOCK_MONTHLY, 
                           top_services=MOCK_TOP_SERVICES)

@app.route("/search", methods=["GET", "POST"])
@require_admin
def search():
    plate = None
    results = None
    if request.method == "POST":
        plate = request.form.get("plate", "").upper().strip()
        # Mock search result
        if plate in ["90 Q123AA", "90Q123AA", "01 A777BA", "01A777BA"]:
            results = {
                "vehicle": {
                    "plate_number": plate,
                    "current_mileage": "82 094",
                    "oil_brand": "Castrol Edge 5W-30",
                    "last_change_date": "02.01.2026",
                    "last_change_mileage": "72 000",
                    "next_change_km": "82 000"
                },
                "owner": {
                    "name": "Akmal Yusupov",
                    "phone": "+998 90 111 22 33",
                    "region": "Toshkent",
                    "district": "Chilonzor",
                    "created_at": "15.10.2025",
                    "telegram_id": "12345678"
                },
                "oil_percent": 78,
                "status_color": "#10b981", # Success
                "status_text": "Vaqtida almashtirilgan",
                "history": [
                    {"date": "02.01.2026", "mileage": "72 000", "oil_brand": "Castrol", "service_name": "AvtoLider", "next_change": "82 000"},
                    {"date": "15.08.2025", "mileage": "62 000", "oil_brand": "Shell", "service_name": "MoyServis", "next_change": "72 000"}
                ]
            }
    return render_template("search.html", plate=plate, results=results, stats=MOCK_STATS)

@app.route("/users")
@require_admin
def users():
    return render_template("users.html", stats=MOCK_STATS, regions=MOCK_REGIONS)

@app.route("/services-list")
@require_admin
def services_list():
    return render_template("services.html", stats=MOCK_STATS, top_services=MOCK_TOP_SERVICES, regions=MOCK_REGIONS)

@app.route("/logs-history")
@require_admin
def logs_history():
    return render_template("logs.html", stats=MOCK_STATS, regions=MOCK_REGIONS)

@app.route("/broadcasts")
@require_admin
def broadcasts():
    return render_template("broadcasts.html", stats=MOCK_STATS)

@app.route("/miniapp")
def miniapp():
    return render_template("miniapp.html")

@app.route("/api/ocr", methods=["POST"])
def api_ocr():
    # Mock OCR response
    return jsonify({
        "status": "success",
        "mileage": "82 094",
        "confidence": 0.96
    })

@app.route("/health")
def health():
    return jsonify({"status": "healthy", "timestamp": datetime.datetime.now().isoformat()})

@app.route("/export/users")
@require_admin
def export_users():
    # Simulate Excel file generation
    return "Excel export of users would be here", 200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=users_export.xlsx'
    }

@app.route("/export/logs")
@require_admin
def export_logs():
    return "Excel export of logs would be here", 200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=logs_export.xlsx'
    }

if __name__ == "__main__":
    app.run(debug=True, port=5000)
