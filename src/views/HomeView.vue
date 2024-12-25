<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div>
        <h3>This Is Home Page</h3> <br> 
        <!-- <RouterLink to="/logout" class="btn btn-danger" >Logout</RouterLink> -->
        <button @click="logoutUser" class="btn btn-danger">Logout</button>
      </div>
      
    </div>
  </main>
</template>


<script>
import axios from "axios";
import { logout } from "../utils/auth";
import Swal from "sweetalert2";


export default {
  methods: {
    async logoutUser() {
      Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, logout!",
      }).then(async (result) => {
        if (result.isConfirmed)  {
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
  },
};


</script>