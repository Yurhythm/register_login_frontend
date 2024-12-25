export function isAuthenticated() {
    return !!localStorage.getItem("authToken");
}
export function logout() {
    localStorage.removeItem("authToken");
}