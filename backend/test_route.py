import requests

# minimal pdf
pdf_bytes = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [ 3 0 R ] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [ 0 0 612 792 ] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 0 >>\nstream\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000216 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n266\n%%EOF"

# Need Auth token...
# I can just try without auth and see if it returns 401
try:
    resp = requests.post("http://localhost:5000/parse", files={"file": ("dummy.pdf", pdf_bytes, "application/pdf")})
    print("STATUS:", resp.status_code)
    print("TEXT:", resp.text)
except Exception as e:
    print("ERROR:", e)
