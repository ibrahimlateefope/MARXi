// js/shell.js — App shell: sidebar, mobile nav, toast, user UI

import { auth, db, logout, loadUserData, getLimits } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// ── Toast ─────────────────────────────────────────────────
export function toast(msg, type = "success") {
    let el = document.getElementById("toast");
    if (!el) {
        el = document.createElement("div");
        el.id = "toast";
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = type === "error" ? "error" : "";
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 3200);
}

// ── Sidebar collapse (desktop) ────────────────────────────
export function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("sidebarToggle");
    const menuBtn = document.getElementById("menuBtn");
    const overlay = document.getElementById("overlay");

    // Load saved state
    if (localStorage.getItem("sidebarCollapsed") === "true") {
        sidebar?.classList.add("collapsed");
    }

    toggleBtn?.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        localStorage.setItem(
            "sidebarCollapsed",
            sidebar.classList.contains("collapsed")
        );
    });

    // Mobile drawer
    menuBtn?.addEventListener("click", () => {
        sidebar.classList.add("mobile-open");
        overlay.classList.add("open");
    });
    overlay?.addEventListener("click", () => {
        sidebar.classList.remove("mobile-open");
        overlay.classList.remove("open");
    });
}

// ── Mark active nav item ──────────────────────────────────
export function setActiveNav(page) {
    document.querySelectorAll(".nav-item, .tab-item").forEach(el => {
        el.classList.toggle("active", el.dataset.page === page);
    });
}

// ── Load & render user info ───────────────────────────────
export async function initShell(currentPage) {
    initSidebar();
    setActiveNav(currentPage);

    return new Promise(resolve => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
        unsubscribe(); // ← stop listening after first fire
        if (!user) { location.href = "../auth.html"; return; }

        const userData = await loadUserData(user.uid);
        const limits   = await getLimits();

        if (!userData) { location.href = "../auth.html"; return; }

        // ... rest of your existing code unchanged ...
        resolve({ user, userData, limits });
    });
    });
}

export function updateUsagePill(userData, limits) {
    const pill = document.getElementById("usagePill");
    if (!pill || !userData) return;
    const plan = userData.plan || "free";
    const u = userData.usage || {};
    const l = limits[plan] || {};
    pill.textContent = `Chats ${u.chats || 0}/${l.chats} · Images ${u.images || 0}/${l.images}`;
    const warn =
        plan === "free" &&
        ((u.chats || 0) >= (l.chats || 0) - 1 ||
            (u.images || 0) >= (l.images || 0) - 1);
    pill.classList.toggle("warn", warn);
}
