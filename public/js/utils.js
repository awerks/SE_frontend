function saveUserInfo(userData) {
    if (!userData) return;
    for (let key in userData) {
        localStorage.setItem(key, userData[key]);
    }
}
export { saveUserInfo };