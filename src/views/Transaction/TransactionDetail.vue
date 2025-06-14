<template>
    <div class="container mt-4">
        <button class="btn btn-secondary mb-3" @click="$router.push('/transaksi')">← Kembali</button>
        <h2>Detail Transaksi</h2>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border"></div>
        </div>

        <div v-else>
            <p><strong>Kode Transaksi:</strong> {{ detail.sale_code }}</p>
            <p><strong>Nama Pelanggan:</strong> {{ detail.customer_name??"Walk-in Customer" }}</p>
            <p><strong>Tanggal:</strong> {{ formatDate(detail.created_at) }}</p>
            <p><strong>Metode Pembayaran:</strong> {{ detail.payment_method }}</p>
            <p><strong>Total:</strong> {{ formatCurrency(detail.total) }}</p>
            <p><strong>Diskon:</strong> {{ formatCurrency(detail.discount) }}</p>
            <p><strong>Total Akhir:</strong> {{ formatCurrency(detail.final_total) }}</p>

            <h4 class="mt-4">Item Transaksi</h4>
            <table class="table">
                <thead>
                    <tr>
                        <th>Kode</th>
                        <th>Nama Produk</th>
                        <th>Qty</th>
                        <th>Harga</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in detail.items" :key="item.id">
                        <td>{{ item.product_code }}</td>
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ formatCurrency(item.price) }}</td>
                        <td>{{ formatCurrency(item.subtotal) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const detail = ref({})
const loading = ref(true)

const getTransactionDetail = async () => {
    try {
        const token = localStorage.getItem('authToken')
        const res = await axios.get(`http://localhost:8000/api/sales/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        detail.value = res.data.data
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
}
const formatDate = (input) => {
    const date = new Date(input)
    const pad = (n) => String(n).padStart(2, '0')

    const day = pad(date.getDate())
    const month = pad(date.getMonth() + 1)
    const year = date.getFullYear()
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const seconds = pad(date.getSeconds())

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
}
onMounted(getTransactionDetail)
</script>