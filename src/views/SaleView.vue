<template>
  <main>
    <div class="row" style="width: 100%; margin: auto;">
      <!-- Keranjang -->
      <div class="col-md-5">
        <div class="p-2" style="min-height: 100vh;">
          <div class="card" style="height: 100%;">
            <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div class="mb-3">
                  <label for="customer" class="form-label">Pilih Customer</label>
                  <select v-model="selectedCustomer" class="form-select">
                    <option disabled value="">-- Walk-in Customer --</option>
                    <option v-for="c in customers" :key="c.customer_code" :value="c">
                      {{ c.customer_name }}
                    </option>
                  </select>
                </div>

                <h5 class="card-title mb-3">Keranjang</h5>
                <div class="table-responsive" style="height: 35vh; border: 1px solid #aaaaaa;">
                  <table class="table table-bordered">
                    <thead class="table-light">
                      <tr>
                        <th>Item</th>
                        <th style="width: 20%;">Qty</th>
                        <th>Harga</th>
                        <th>Total</th>
                        <th>Aksi</th> <!-- Tambahan -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in cart" :key="item.product_code">
                        <td>{{ item.product_name }}</td>
                        <td>
                          <input type="number" class="form-control" v-model.number="item.qty"
                            @change="updateQty(index, item.qty)" min="1" />
                        </td>
                        <td>Rp {{ item.discount_price.toLocaleString() }}</td>
                        <td>Rp {{ (item.discount_price * item.qty).toLocaleString() }}</td>
                        <td>
                          <button class="btn btn-sm btn-danger" @click="removeFromCart(index)">Hapus</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="row">
                  <label class="form-label col-12 mt-3">Diskon</label>
                  <div class="col-6">
                    <input type="number" class="form-control" v-model.number="discountValue" placeholder="Diskon">
                  </div>
                  <div class="col-6">
                    <select class="form-select" v-model="discountType">
                      <option value="fixed">Fixed</option>
                      <option value="percent">Percentage</option>
                    </select>
                  </div>
                </div>
                <div class="text-end fw-bold fs-53 mt-3">
                  Total: Rp {{ calculateTotal().toLocaleString() }}
                </div>
              </div>
              <div>
                <div>
                  <button class="btn btn-success w-100 mt-3" @click="openPaymentModal">
                    Bayar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List Produk -->
      <div class="col-md-7">
        <div class="p-2" style="min-height: 100vh;">
          <div class="card" style="height: 100%;">
            <div class="card-body" style="height: 100vh; display: flex; flex-direction: column;">
              <!-- Search Bar -->
              <div class="mb-3">
                <input type="text" class="form-control" placeholder="Cari produk..." v-model="search"
                  @keyup.enter="handleSearch" />
              </div>

              <div class="row" style="flex-grow: 1; overflow-y: auto;">
                <div class="col-sm-6 col-md-3 mb-3" v-for="product in products" :key="product.product_code"
                  @click="addToCart(product)" style="cursor: pointer;">
                  <div class="card text-center menu-card">
                    <img :src="product.image" class="card-img-top" :alt="product.product_name" />
                    <div class="card-body">
                      <div style="height: 40px;">
                        <h5 class="card-title menu-title" style="font-size: 17px;">
                          {{ product.product_name }}
                        </h5>
                      </div>
                      <div style="height: 40px;">
                        <span v-if="product.discount > 0" class="card-text text-secondary fw-bold"
                          style="font-size: 12px; text-decoration: line-through;">
                          Rp {{ product.price.toLocaleString() }}
                        </span>
                        <br v-if="product.discount > 0" />
                        <span class="card-text text-success fw-bold">
                          Rp {{ product.discount_price.toLocaleString() }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-center mt-3">
                <button class="btn btn-outline-primary me-2" :disabled="currentPage === 1"
                  @click="changePage(currentPage - 1)">
                  &laquo; Prev
                </button>
                <span class="align-self-center">Page {{ currentPage }} of {{ lastPage }}</span>
                <button class="btn btn-outline-primary ms-2" :disabled="currentPage === lastPage"
                  @click="changePage(currentPage + 1)">
                  Next &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pembayaran Modal -->
    <div class="modal fade" id="paymentModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title">Pembayaran</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <label class="form-label">Metode Pembayaran</label>
            <select v-model="paymentMethod" class="form-select mb-3">
              <option value="cash">Tunai</option>
              <option value="bank_transfer">Transfer Bank</option>
              <option value="wallet">E-Wallet</option>
            </select>

            <div v-if="paymentMethod === 'cash'">
              <label class="form-label">Jumlah Pembayaran</label>
              <input v-model.number="paymentAmount" type="number" class="form-control mb-2"
                placeholder="Jumlah Pembayaran">
              <label class="form-label">Kembalian</label>
              <input :value="calculateChange()" type="number" class="form-control" disabled placeholder="Kembalian">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
            <button class="btn btn-success" @click="confirmPayment">Konfirmasi</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>


<script>
import axios from "axios";
import Swal from "sweetalert2";
import { logout } from "../utils/auth";

export default {
  data() {
    return {
      products: [],
      cart: [],
      discountValue: 0,
      discountType: "fixed",
      customers: [],
      selectedCustomer: "",
      paymentAmount: 0,
      paymentMethod: "cash",
      currentPage: 1,
      lastPage: 1,
      search: "",
      isLoading: false,
    };
  },
  created() {
    this.fetchProducts();
    this.fetchCustomers();
    this.loadCart();
  },
  methods: {
    async fetchCustomers() {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get("http://localhost:8000/api/customers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.customers = response.data;
      } catch (error) {
        console.error("Gagal mengambil data pelanggan:", error);
        Swal.fire("Error", "Gagal memuat data pelanggan", "error");
      }
    },
    async fetchProducts(page = 1) {
      this.isLoading = true;
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get("http://localhost:8000/api/products", {
          params: {
            page: page,
            search: this.search,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.products = response.data.data;
        this.currentPage = response.data.current_page;
        this.lastPage = response.data.last_page;
      } catch (error) {
        console.error("Gagal memuat produk:", error);
        Swal.fire("Error", "Gagal memuat produk", "error");
      } finally {
        this.isLoading = false;
      }
    },

    async handleSearch() {
      this.currentPage = 1;
      await this.fetchProducts(1);
    },

    changePage(page) {
      if (page >= 1 && page <= this.lastPage) {
        this.fetchProducts(page);
      }
    },
    addToCart(product) {
      const existing = this.cart.find(p => p.product_code === product.product_code);
      if (existing) {
        existing.qty += 1;
      } else {
        this.cart.push({ ...product, qty: 1 });
      }
      this.saveCart();
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
      this.saveCart(); // Simpan ke localStorage setelah perubahan
    },
    updateQty(index, qty) {
      this.cart[index].qty = qty;
      this.saveCart();
    },
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    loadCart() {
      const data = localStorage.getItem("cart");
      if (data) this.cart = JSON.parse(data);
    },
    calculateTotal() {
      let total = 0;
      for (const item of this.cart) {
        total += item.discount_price * item.qty;
      }
      if (this.discountType === "fixed") {
        total -= this.discountValue;
      } else if (this.discountType === "percent") {
        total -= (total * this.discountValue) / 100;
      }
      return total;
    },
    calculateChange() {
      return Math.max(this.paymentAmount - this.calculateTotal(), 0);
    },
    openPaymentModal() {
      const modal = new bootstrap.Modal(document.getElementById("paymentModal"));
      modal.show();
    },
    async confirmPayment() {
      if (this.cart.length === 0) {
        Swal.fire("Keranjang Kosong", "Tambahkan produk terlebih dahulu", "warning");
        return;
      }

      if (this.paymentMethod === "cash" && this.paymentAmount < this.calculateTotal()) {
        Swal.fire("Gagal", "Pembayaran tunai kurang dari total", "error");
        return;
      }

      Swal.fire({
        title: "Menyimpan transaksi...",
        text: "Mohon tunggu",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const modal = bootstrap.Modal.getInstance(document.getElementById("paymentModal"));
      modal.hide();

      await this.saveTransaction();
      // Swal.close();
    },
    async saveTransaction() {
      const token = localStorage.getItem("authToken");

      const total = this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const finalTotal = this.calculateTotal(); // ini sudah mempertimbangkan diskon
      const discount = total - finalTotal;

      const payload = {
        customer_code: this.selectedCustomer.customer_code,
        customer_name: this.selectedCustomer.customer_name,
        payment_method: this.paymentMethod === 'cash' ? 'Cash'
          : this.paymentMethod === 'bank_transfer' ? 'Bank Transfer'
            : 'Wallet',
        total: total,
        discount: discount,
        final_total: finalTotal,
        items: this.cart.map(item => ({
          product_code: item.product_code,
          product_name: item.product_name,
          quantity: item.qty,
          price: item.price,
          discount_price: item.discount_price,
          subtotal: item.discount_price * item.qty
        })),
      };

      try {
        const res = await axios.post("http://localhost:8000/api/sales", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.data.success) {
          Swal.fire("Berhasil", res.data.message, "success");
          this.cart = [];
          this.paymentAmount = 0;
          this.discountValue = 0;
          this.discountType = "";
          localStorage.removeItem("cart");
        } else {
          Swal.fire("Gagal", res.data.message || "Transaksi gagal", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Terjadi kesalahan saat menyimpan transaksi", "error");
      }
    }
  },
};
</script>

<style>
.menu-card img {
  object-fit: cover;
  height: 150px;
}

.menu-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>