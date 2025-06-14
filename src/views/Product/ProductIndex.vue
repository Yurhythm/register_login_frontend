<template>
    <div class="container mt-4">
        <h3>Master Produk</h3>
        <div class="mb-3 d-flex justify-content-between align-items-center">
            <input v-model="search" @keyup.enter="fetchProducts(1)" type="text" class="form-control w-50"
                placeholder="Cari nama produk..." />
        </div>
        <div v-if="loading" class="text-center my-4">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
        <table v-if="!loading" class="table table-bordered table-striped">
            <thead class="table-primary">
                <tr>
                    <th>Gambar</th>
                    <th>Kode</th>
                    <th>Nama Produk</th>
                    <th>Harga</th>
                    <th>Diskon</th>
                    <th>Harga Akhir</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.product_code">
                    <td><img :src="product.image" alt="gambar" width="60" /></td>
                    <td>{{ product.product_code }}</td>
                    <td>{{ product.product_name }}</td>
                    <td>Rp {{ formatRupiah(product.price) }}</td>
                    <td>
                        <span v-if="product.discount_type === 'none'">-</span>
                        <span v-else-if="product.discount_type === 'percent'">{{ product.discount }}%</span>
                        <span v-else>Rp {{ formatRupiah(product.discount) }}</span>
                    </td>
                    <td>Rp {{ formatRupiah(product.discount_price) }}</td>
                </tr>
            </tbody>
        </table>

        <nav v-if="pagination.total > pagination.per_page && !loading">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
                    <button class="page-link" @click="fetchProducts(pagination.current_page - 1)">«</button>
                </li>
                <li class="page-item" v-for="link in pagination.links" :key="link.label"
                    :class="{ active: link.active, disabled: !link.url }">
                    <button class="page-link" @click="fetchProductsByUrl(link.url)" v-html="link.label"></button>
                </li>
                <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
                    <button class="page-link" @click="fetchProducts(pagination.current_page + 1)">»</button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ProductIndex',
    data() {
        return {
            products: [],
            pagination: {},
            loading: false,
            search: '',
        };
    },
    methods: {
        async fetchProducts(page = 1) {
            this.loading = true;
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://localhost:8000/api/products?page=${page}&search=${this.search}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                this.products = response.data.data;
                this.pagination = {
                    current_page: response.data.current_page,
                    per_page: response.data.per_page,
                    total: response.data.total,
                    links: response.data.links,
                    prev_page_url: response.data.prev_page_url,
                    next_page_url: response.data.next_page_url,
                };
            } catch (error) {
                console.error('Gagal memuat produk:', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchProductsByUrl(url) {
            if (!url) return;
            this.loading = true;
            try {
                const token = localStorage.getItem('authToken');

                const modifiedUrl = new URL(url);
                if (this.search) modifiedUrl.searchParams.set('search', this.search);

                const response = await axios.get(modifiedUrl.toString(), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                this.products = response.data.data;
                this.pagination = {
                    current_page: response.data.current_page,
                    per_page: response.data.per_page,
                    total: response.data.total,
                    links: response.data.links,
                    prev_page_url: response.data.prev_page_url,
                    next_page_url: response.data.next_page_url,
                };
            } catch (error) {
                console.error('Gagal memuat produk dari link:', error);
            } finally {
                this.loading = false;
            }
        },
        formatRupiah(value) {
            return Number(value).toLocaleString('id-ID');
        },
    },
    mounted() {
        this.fetchProducts();
    },
};
</script>

<style scoped>
img {
    border-radius: 8px;
}
</style>