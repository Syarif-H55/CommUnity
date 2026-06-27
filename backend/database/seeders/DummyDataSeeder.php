<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organization;
use App\Models\User;
use App\Models\VolunteerRegistration;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Seeding dummy data...');

        // ─── USERS ───────────────────────────────────────────────────

        $admin = User::firstOrCreate(
            ['email' => 'admin@community.com'],
            [
                'full_name' => 'Admin CommUnity',
                'username' => 'admin',
                'password' => bcrypt('password'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        $organizer = User::firstOrCreate(
            ['email' => 'budi@example.com'],
            [
                'full_name' => 'Budi Santoso',
                'username' => 'budi_santoso',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $coordinator = User::firstOrCreate(
            ['email' => 'siti@example.com'],
            [
                'full_name' => 'Siti Rahayu',
                'username' => 'siti_rahayu',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $volunteer1 = User::firstOrCreate(
            ['email' => 'ahmad@example.com'],
            [
                'full_name' => 'Ahmad Fauzi',
                'username' => 'ahmad_fauzi',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $volunteer2 = User::firstOrCreate(
            ['email' => 'dewi@example.com'],
            [
                'full_name' => 'Dewi Lestari',
                'username' => 'dewi_lestari',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $volunteer3 = User::firstOrCreate(
            ['email' => 'rudi@example.com'],
            [
                'full_name' => 'Rudi Hermawan',
                'username' => 'rudi_hermawan',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $volunteer4 = User::firstOrCreate(
            ['email' => 'maya@example.com'],
            [
                'full_name' => 'Maya Anggraini',
                'username' => 'maya_anggraini',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('  ✓ Users created');

        // ─── EVENT CATEGORIES ────────────────────────────────────────

        $categories = [
            'Lingkungan' => EventCategory::firstOrCreate(['name' => 'Lingkungan']),
            'Pendidikan' => EventCategory::firstOrCreate(['name' => 'Pendidikan']),
            'Kesehatan' => EventCategory::firstOrCreate(['name' => 'Kesehatan']),
            'Sosial' => EventCategory::firstOrCreate(['name' => 'Sosial']),
            'Kemanusiaan' => EventCategory::firstOrCreate(['name' => 'Kemanusiaan']),
        ];

        $this->command->info('  ✓ Categories loaded');

        // ─── ORGANIZATIONS ───────────────────────────────────────────

        $orgSejahtera = Organization::firstOrCreate(
            ['name' => 'Yayasan Sejahtera'],
            [
                'organization_email' => 'yayasan@sejahtera.com',
                'description' => 'Yayasan sosial yang bergerak di bidang pendidikan dan kesejahteraan masyarakat',
                'verification_status' => 'approved',
                'verified_at' => now(),
            ]
        );

        $orgLingkungan = Organization::firstOrCreate(
            ['name' => 'Komunitas Peduli Lingkungan'],
            [
                'organization_email' => 'komunitas@lingkungan.com',
                'description' => 'Komunitas relawan peduli lingkungan hidup dan kebersihan',
                'verification_status' => 'pending',
            ]
        );

        $orgRelawan = Organization::firstOrCreate(
            ['name' => 'Forum Relawan Jakarta'],
            [
                'organization_email' => 'forum@relawanjakarta.com',
                'description' => 'Forum untuk para relawan di wilayah Jakarta dan sekitarnya',
                'verification_status' => 'rejected',
                'rejection_reason' => 'Dokumen verifikasi belum lengkap. Silakan upload ulang dokumen pendukung.',
            ]
        );

        $this->command->info('  ✓ Organizations created');

        // ─── ORGANIZATION MEMBERSHIPS ────────────────────────────────

        // Budi (Penyelenggara) di Yayasan Sejahtera
        if (!$orgSejahtera->members()->where('user_id', $organizer->id)->exists()) {
            $orgSejahtera->members()->attach($organizer->id, [
                'id' => (string) Str::uuid(),
                'role' => 'Penyelenggara',
                'joined_at' => now()->subMonths(6),
            ]);
        }

        // Siti (Koordinator Event) di Yayasan Sejahtera
        if (!$orgSejahtera->members()->where('user_id', $coordinator->id)->exists()) {
            $orgSejahtera->members()->attach($coordinator->id, [
                'id' => (string) Str::uuid(),
                'role' => 'Koordinator Event',
                'joined_at' => now()->subMonths(3),
            ]);
        }

        // Budi (Penyelenggara) di Komunitas Peduli Lingkungan
        if (!$orgLingkungan->members()->where('user_id', $organizer->id)->exists()) {
            $orgLingkungan->members()->attach($organizer->id, [
                'id' => (string) Str::uuid(),
                'role' => 'Penyelenggara',
                'joined_at' => now()->subMonth(),
            ]);
        }

        // Budi (Penyelenggara) di Forum Relawan Jakarta
        if (!$orgRelawan->members()->where('user_id', $organizer->id)->exists()) {
            $orgRelawan->members()->attach($organizer->id, [
                'id' => (string) Str::uuid(),
                'role' => 'Penyelenggara',
                'joined_at' => now()->subMonths(2),
            ]);
        }

        $this->command->info('  ✓ Memberships created');

        // ─── EVENTS ───────────────────────────────────────────────────

        $eventsData = [
            [
                'title' => 'Bakti Sosial Bersih Lingkungan',
                'description' => 'Kegiatan bersih-bersih lingkungan di sekitar Jakarta. Mari bersama menjaga kebersihan dan kelestarian lingkungan kita.',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Pusat',
                'location_name' => 'Taman Menteng',
                'quota' => 50,
                'event_date' => '2026-07-15',
                'start_time' => '07:00',
                'end_time' => '12:00',
                'status' => 'published',
                'category' => $categories['Lingkungan'],
                'coordinator' => $coordinator,
            ],
            [
                'title' => 'Kelas Belajar Gratis untuk Anak',
                'description' => 'Program belajar gratis untuk anak-anak kurang mampu. Tersedia mata pelajaran Matematika, Bahasa Indonesia, dan IPA.',
                'province' => 'Jawa Barat',
                'city' => 'Bandung',
                'location_name' => 'Rumah Belajar Sejahtera',
                'quota' => 30,
                'event_date' => '2026-07-20',
                'start_time' => '08:00',
                'end_time' => '13:00',
                'status' => 'published',
                'category' => $categories['Pendidikan'],
                'coordinator' => $organizer,
            ],
            [
                'title' => 'Donasi Buku untuk Perpustakaan Desa',
                'description' => 'Galang donasi buku untuk perpustakaan desa di daerah terpencil. Buku yang terkumpul akan didistribusikan ke 10 desa.',
                'province' => 'Jawa Barat',
                'city' => 'Bogor',
                'location_name' => 'Posko Yayasan Sejahtera',
                'quota' => 100,
                'event_date' => '2026-08-01',
                'start_time' => '09:00',
                'end_time' => '16:00',
                'status' => 'draft',
                'category' => $categories['Pendidikan'],
                'coordinator' => $organizer,
            ],
            [
                'title' => 'Senam Sehat Bersama',
                'description' => 'Kegiatan senam pagi bersama untuk menjaga kesehatan dan kebugaran. Terbuka untuk semua kalangan usia.',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Selatan',
                'location_name' => 'Lapangan GBK',
                'quota' => 40,
                'event_date' => '2026-07-25',
                'start_time' => '06:00',
                'end_time' => '09:00',
                'status' => 'published',
                'category' => $categories['Kesehatan'],
                'coordinator' => $coordinator,
            ],
            [
                'title' => 'Bakti Sosial Panti Asuhan',
                'description' => 'Kunjungan dan bakti sosial ke panti asuhan. Akan ada kegiatan bermain, belajar, dan pemberian santunan.',
                'province' => 'Jawa Barat',
                'city' => 'Depok',
                'location_name' => 'Panti Asuhan Putra Harapan',
                'quota' => 25,
                'event_date' => '2026-08-10',
                'start_time' => '08:00',
                'end_time' => '14:00',
                'status' => 'draft',
                'category' => $categories['Sosial'],
                'coordinator' => $organizer,
            ],
        ];

        $createdEvents = [];
        foreach ($eventsData as $data) {
            $event = Event::firstOrCreate(
                [
                    'title' => $data['title'],
                    'organization_id' => $orgSejahtera->id,
                ],
                [
                    'coordinator_id' => $data['coordinator']->id,
                    'category_id' => $data['category']->id,
                    'description' => $data['description'],
                    'province' => $data['province'],
                    'city' => $data['city'],
                    'location_name' => $data['location_name'],
                    'quota' => $data['quota'],
                    'event_date' => $data['event_date'],
                    'start_time' => $data['start_time'],
                    'end_time' => $data['end_time'],
                    'status' => $data['status'],
                ]
            );
            $createdEvents[] = $event;
        }

        $this->command->info('  ✓ Events created');

        // ─── VOLUNTEER REGISTRATIONS ─────────────────────────────────

        $event1 = $createdEvents[0]; // Bakti Sosial Bersih Lingkungan
        $event2 = $createdEvents[1]; // Kelas Belajar Gratis
        $event3 = $createdEvents[3]; // Senam Sehat Bersama

        $registrationsData = [
            ['volunteer' => $volunteer1, 'event' => $event1, 'date' => '2026-06-20'],
            ['volunteer' => $volunteer1, 'event' => $event2, 'date' => '2026-06-22'],
            ['volunteer' => $volunteer2, 'event' => $event1, 'date' => '2026-06-21'],
            ['volunteer' => $volunteer3, 'event' => $event3, 'date' => '2026-06-23'],
            ['volunteer' => $volunteer4, 'event' => $event2, 'date' => '2026-06-24'],
            ['volunteer' => $volunteer4, 'event' => $event1, 'date' => '2026-06-25'],
            ['volunteer' => $volunteer2, 'event' => $event3, 'date' => '2026-06-26'],
        ];

        foreach ($registrationsData as $data) {
            VolunteerRegistration::firstOrCreate(
                [
                    'event_id' => $data['event']->id,
                    'volunteer_id' => $data['volunteer']->id,
                ],
                [
                    'registered_at' => $data['date'],
                ]
            );
        }

        $this->command->info('  ✓ Volunteer registrations created');

        // ─── SUMMARY ─────────────────────────────────────────────────

        $this->command->info('');
        $this->command->info('┌─────────────────────────────────────────────────────────────┐');
        $this->command->info('│                    DUMMY DATA SEEDED                        │');
        $this->command->info('├─────────────┬───────────────────────────────────────────────┤');
        $this->command->info('│  Users      │  7 users (1 admin, 1 organizer,              │');
        $this->command->info('│             │  1 coordinator, 4 volunteers)                │');
        $this->command->info('│  Orgs       │  3 organizations (verified, pending, rejected)│');
        $this->command->info('│  Events     │  5 events (3 published, 2 draft)             │');
        $this->command->info('│  Regist.    │  7 volunteer registrations                   │');
        $this->command->info('├─────────────┴───────────────────────────────────────────────┤');
        $this->command->info('│  Akun Demo:                                                 │');
        $this->command->info('│  Admin        │ admin@community.com │ password             │');
        $this->command->info('│  Penyelenggara│ budi@example.com   │ password             │');
        $this->command->info('│  Koordinator  │ siti@example.com   │ password             │');
        $this->command->info('│  Relawan      │ ahmad@example.com  │ password             │');
        $this->command->info('│  Relawan      │ dewi@example.com   │ password             │');
        $this->command->info('│  Relawan      │ rudi@example.com   │ password             │');
        $this->command->info('│  Relawan      │ maya@example.com   │ password             │');
        $this->command->info('└─────────────┴───────────────────────────────────────────────┘');
    }
}
