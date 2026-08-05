// ============================================================
// FIREBASE CONFIGURATION — e-Safe Platform (Cissy Technologies)
// Backend: Firebase Authentication + Realtime Database.
// This project does NOT use Firestore — Firestore requires a
// billing-enabled project; Realtime Database is free on the Spark plan.
// ============================================================
// SETUP INSTRUCTIONS
//
// 1. In the Firebase console (console.firebase.google.com), open this
//    project and confirm the values below match Project Settings > General
//    > Your apps > SDK setup and configuration.
//
// 2. Build > Authentication > Sign-in method > enable Email/Password.
//
// 3. Build > Realtime Database > Create database if you haven't already
//    (this project's database lives at the databaseURL below). Choose
//    "Start in locked mode", then open the Rules tab and publish the
//    rules shown at the bottom of this file, swapping in your real
//    admin email. This step is REQUIRED — without it, the database is
//    either fully locked (nothing works) or fully open (anyone can read
//    or overwrite every user's record).
//
// 4. Set ADMIN_EMAIL below to the real email address that should have
//    access to admin.html. That person still registers/signs in like
//    any other employee — this constant just grants that one account
//    admin access. Use the exact same address in the rules in step 3.
//
// 5. Upload this file to the same folder as index.html. Every page that
//    needs Firebase loads it, so it must be present at the site root.
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCHA5hNoTOiVbebrvVYnlASQTeoYNTgXs8",
  authDomain: "esafe-cissy.firebaseapp.com",
  databaseURL: "https://esafe-cissy-default-rtdb.firebaseio.com",
  projectId: "esafe-cissy",
  storageBucket: "esafe-cissy.firebasestorage.app",
  messagingSenderId: "794580293560",
  appId: "1:794580293560:web:e3e952d526bd811efde14d"
};

// The only account allowed to view admin.html.
// Must exactly match the email address used to sign in as the admin.
const ADMIN_EMAIL = "admin@cissytechnologies.com";

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

/* ============================================================
   REALTIME DATABASE SECURITY RULES
   Paste into: Firebase Console > Realtime Database > Rules > Publish
   Replace admin@cissytechnologies.com with your real ADMIN_EMAIL.
   ============================================================

{
  "rules": {
    "users": {
      ".read": "auth != null && auth.token.email === 'admin@cissytechnologies.com'",
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && (auth.uid === $uid || auth.token.email === 'admin@cissytechnologies.com')"
      }
    }
  }
}

   What this does:
   - An employee can read and write only their own record (users/{their uid}).
   - The admin account can read every record under users/ (for admin.html)
     and can also write any record (needed by seed.html).
   - Everyone else is denied.

   IMPORTANT for seed.html: it writes records under email-derived keys,
   not real Auth uids, and does not sign anyone in. Under these rules that
   write only succeeds while the browser already has an active admin
   session (i.e. you are signed in as ADMIN_EMAIL in that browser tab).
   Sign in at signin.html with the admin account first, then run seed.html.
   ============================================================ */
