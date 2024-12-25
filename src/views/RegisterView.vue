<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const errors = ref({});
const router = useRouter();

const register = async () => {
  errors.value = {};

  try {
    const response = await axios.post("http://localhost:8000/api/register", {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });

    console.log("Registration successful:", response.data);

    Swal.fire({
        title: response.data.message,
        icon: (response.data.success) ? "success" : "error",
        confirmButtonText: "OK",
    });

    router.push("/login");
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors;
    } else {
      console.error("An error occurred:", error.message);
    }
  }
};
</script>

<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow-sm" style="width: 400px;">
        <h3 class="text-center mb-4">Register</h3>
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input
              type="text"
              id="name"
              class="form-control"
              v-model="name"
              required
              placeholder="Enter your name"
            />
            <div v-if="errors.name" class="text-danger mt-1">
              {{ errors.name[0] }}
            </div>
          </div>
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
            <div v-if="errors.email" class="text-danger mt-1">
              {{ errors.email[0] }}
            </div>
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
            <div v-if="errors.password" class="text-danger mt-1">
              {{ errors.password[0] }}
            </div>
          </div>
          <div class="mb-3">
            <label for="password_confirmation" class="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              class="form-control"
              v-model="password_confirmation"
              required
              placeholder="Confirm your password"
            />
            <div v-if="errors.password_confirmation" class="text-danger mt-1">
              {{ errors.password_confirmation[0] }}
            </div>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">Register</button>
          </div>
        </form>
        <p class="text-center mt-3">
          Already have an account?
          <RouterLink to="/login" class="text-decoration-none">Login</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>