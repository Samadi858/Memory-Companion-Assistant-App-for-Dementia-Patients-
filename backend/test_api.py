import requests
import json

BASE_URL = "http://localhost:8000/reminders"

def test_crud():
    # 1. Create a reminder
    new_reminder = {
        "time": "10:00 AM",
        "activity": "Test Activity",
        "icon": "🧪"
    }
    response = requests.post(BASE_URL + "/", json=new_reminder)
    print(f"Create Status: {response.status_code}")
    print(f"Create Response: {response.json()}")
    assert response.status_code == 200
    reminder_id = response.json()["id"]

    # 2. Get all reminders
    response = requests.get(BASE_URL + "/")
    print(f"Get All Status: {response.status_code}")
    assert response.status_code == 200
    assert len(response.json()) > 0

    # 3. Get single reminder
    response = requests.get(f"{BASE_URL}/{reminder_id}")
    print(f"Get One Status: {response.status_code}")
    assert response.status_code == 200
    assert response.json()["activity"] == "Test Activity"

    # 4. Update reminder
    update_data = {"activity": "Updated Activity"}
    response = requests.put(f"{BASE_URL}/{reminder_id}", json=update_data)
    print(f"Update Status: {response.status_code}")
    assert response.status_code == 200
    assert response.json()["activity"] == "Updated Activity"

    # 5. Delete reminder
    response = requests.delete(f"{BASE_URL}/{reminder_id}")
    print(f"Delete Status: {response.status_code}")
    assert response.status_code == 200
    
    # 6. Verify deletion
    response = requests.get(f"{BASE_URL}/{reminder_id}")
    print(f"Get Deleted Status: {response.status_code}")
    assert response.status_code == 404

    print("✅ All CRUD tests passed!")

if __name__ == "__main__":
    test_crud()
