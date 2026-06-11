<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('events')->insert([

            [
                'title' => 'Kajian Ustadz Hanan Attaki',
                'slug' => Str::slug('Kajian Ustadz Hanan Attaki'),
                'description' => 'Kajian islami tentang hijrah dan pemuda.',
                'location' => 'Masjid Raya Gorontalo',
                'event_date' => '2026-07-15 19:30:00',
                'banner' => 'banners/hanan-attaki.jpg',
                'status' => 'open',
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}