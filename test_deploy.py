import urllib.request, json

req = urllib.request.Request(
    'http://localhost:8000/api/deploy',
    data=json.dumps({"token": "bhb_sess_auth"}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as resp:
        print("STATUS:", resp.status)
        print("RESPONSE:", resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code, e.read().decode('utf-8'))
