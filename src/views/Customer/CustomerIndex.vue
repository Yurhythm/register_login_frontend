<template>
  <div class="container mt-4">
    <h3>Master Customer</h3>

    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <table v-if="!loading" class="table table-bordered table-striped">
      <thead class="table-primary">
        <tr>
          <th>Kode</th>
          <th>Nama</th>
          <th>Email</th>
          <th>Telepon</th>
          <th>Alamat</th>
          <th>Membership</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.customer_code">
          <td>{{ customer.customer_code }}</td>
          <td>{{ customer.customer_name }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.phone }}</td>
          <td>{{ customer.address }}</td>
          <td>{{ customer.membership }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CustomerIndex',
  data() {
    return {
      customers: [],
      loading: false,
    };
  },
  methods: {
    async fetchCustomers() {
      this.loading = true;
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8000/api/customers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.customers = response.data;
      } catch (error) {
        console.error('Gagal memuat customer:', error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchCustomers();
  },
};
</script>

<style scoped>
img {
  border-radius: 8px;
}
</style>