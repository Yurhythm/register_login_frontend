<template>
    <main>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold" href="#">KoffieSoftPOS</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#posNavbar"
                    aria-controls="posNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="posNavbar">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item"><router-link class="nav-link" to="/" exact-active-class="active">Penjualan</router-link></li>
                        <li class="nav-item"><router-link class="nav-link" to="/transaksi" exact-active-class="active">Transaksi</router-link></li>
                        <li class="nav-item"><router-link class="nav-link" to="/produk" exact-active-class="active">Master Produk</router-link></li>
                        <li class="nav-item"><router-link class="nav-link" to="/customer" exact-active-class="active">Master Customer</router-link>
                        </li>
                    </ul>
                    <span class="navbar-text text-white">
                        <button @click="logoutUser" class="btn btn-danger">Logout</button>
                    </span>
                </div>
            </div>
        </nav>

        <router-view />
    </main>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { logout } from "../../utils/auth";

export default {
    name: "MainLayout",
    methods: {
        async logoutUser() {
            Swal.fire({
                title: "Are you sure?",
                text: "You will be logged out!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, logout!",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const token = localStorage.getItem("authToken");
                    await axios.post("http://localhost:8000/api/logout",
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    logout();
                    this.$router.push("/login");
                }
            });
        }
    }
};
</script>

<style scoped>
.navbar-nav .nav-link.active {
    font-weight: bold;
}
</style>