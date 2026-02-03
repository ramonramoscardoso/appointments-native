# 📱 Appointments App — React Native (Study Project)

Simple app to relearn React Native.  
The user types a name and adds it to an appointments list.

---

## 🚀 Project Goal

Practice basic React Native concepts:

- useState
- TextInput
- Buttons and events
- List rendering
- State manipulation with arrays
- Local persistence (AsyncStorage)

---

## GraphQL API

The GraphQL API for this project is available in a separate repository:

**🔗 [graphql-appointments](https://github.com/ramonramoscardoso/graphql-appointments)**

### Setup

1. Clone the API repository:

```bash
git clone https://github.com/ramonramoscardoso/graphql-appointments.git
cd graphql-appointments
```

2. Install dependencies and follow the instructions in the API repository's README to set up the environment

3. Start the GraphQL server locally

4. Configure the API URL in your React Native app:
   - Create a `.env` file in the project root
   - Add the environment variable pointing to the API:

```
   EXPO_PUBLIC_API_URL=http://localhost:4000/graphql
```

(Adjust the port according to your setup)

### Documentation

Check the API repository for more information about:

- Available GraphQL schema
- Supported Queries and Mutations
- Authentication and authorization
- Usage examples

---

## 🧱 PHASE 1 — Basic Structure

**Goal:** Be able to type a name and capture the value.

- [x] Create project (preference: Expo)
- [x] Clear initial screen
- [x] Create `name` state
- [x] Create `TextInput` for the name
- [x] Create **Add** button
- [x] On button click → `console.log(name)`

---

## 📋 PHASE 2 — Appointments List

**Goal:** Display added names on screen.

- [x] Create `appointments` state (array)
- [x] When clicking **Add**:
  - [x] Validate that name is not empty
  - [x] Add name to the list
  - [x] Clear the input
- [x] Display list using **FlatList**

---

## ❌ PHASE 3 — Remove Appointment

**Goal:** Allow deleting items from the list.

- [ ] Create `removeAppointment(index)` function
- [ ] Add **Remove** button to each item
- [ ] Update state by removing the clicked item

---

## ✏️ PHASE 4 — UX Improvements

- [ ] Don't allow adding empty name
- [ ] Show alert if empty
- [ ] Close keyboard when adding
- [ ] Disable button if input is empty

---

## 🎨 PHASE 5 — Styling

- [x] Create `StyleSheet`
- [x] Spacing between elements
- [x] Style list items as cards
- [x] Button with custom color
- [x] Larger font for names
