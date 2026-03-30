// js/firebase.js — Zero hardcoded secrets. AI keys fetched from Firestore at runtime.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ── Firebase config ───────────────────────────────────────
// NOTE: Firebase client config is NOT a secret.
// It only identifies your project — Firestore Rules protect your data.
// Real API secrets (Groq, Gemini, HF) live in Firestore, never here.
const firebaseConfig = {
    apiKey: "AIzaSyBVBQEPnYOTbkkfPKAqO6aYnVs29GSpId8",
    authDomain: "marxi-b1562.firebaseapp.com",
    projectId: "marxi-b1562",
    storageBucket: "marxi-b1562.firebasestorage.app",
    messagingSenderId: "702306346639",
    appId: "1:702306346639:web:01a30dc5f19f0751e172fa"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── Default limits (overridden by Firestore) ──────────────
export const DEFAULT_LIMITS = {
    free: { chats: 10, images: 3, websites: 2, videos: 0 },
    pro: { chats: 9999, images: 9999, websites: 9999, videos: 30 }
};

// ── Fetch AI keys from Firestore (set via Admin panel) ────
let _keys = null;
export async function getKeys() {
    if (_keys) return _keys;
    try {
        const snap = await getDoc(doc(db, "config", "keys"));
        if (snap.exists()) {
            _keys = snap.data();
            return _keys;
        }
    } catch (e) {
        console.warn("Keys fetch failed:", e);
    }
    return {};
}

// ── Load plan limits ──────────────────────────────────────
export async function getLimits() {
    try {
        const snap = await getDoc(doc(db, "config", "plans"));
        return snap.exists() ? snap.data() : DEFAULT_LIMITS;
    } catch {
        return DEFAULT_LIMITS;
    }
}

// ── Load user doc + daily reset ───────────────────────────
export async function loadUserData(uid) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data.usage?.lastReset !== new Date().toDateString()) {
        const reset = {
            chats: 0,
            images: 0,
            websites: 0,
            videos: 0,
            lastReset: new Date().toDateString()
        };
        await updateDoc(ref, { usage: reset });
        data.usage = reset;
    }
    return data;
}

// ── Increment usage counter ───────────────────────────────
export async function incrementUsage(uid, type, userData) {
    const newVal = (userData.usage?.[type] || 0) + 1;
    userData.usage[type] = newVal;
    await updateDoc(doc(db, "users", uid), { [`usage.${type}`]: newVal });
    return newVal;
}

// ── Check usage limit ─────────────────────────────────────
export function canUse(type, userData, limits) {
    const plan = userData?.plan || "free";
    const limit = limits[plan]?.[type] ?? 0;
    const used = userData?.usage?.[type] ?? 0;
    return used < limit;
}

// ── Logout ────────────────────────────────────────────────
export async function logout() {
    await signOut(auth);
    location.href = "/auth.html";
}
