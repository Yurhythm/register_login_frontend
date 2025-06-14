<template>
    <div class="container mt-4">
        <h2>Riwayat Transaksi</h2>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border"></div>
        </div>

        <div v-else>
            <table class="table table-bordered table-striped">
                <thead class="table-primary">
                    <tr>
                        <th>Kode</th>
                        <th>Nama Pelanggan</th>
                        <th>Total</th>
                        <th>Diskon</th>
                        <th>Total Akhir</th>
                        <th>Metode</th>
                        <th>Qty</th>
                        <th>Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="sale in transactions" :key="sale.id" @click="goToDetail(sale.id)"
                        style="cursor: pointer;">
                        <td>{{ sale.sale_code }}</td>
                        <td>{{ sale.customer_name }}</td>
                        <td>{{ formatCurrency(sale.total) }}</td>
                        <td>{{ formatCurrency(sale.discount) }}</td>
                        <td>{{ formatCurrency(sale.final_total) }}</td>
                        <td>{{ sale.payment_method }}</td>
                        <td>{{ sale.items_count }}</td>
                        <td>{{ formatDate(sale.created_at) }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <nav v-if="pagination.total > pagination.per_page && !loading">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
                        <button class="page-link" @click="changePage(pagination.current_page - 1)"
                            :disabled="!pagination.prev_page_url">
                            «
                        </button>
                    </li>
                    <li class="page-item" v-for="page in pagination.last_page" :key="page"
                        :class="{ active: page === pagination.current_page }">
                        <button class="page-link" @click="changePage(page)">
                            {{ page }}
                        </button>
                    </li>
                    <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
                        <button class="page-link" @click="changePage(pagination.current_page + 1)"
                            :disabled="!pagination.next_page_url">
                            »
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const transactions = ref([])
const loading = ref(true)
const pagination = ref({})
const router = useRouter()
const currentPage = ref(1)

const getTransactions = async (page = 1) => {
    loading.value = true
    try {
        const token = localStorage.getItem('authToken')
        const res = await axios.get(`http://localhost:8000/api/sales?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        transactions.value = res.data.data
        pagination.value = {
            current_page: res.data.current_page,
            last_page: res.data.last_page,
            next_page_url: res.data.next_page_url,
            prev_page_url: res.data.prev_page_url,
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const changePage = (page) => {
    if (page !== pagination.value.current_page) {
        currentPage.value = page
        getTransactions(page)
    }
}

const goToDetail = (id) => {
    router.push(`/transaksi/${id}`)
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
}

const formatDate = (datetime) => {
    return new Date(datetime).toLocaleString()
}

onMounted(() => getTransactions(currentPage.value))
</script>