<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow-sm" style="width: 400px;">
        <h3 class="text-center mb-4">Login</h3>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input
              type="email"
              id="email"
              class="form-control"
              v-model="email"
              required
              placeholder="Enter your email"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              class="form-control"
              v-model="password"
              required
              placeholder="Enter your password"
            />
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              Login
            </button>
          </div>
        </form>
        <p class="text-center mt-3">
          Don't have an account yet, <RouterLink to="/register" class="text-decoration-none">Register</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      email: "",
      password: "",
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        const response = await axios.post("http://localhost:8000/api/login", {
          email: this.email,
          password: this.password,
        });

        Swal.fire({
          title: response.data.message,
          icon: (response.data.success) ? "success" : "error",
          confirmButtonText: "OK",
        });
        const token = response.data.data.access_token;

        localStorage.setItem("authToken", token);

        this.$router.push("/");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            this.errorMessage = "Unauthorized: Invalid credentials.";
            Swal.fire({
              title: error.response.data.message,
              icon: (error.response.data.success) ? "success" : "error",
              confirmButtonText: "OK",
            });
          }
        } else {
          console.error("Error:", error.message);
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>