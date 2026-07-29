<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductCategory;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Makanan Ringan',
                'description' => 'Berbagai macam snack, keripik, kacang, permen, cokelat, dan biskuit'
            ],
            [
                'name' => 'Minuman',
                'description' => 'Air mineral, minuman bersoda, minuman sachet, jus, teh, kopi, dan minuman energi'
            ],
            [
                'name' => 'Makanan Instan & Kaleng',
                'description' => 'Mi instan, sarden, kornet, sup instan, bihun, dan olahan siap saji'
            ],
            [
                'name' => 'Bahan Makanan Pokok',
                'description' => 'Beras, minyak goreng, gula, tepung, mie kering, dan kecap'
            ],
            [
                'name' => 'Susu & Produk Olahan',
                'description' => 'Susu UHT, susu bubuk, susu kental manis, keju, yogurt, dan mentega'
            ],
            [
                'name' => 'Roti & Kue',
                'description' => 'Roti tawar, roti manis, donat, kue basah, dan pastry siap makan'
            ],
            [
                'name' => 'Perawatan Pribadi',
                'description' => 'Sabun mandi, sampo, pasta gigi, deodoran, tisu basah, dan perlengkapan mandi'
            ],
            [
                'name' => 'Pembersih Rumah Tangga',
                'description' => 'Deterjen, sabun cuci piring, pemutih, pembersih lantai, dan pengharum ruangan'
            ],
            [
                'name' => 'Perlengkapan Bayi',
                'description' => 'Popok bayi, susu formula, tisu basah bayi, bedak, dan makanan bayi'
            ],
            [
                'name' => 'Alat Tulis & Kantor',
                'description' => 'Pulpen, pensil, buku, kertas, stapler, isolasi, dan perlengkapan sekolah'
            ],
            [
                'name' => 'Rokok & Tembakau',
                'description' => 'Berbagai merek rokok, kretek, rokok putih, dan korek api'
            ],
            [
                'name' => 'Kesehatan & Obat-obatan',
                'description' => 'Obat bebas, vitamin, plester, minyak kayu putih, dan masker'
            ],
            [
                'name' => 'Frozen Food & Es Krim',
                'description' => 'Nugget, sosis, bakso, dumpling, es krim cup, dan es krim cone'
            ],
            [
                'name' => 'Bumbu Dapur & Saus',
                'description' => 'Bumbu racik, saus sambal, saus tiram, kecap manis, kecap asin, dan kaldu'
            ],
            [
                'name' => 'Perlengkapan Rumah',
                'description' => 'Kantong sampah, aluminium foil, plastik wrap, korek gas, dan baterai'
            ]
        ];

        foreach ($categories as $category) {
            ProductCategory::create($category);
        }
    }
}
