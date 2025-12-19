export default function isAdminAuthenticated() {
    const token = localStorage.getItem('adminToken');
    return !!token;
}
