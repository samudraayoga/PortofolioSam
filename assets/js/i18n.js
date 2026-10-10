(() => {
  'use strict';

  const STORAGE_KEY = 'samudra-portfolio-language';
  const SUPPORTED = new Set(['en', 'id']);
  const ID = {
    "A DEVELOPER'S JOURNEY": "PERJALANAN SEORANG DEVELOPER",
    "Skip to content": "Lewati ke konten",
    "Skip to case study": "Lewati ke studi kasus",
    "Profile": "Profil",
    "Skills": "Keahlian",
    "Creations": "Karya",
    "Creation": "Karya",
    "Journey": "Perjalanan",
    "Let's connect": "Mari terhubung",
    "Let’s connect": "Mari terhubung",
    "Welcome, traveller!": "Selamat datang, pengelana!",
    "Architect of code": "Arsitek kode",
    "and intelligence": "dan kecerdasan",
    "Architect of code and intelligence.": "Arsitek kode dan kecerdasan.",
    "I'm": "Saya adalah",
    "a Software Engineer": "seorang Software Engineer",
    "a Full-Stack Developer": "seorang Full-Stack Developer",
    "an AI Engineer": "seorang AI Engineer",
    ", a Fullstack Developer & AI Engineer building scalable web system, AI Agent, and an intelligent products.": ", seorang Fullstack Developer & AI Engineer yang membangun sistem web skalabel, AI Agent, dan produk cerdas.",
    "Explore Creations": "Jelajahi Karya",
    "Download CV": "Unduh CV",
    "Started with curiosity, moved forward through creation.": "Berawal dari rasa ingin tahu, melangkah melalui karya.",
    "THE CURIOUS BUILDER": "SANG PERANGKAI PENUH RASA INGIN TAHU",
    "THE WEAVER OF SYSTEMS": "SANG PERANGKAI SISTEM",
    "Character Profile": "Profil Karakter",
    "Open full character profile": "Buka profil karakter lengkap",
    "Based in": "Berdomisili di",
    "Focus": "Fokus",
    "Academic background": "Latar belakang akademik",
    "Start our journey": "Mulai perjalanan",
    "Story of the explorer": "Kisah sang penjelajah",
    "Curiosity is my compass.": "Rasa ingin tahu adalah kompas saya.",
    "From understanding computer networks to designing AI systems, I am passionate about discovering how technology can address real-world needs.": "Dari memahami jaringan komputer hingga merancang sistem AI, saya bersemangat menemukan bagaimana teknologi dapat menjawab kebutuhan nyata.",
    "System thinking": "Pemikiran sistem",
    "Full-stack development": "Pengembangan full-stack",
    "AI & automation": "AI & otomasi",
    "Background": "Latar belakang",
    "Experience": "Pengalaman",
    "Beyond development": "Di luar pengembangan",
    "I am a graduate of Computer Science at UPN Veteran Yogyakarta with experience in fullstack development, ERP project management, and the integration of multi-agent and RAG systems. For me, good solutions emerge from a clear understanding of the problem at hand.": "Saya lulusan Ilmu Komputer UPN Veteran Yogyakarta dengan pengalaman dalam pengembangan full-stack, manajemen proyek ERP, serta integrasi sistem multi-agent dan RAG. Bagi saya, solusi yang baik lahir dari pemahaman yang jernih terhadap masalah.",
    "I am a Computer Science graduate with experience as an IT Developer, Project Manager, Full-Stack Developer, and AI Engineer. My focus is designing system architecture, developing ERP systems, and building AI automation connected to company data.": "Saya lulusan Ilmu Komputer dengan pengalaman sebagai IT Developer, Project Manager, Full-Stack Developer, dan AI Engineer. Fokus saya adalah merancang arsitektur sistem, mengembangkan ERP, dan membangun otomasi AI yang terhubung dengan data perusahaan.",
    "Beyond development, I have served as a class representative, KKN team leader, publication and documentation coordinator, and a member of the Media and Information team.": "Di luar pengembangan, saya pernah menjadi ketua kelas, ketua tim KKN, koordinator publikasi dan dokumentasi, serta anggota tim Media dan Informasi.",
    "Explorer’s profile": "Profil penjelajah",
    "Location": "Lokasi",
    "Education": "Pendidikan",
    "Programming languages": "Bahasa pemrograman",
    "Explore my full experience": "Jelajahi pengalaman lengkap saya",
    "Get to know me through my CV": "Kenali saya melalui CV",
    "Skills Constellation": "Konstelasi Keahlian",
    "Skills for every challenge.": "Keahlian untuk setiap tantangan.",
    "Explore the connected skills I use to turn ideas into working solutions.": "Jelajahi keahlian yang saling terhubung untuk mengubah ide menjadi solusi nyata.",
    "Full-Stack Development": "Pengembangan Full-Stack",
    "Bringing interfaces, logic, and data into one experience.": "Menyatukan antarmuka, logika, dan data dalam satu pengalaman.",
    "AI & Automation": "AI & Otomasi",
    "Connecting knowledge and workflows through AI.": "Menghubungkan pengetahuan dan alur kerja melalui AI.",
    "Systems & Networks": "Sistem & Jaringan",
    "Understanding the foundations, designing systems, and keeping networks connected.": "Memahami fondasi, merancang sistem, dan menjaga jaringan tetap terhubung.",
    "Project Management": "Manajemen Proyek",
    "Turning technical direction into coordinated delivery.": "Mengubah arah teknis menjadi eksekusi yang terkoordinasi.",
    "Expertise skills": "Keahlian utama",
    "Creations": "Karya",
    "Shape through innovation.": "Membentuk melalui inovasi.",
    "Explore the development of business systems, AI solutions, and iOS applications.": "Jelajahi pengembangan sistem bisnis, solusi AI, dan aplikasi iOS.",
    "An internal ERP system for inventory management and operational administration at Raho Premier.": "Sistem ERP internal untuk pengelolaan inventaris dan administrasi operasional di Raho Premier.",
    "Explore the ERP project": "Jelajahi proyek ERP",
    "AI Agent for ERP KPIs": "AI Agent untuk KPI ERP",
    "An OpenClaw agent that summarizes staff performance using KPI dashboard data through an ERP endpoint.": "Agent OpenClaw yang merangkum performa staf menggunakan data dashboard KPI melalui endpoint ERP.",
    "Explore the integration flow": "Jelajahi alur integrasi",
    "AI-Powered WhatsApp Chatbot": "Chatbot WhatsApp Bertenaga AI",
    "A customer service chatbot with a knowledge base, RAG, a shared inbox, and handoffs to the support team.": "Chatbot layanan pelanggan dengan basis pengetahuan, RAG, kotak masuk bersama, dan alih tangan ke tim dukungan.",
    "Explore the chatbot project": "Jelajahi proyek chatbot",
    "A decision support app that helps players choose Mobile Legends heroes through five counter recommendations with explainable scores.": "Aplikasi pendukung keputusan yang membantu pemain memilih hero Mobile Legends melalui lima rekomendasi counter dengan skor yang dapat dijelaskan.",
    "Explore the MLBB project": "Jelajahi proyek MLBB",
    "My contribution": "Kontribusi saya",
    "Designed features and workflows based on business and operational needs.": "Merancang fitur dan alur kerja berdasarkan kebutuhan bisnis dan operasional.",
    "Led ERP development as Project Manager and Full-Stack Developer, from architecture and planning to implementation and timeline management.": "Memimpin pengembangan ERP sebagai Project Manager dan Full-Stack Developer, dari arsitektur dan perencanaan hingga implementasi dan pengelolaan lini masa.",
    "Developed ERP, AI agent architecture, and chatbot WhatsApp dashboard.": "Mengembangkan ERP, arsitektur AI agent, dan dashboard chatbot WhatsApp.",
    "Designed agent workflows, database integration, multi-agent systems, and RAG architecture using OpenClaw.": "Merancang alur kerja agent, integrasi basis data, sistem multi-agent, dan arsitektur RAG menggunakan OpenClaw.",
    "Developed an AI-powered WhatsApp chatbot dashboard with Next.js.": "Mengembangkan dashboard chatbot WhatsApp bertenaga AI dengan Next.js.",
    "Integration flow": "Alur integrasi",
    "The ERP dashboard provides staff KPI performance data.": "Dashboard ERP menyediakan data performa KPI staf.",
    "An ERP endpoint provides the data for integration with the OpenClaw API.": "Endpoint ERP menyediakan data untuk integrasi dengan API OpenClaw.",
    "SOUL gives the agent instructions to summarize staff performance based on KPI data.": "SOUL memberi agent instruksi untuk merangkum performa staf berdasarkan data KPI.",
    "The agent produces a performance summary that is easier to read.": "Agent menghasilkan ringkasan performa yang lebih mudah dibaca.",
    "Conceptual diagram, not an application screenshot.": "Diagram konseptual, bukan tangkapan layar aplikasi.",
    "Replay flow": "Putar ulang alur",
    "Download SVG diagram": "Unduh diagram SVG",
    "This illustration follows the project workflow and contains no real staff data, KPI values, or internal application screenshots.": "Ilustrasi ini mengikuti alur proyek dan tidak memuat data staf, nilai KPI, atau tangkapan layar aplikasi internal yang sebenarnya.",
    "The Journey": "Perjalanan",
    "Every step is a lesson.": "Setiap langkah adalah pelajaran.",
    "Journey from classroom and laboratory through business development": "Perjalanan dari ruang kelas dan laboratorium menuju pengembangan bisnis",
    "Tech Development": "Pengembangan Teknologi",
    "IT Developer": "IT Developer",
    "Developed ERP, AI agent architecture, and chatbot WhatsApp dashboard.": "Mengembangkan ERP, arsitektur AI agent, dan dashboard chatbot WhatsApp.",
    "Infrastructure & connectivity": "Infrastruktur & konektivitas",
    "IT Support Intern": "Magang IT Support",
    "Supported network infrastructure installation and configuration at client sites.": "Mendukung instalasi dan konfigurasi infrastruktur jaringan di lokasi klien.",
    "Practice & operations": "Praktik & operasional",
    "Laboratory Assistant & Administrator": "Asisten & Administrator Laboratorium",
    "Guided lab sessions and kept the learning environment ready.": "Memandu sesi praktikum dan menjaga lingkungan belajar tetap siap.",
    "Sharing knowledge": "Berbagi pengetahuan",
    "Teaching Assistant": "Asisten Pengajar",
    "Supported learning in Computer Networks and Programming Algorithms.": "Mendukung pembelajaran Jaringan Komputer dan Algoritma Pemrograman.",
    "Explore my full experience": "Jelajahi pengalaman lengkap saya",
    "Open the adventure map": "Buka peta perjalanan",
    "Academic foundation": "Fondasi akademik",
    "An academic foundation for further exploration · GPA 3.52 / 4.00": "Fondasi akademik untuk penjelajahan lebih lanjut · IPK 3,52 / 4,00",
    "Great ideas start": "Ide besar bermula",
    "with a conversation.": "dari sebuah percakapan.",
    "Have a technical challenge or an idea you want to build?": "Punya tantangan teknis atau ide yang ingin diwujudkan?",
    "Let’s find the first step together.": "Mari temukan langkah pertamanya bersama.",
    "Start a conversation": "Mulai percakapan",
    "Back to top": "Kembali ke atas",
    "Character Archive": "Arsip Karakter",
    "Celestial Constellation": "Konstelasi Langit",
    "Domain of Creations": "Domain Karya",
    "Ley Line Journey": "Perjalanan Ley Line",
    "Final Wish": "Doa Terakhir",
    "WAYPOINT ROUTE": "RUTE WAYPOINT",
    "Hydro / System Weaver": "Hydro / Perangkai Sistem",
    "Character Selection": "Pemilihan Karakter",
    "Element Profile": "Profil Elemen",
    "Clarity · Adaptability": "Kejernihan · Adaptabilitas",
    "Open Constellation": "Buka Konstelasi",
    "Focus Samudra character selection": "Fokuskan pemilihan karakter Samudra",
    "Pause automatic portrait changes": "Jeda pergantian potret otomatis",
    "Resume automatic portrait changes": "Lanjutkan pergantian potret otomatis",
    "Switch to day mode": "Beralih ke mode siang",
    "Switch to night mode": "Beralih ke mode malam",
    "Change theme": "Ubah tema",
    "Open navigation menu": "Buka menu navigasi",
    "Close navigation menu": "Tutup menu navigasi",
    "Enable ambient sound": "Aktifkan suara latar",
    "Disable ambient sound": "Nonaktifkan suara latar",
    "Email address copied.": "Alamat email disalin.",

    "All work": "Semua karya",
    "Back to all work": "Kembali ke semua karya",
    "Case notes / 01": "Catatan kasus / 01",
    "Case notes / 03": "Catatan kasus / 03",
    "Case notes / 04": "Catatan kasus / 04",
    "My role": "Peran saya",
    "Category": "Kategori",
    "Contribution scope": "Lingkup kontribusi",
    "Development scope": "Lingkup pengembangan",
    "Project": "Proyek",
    "Project date": "Tanggal proyek",
    "Project preview": "Pratinjau proyek",
    "Project information": "Informasi proyek",
    "Frontend & backend": "Frontend & backend",
    "Internal ERP System": "Sistem ERP Internal",
    "View documentation": "Lihat dokumentasi",
    "Explore modules": "Jelajahi modul",
    "Explore features": "Jelajahi fitur",
    "View the app": "Lihat aplikasi",
    "How matchups work": "Cara kerja matchup",
    "Behind the interface": "Di balik antarmuka",
    "A workspace for operations.": "Ruang kerja untuk operasional.",
    "Application documentation, from inventory master data to navigation across internal modules.": "Dokumentasi aplikasi, dari data master inventaris hingga navigasi antar modul internal.",
    "Inventory master data": "Data master inventaris",
    "Inventory & logistics navigation": "Navigasi inventaris & logistik",
    "System management navigation": "Navigasi manajemen sistem",
    "Project overview & sign-in page": "Ikhtisar proyek & halaman masuk",
    "Open full size": "Buka ukuran penuh",
    "new tab": "tab baru",
    "(new tab)": "(tab baru)",
    "← Back to all work": "← Kembali ke semua karya",
    "Choose ERP documentation": "Pilih dokumentasi ERP",
    "Account details and internal inventory data have been blurred in the screenshots.": "Detail akun dan data inventaris internal telah diburamkan pada tangkapan layar.",
    "More documentation:": "Dokumentasi lainnya:",
    "Context & contribution": "Konteks & kontribusi",
    "Operational needs,": "Kebutuhan operasional,",
    "in one internal system.": "dalam satu sistem internal.",
    "About the project": "Tentang proyek",
    "ERP Raho Premier is an internal system with interfaces for inventory and system management. The documentation shows product master data, units, conversions, and navigation for logistics and administrative workflows.": "ERP Raho Premier adalah sistem internal dengan antarmuka untuk inventaris dan manajemen sistem. Dokumentasinya menampilkan data master produk, satuan, konversi, serta navigasi alur kerja logistik dan administrasi.",
    "On the inventory master page, stock is scoped to a branch or Central Logistics. The interface includes SKUs, product categories, base UOM, usage UOM, conversion factors, and optional batch and expiry tracking.": "Pada halaman master inventaris, stok dicakup berdasarkan cabang atau Central Logistics. Antarmuka mencakup SKU, kategori produk, UOM dasar, UOM penggunaan, faktor konversi, serta pelacakan batch dan kedaluwarsa opsional.",
    "I contributed as a": "Saya berkontribusi sebagai",
    ", working on the frontend and backend of ERP Raho Premier.": ", mengerjakan frontend dan backend ERP Raho Premier.",
    "Developing the application interface for internal operations.": "Mengembangkan antarmuka aplikasi untuk operasional internal.",
    "Developing the backend as part of the ERP implementation.": "Mengembangkan backend sebagai bagian dari implementasi ERP.",
    "Interface scope": "Lingkup antarmuka",
    "From product data to operations.": "Dari data produk hingga operasional.",
    "Modules and menus shown in the project documentation.": "Modul dan menu yang ditampilkan dalam dokumentasi proyek.",
    "Stock & goods movements": "Stok & pergerakan barang",
    "Shipping & receiving": "Pengiriman & penerimaan",
    "Purchasing & approval": "Pembelian & persetujuan",
    "Permissions & audits": "Perizinan & audit",
    "Teams & integrations": "Tim & integrasi",
    "System foundations": "Fondasi sistem",
    "The technology behind the ERP.": "Teknologi di balik ERP.",
    "The development stack used in ERP Raho Premier.": "Stack pengembangan yang digunakan pada ERP Raho Premier.",
    "Web application framework.": "Framework aplikasi web.",
    "Relational database.": "Basis data relasional.",
    "Data access through an ORM.": "Akses data melalui ORM.",
    "Job queue infrastructure.": "Infrastruktur antrean pekerjaan.",
    "The next adventure": "Petualangan berikutnya",
    "Have operational needs": "Punya kebutuhan operasional",
    "you want to address?": "yang ingin diselesaikan?",

    "AI Customer Support": "Dukungan Pelanggan AI",
    "WhatsApp Automation": "Otomasi WhatsApp",
    "AI-Powered": "Bertenaga AI",
    "Choose chatbot documentation": "Pilih dokumentasi chatbot",
    "Interface, backend,": "Antarmuka, backend,",
    "and system architecture": "dan arsitektur sistem",
    "Helping customer service teams answer recurring questions using business knowledge, while keeping the team in control.": "Membantu tim layanan pelanggan menjawab pertanyaan berulang dengan pengetahuan bisnis, sambil menjaga kendali tetap di tangan tim.",
    "From architecture to control room.": "Dari arsitektur hingga ruang kendali.",
    "Project documentation and screens from RAHO Control Room.": "Dokumentasi proyek dan layar dari RAHO Control Room.",
    "Dashboard": "Dashboard",
    "Architecture": "Arsitektur",
    "Inbox": "Kotak Masuk",
    "Handoff": "Alih Tangan",
    "Contact details, conversations, and some operational data have been blurred in the screenshots.": "Detail kontak, percakapan, dan sebagian data operasional telah diburamkan pada tangkapan layar.",
    "The need": "Kebutuhan",
    "Customer service teams in companies and small businesses face recurring customer questions. This chatbot is designed to help answer them with relevant business information, while providing a way to hand conversations over to a person.": "Tim layanan pelanggan di perusahaan dan usaha kecil menghadapi pertanyaan pelanggan yang berulang. Chatbot ini dirancang untuk membantu menjawabnya dengan informasi bisnis yang relevan, sekaligus menyediakan cara untuk mengalihkan percakapan kepada manusia.",
    "I worked as the": "Saya bekerja sebagai",
    ", developing the application interface and backend, and designing the overall system architecture.": ", mengembangkan antarmuka dan backend aplikasi, sekaligus merancang keseluruhan arsitektur sistem.",
    "Responsibilities across the system, from the dashboard to WhatsApp message delivery.": "Tanggung jawab di seluruh sistem, dari dashboard hingga pengiriman pesan WhatsApp.",
    "Key features": "Fitur utama",
    "From questions to follow-up.": "Dari pertanyaan hingga tindak lanjut.",
    "Five features connecting AI automation and customer service.": "Lima fitur yang menghubungkan otomasi AI dan layanan pelanggan.",
    "Knowledge base & RAG": "Basis pengetahuan & RAG",
    "Rule-based message handling": "Penanganan pesan berbasis aturan",
    "Shared inbox & human handoff": "Kotak masuk bersama & alih tangan manusia",
    "Durable outbox & worker": "Outbox tahan gangguan & worker",
    "WhatsApp alerts for customer service": "Notifikasi WhatsApp untuk layanan pelanggan",
    "AI answers draw on a knowledge base the team can manage, using relevant business information as context.": "Jawaban AI mengambil konteks dari basis pengetahuan yang dapat dikelola tim menggunakan informasi bisnis yang relevan.",
    "Deterministic rules work alongside AI responses in the chatbot flow.": "Aturan deterministik bekerja bersama respons AI dalam alur chatbot.",
    "Customer service teams can browse conversations, take over from AI, and send manual replies from one inbox.": "Tim layanan pelanggan dapat menelusuri percakapan, mengambil alih dari AI, dan mengirim balasan manual dari satu kotak masuk.",
    "Messages are sent through a queue and processed by a background worker, with support for delivery retries.": "Pesan dikirim melalui antrean dan diproses oleh worker latar belakang, dengan dukungan percobaan ulang pengiriman.",
    "When AI creates a new handoff, a question summary is sent to customer service via WhatsApp so the team can follow up.": "Saat AI membuat alih tangan baru, ringkasan pertanyaan dikirim ke layanan pelanggan melalui WhatsApp agar tim dapat menindaklanjuti.",
    "Every service has a role.": "Setiap layanan memiliki peran.",
    "Automation that works": "Otomasi yang bekerja",
    "with the team.": "bersama tim.",
    "AI helps answer.": "AI membantu menjawab.",
    "The team can always take over.": "Tim selalu dapat mengambil alih.",
    "Have a service workflow": "Punya alur layanan",
    "you want to develop?": "yang ingin dikembangkan?",

    "Decision Support System": "Sistem Pendukung Keputusan",
    "Helping players choose counter heroes by understanding an opponent’s playstyle, strengths, and weaknesses, all within a SwiftUI app.": "Membantu pemain memilih hero counter dengan memahami gaya bermain, kekuatan, dan kelemahan lawan, semuanya dalam aplikasi SwiftUI.",
    "How recommendations work": "Cara kerja rekomendasi",
    "Two app screens: explore heroes, then understand the recommendations and what contributes to their scores.": "Dua layar aplikasi: jelajahi hero, lalu pahami rekomendasi dan faktor yang membentuk skornya.",
    "Hero details show traits, weaknesses, and a list of counters with scores and contributing factors. In the Harley example, Franco ranks first with a score of +36.": "Detail hero menampilkan karakteristik, kelemahan, serta daftar counter dengan skor dan faktor penyusunnya. Pada contoh Harley, Franco berada di peringkat pertama dengan skor +36.",
    "Project context": "Konteks proyek",
    "Make an informed pick.": "Pilih dengan pertimbangan.",
    "About the app": "Tentang aplikasi",
    "MLBB Heroes Matchup Decision Support System is a SwiftUI app that helps casual Mobile Legends players choose a hero. Inspired by the habit of making picks based on intuition, the project offers a more structured way to understand relationships between characters.": "MLBB Heroes Matchup Decision Support System adalah aplikasi SwiftUI yang membantu pemain kasual Mobile Legends memilih hero. Terinspirasi dari kebiasaan memilih berdasarkan intuisi, proyek ini menawarkan cara yang lebih terstruktur untuk memahami hubungan antar karakter.",
    "The system uses a": "Sistem ini menggunakan",
    "rule-based scoring engine": "mesin penilaian berbasis aturan",
    "built in Swift. Heroes are evaluated through three main factors: playstyle or archetype, traits, and weaknesses. The relationships between these factors produce counter recommendations that can be explained to users.": "yang dibangun dengan Swift. Hero dievaluasi melalui tiga faktor utama: gaya bermain atau arketipe, karakteristik, dan kelemahan. Hubungan antar faktor menghasilkan rekomendasi counter yang dapat dijelaskan kepada pengguna.",
    "Data and calculations": "Data dan perhitungan",
    "Built to run on the device.": "Dibangun untuk berjalan di perangkat.",
    "Hero data is stored in local JSON files, using online references and input from experienced players as sources. All calculations run on the device, so recommendations do not depend on an external server.": "Data hero disimpan dalam berkas JSON lokal, menggunakan referensi daring dan masukan pemain berpengalaman sebagai sumber. Semua perhitungan berjalan di perangkat sehingga rekomendasi tidak bergantung pada server eksternal.",
    "Start with the opponent’s hero.": "Mulai dari hero lawan.",
    "The list shows 126 heroes with their roles and playstyles. A search field helps users find the hero they want to analyze.": "Daftar menampilkan 126 hero beserta role dan gaya bermainnya. Kolom pencarian membantu pengguna menemukan hero yang ingin dianalisis.",
    "Understand the playstyle": "Pahami gaya bermain",
    "Archetypes such as teamfight, pickoff, and split-push have counter relationships. These relationships form one part of the evaluation between the selected hero and potential opponents.": "Arketipe seperti teamfight, pickoff, dan split-push memiliki hubungan counter. Hubungan ini menjadi salah satu bagian evaluasi antara hero terpilih dan calon lawannya.",
    "Find the weaknesses": "Temukan kelemahan",
    "A candidate’s traits are matched against the target hero’s weaknesses to see how its abilities can exploit them.": "Karakteristik kandidat dicocokkan dengan kelemahan hero target untuk melihat bagaimana kemampuannya dapat memanfaatkan kelemahan tersebut.",
    "Explain the score": "Jelaskan skornya",
    "Scores are normalized to keep comparisons fair and avoid double counting. Users can see the rankings and the factors contributing to each score.": "Skor dinormalisasi agar perbandingan tetap adil dan menghindari penghitungan ganda. Pengguna dapat melihat peringkat serta faktor yang berkontribusi pada setiap skor.",
    "Three factors, one matchup score.": "Tiga faktor, satu skor matchup.",
    "App foundations": "Fondasi aplikasi",
    "The iOS interface and matchup logic live in one app.": "Antarmuka iOS dan logika matchup berada dalam satu aplikasi.",
    "Application logic and the matchup scoring engine.": "Logika aplikasi dan mesin penilaian matchup.",
    "Storage for the hero data used in the evaluation.": "Penyimpanan data hero yang digunakan dalam evaluasi.",
    "Interfaces for the hero list, search, character details, and recommendations.": "Antarmuka untuk daftar hero, pencarian, detail karakter, dan rekomendasi.",
    "Scoring rules based on archetypes, traits, and weaknesses, with score normalization.": "Aturan penilaian berdasarkan arketipe, karakteristik, dan kelemahan, dengan normalisasi skor.",
    "Recommendations with reasons.": "Rekomendasi beserta alasannya.",
    "Have an app idea": "Punya ide aplikasi",
    "you want to develop?": "yang ingin dikembangkan?"
  };

  Object.assign(ID, {
    "Hi, I am": "Halo, saya",
    "My journey connects system development, AI architecture, network infrastructure, laboratory operations, and teaching.": "Perjalanan saya menghubungkan pengembangan sistem, arsitektur AI, infrastruktur jaringan, operasional laboratorium, dan pengajaran.",
    "My organizational experience includes serving as class representative for IF-H International Classroom, team leader for the KKN community service program, Publication and Documentation Coordinator for Veteran Integrated Parade, and a member of the Media and Information team at HMJ Informatika UPNYK.": "Pengalaman organisasi saya mencakup menjadi ketua kelas IF-H International Classroom, ketua tim program pengabdian KKN, Koordinator Publikasi dan Dokumentasi Veteran Integrated Parade, serta anggota tim Media dan Informasi HMJ Informatika UPNYK.",
    "Bachelor’s degree in Computer Science · UPN Veteran Yogyakarta": "Sarjana Ilmu Komputer · UPN Veteran Yogyakarta",
    "August 2022 — January 2026": "Agustus 2022 — Januari 2026",
    "June 2026": "Juni 2026",
    "Sep 2025 — Jan 2026": "Sep 2025 — Jan 2026",
    "Aug 2024 — Jan 2026": "Agu 2024 — Jan 2026",
    "Jul 2023 — Jan 2026": "Jul 2023 — Jan 2026",
    "Raho Premier · June 2026": "Raho Premier · Juni 2026",
    "Assisted with wired and wireless network installations.": "Membantu instalasi jaringan kabel dan nirkabel.",
    "Installed, configured, and tested Wi-Fi routers and access points.": "Memasang, mengonfigurasi, dan menguji router Wi-Fi serta access point.",
    "Handled UTP cable crimping, RJ45 termination, and connectivity testing.": "Menangani crimping kabel UTP, terminasi RJ45, dan pengujian konektivitas.",
    "Guided two lab classes per week and prepared practical exams for networks and systems.": "Memandu dua kelas praktikum per minggu dan menyiapkan ujian praktik jaringan serta sistem.",
    "Set up, maintained, and troubleshot 20 computers per session.": "Menyiapkan, merawat, dan menangani kendala 20 komputer per sesi.",
    "Managed lab schedules, documentation, and daily operations.": "Mengelola jadwal laboratorium, dokumentasi, dan operasional harian.",
    "Supported more than four classes each week.": "Mendukung lebih dari empat kelas setiap minggu.",
    "Guided discussions, assignments, and network exercises, and assessed students’ work.": "Memandu diskusi, tugas, dan latihan jaringan, serta menilai pekerjaan mahasiswa.",
    "Choose a star to explore a skill path.": "Pilih bintang untuk menjelajahi jalur keahlian.",
    "Connected disciplines": "Disiplin yang terhubung",
    "One system. Four perspectives.": "Satu sistem. Empat perspektif.",
    "Select a glowing star to discover the tools and skills behind each path.": "Pilih bintang bercahaya untuk menemukan alat dan keahlian di balik setiap jalur.",
    "Tab to a star · Enter to explore": "Tab menuju bintang · Enter untuk menjelajah",
    "Constellation state": "Status konstelasi",
    "Select a gateway star": "Pilih bintang gerbang",
    "Selected skill path": "Jalur keahlian terpilih",
    "Choose another star · Esc for overview": "Pilih bintang lain · Esc untuk ikhtisar",
    "Awakened region": "Wilayah yang terbangun",
    "Overview": "Ikhtisar",
    "Open Full-Stack Development constellation": "Buka konstelasi Pengembangan Full-Stack",
    "Open AI and Automation constellation": "Buka konstelasi AI dan Otomasi",
    "Open Systems and Networks constellation": "Buka konstelasi Sistem dan Jaringan",
    "Open Project Management constellation": "Buka konstelasi Manajemen Proyek",
    "Core technologies": "Teknologi inti",
    "View my experience at Raho Premier": "Lihat pengalaman saya di Raho Premier",
    "View my experience at Harrisma": "Lihat pengalaman saya di Harrisma",
    "View my laboratory experience": "Lihat pengalaman laboratorium saya",
    "View my teaching assistant experience": "Lihat pengalaman saya sebagai asisten pengajar",
    "Start a conversation with Samudra on WhatsApp (opens in a new tab)": "Mulai percakapan dengan Samudra di WhatsApp (terbuka di tab baru)",
    "Copy email address": "Salin alamat email",
    "Copy email": "Salin email",
    "Open Samudra’s LinkedIn profile (opens in a new tab)": "Buka profil LinkedIn Samudra (terbuka di tab baru)",
    "Inspired by adventure, built with curiosity.": "Terinspirasi petualangan, dibangun dengan rasa ingin tahu.",
    "Journey chapters": "Bab perjalanan",
    "Character": "Karakter",
    "Constellation": "Konstelasi",
    "Contact": "Kontak",
    "Meet Samudra": "Kenali Samudra",
    "Main navigation": "Navigasi utama",
    "Samudra, back to home": "Samudra, kembali ke beranda",

    "An internal ERP system supporting inventory management and operational administration at Raho Premier.": "Sistem ERP internal yang mendukung pengelolaan inventaris dan administrasi operasional di Raho Premier.",
    "An interface for products, units of measure (UOM), conversions, and batches, with optional expiry tracking. Internal inventory data is blurred.": "Antarmuka untuk produk, satuan ukur (UOM), konversi, dan batch, dengan pelacakan kedaluwarsa opsional. Data inventaris internal diburamkan.",
    "Menus for stock, transfers, adjustments and stocktaking, stock requests and reservations, shipments, goods receipt, Treatment BOM, and shipment reports.": "Menu untuk stok, transfer, penyesuaian dan stock opname, permintaan dan reservasi stok, pengiriman, penerimaan barang, Treatment BOM, dan laporan pengiriman.",
    "Access to purchasing, approvals, teams and tasks, permissions, audit logs, and Zoho and WhatsApp integration menus.": "Akses ke menu pembelian, persetujuan, tim dan tugas, perizinan, log audit, serta integrasi Zoho dan WhatsApp.",
    "ERP Raho Premier documentation showing the sign-in page, the Fullstack Developer role, and the technologies used.": "Dokumentasi ERP Raho Premier yang menampilkan halaman masuk, peran Fullstack Developer, dan teknologi yang digunakan.",
    "Products, categories, units of measure (UOM), conversion factors, default cost prices, and batch and expiry settings.": "Produk, kategori, satuan ukur (UOM), faktor konversi, harga pokok default, serta pengaturan batch dan kedaluwarsa.",
    "Navigation covers stock, transfers, adjustments and stocktaking, item usage history, stock requests, and stock reservations.": "Navigasi mencakup stok, transfer, penyesuaian dan stock opname, riwayat penggunaan barang, permintaan stok, dan reservasi stok.",
    "Access to the Logistics Dashboard, shipments, goods receipt, Treatment BOM, shipment reports, and Homecare Bags.": "Akses ke Logistics Dashboard, pengiriman, penerimaan barang, Treatment BOM, laporan pengiriman, dan Homecare Bags.",
    "Purchasing & AP, Deferred Revenue, and Approval Inbox are available in the operations navigation.": "Purchasing & AP, Deferred Revenue, dan Approval Inbox tersedia dalam navigasi operasional.",
    "The interface provides access to Admin Managers, Product Master, Permission & Role, and Audit Log.": "Antarmuka menyediakan akses ke Admin Managers, Product Master, Permission & Role, dan Audit Log.",
    "Navigation includes RAIN · Task Assistant, Teams & Tasks, Voucher Partnership, Zoho Integration, and WhatsApp Settings.": "Navigasi mencakup RAIN · Task Assistant, Teams & Tasks, Voucher Partnership, Zoho Integration, dan WhatsApp Settings.",
    "Inventory": "Inventaris",
    "Logistics": "Logistik",
    "Management": "Manajemen",
    "System management": "Manajemen sistem",
    "Project overview": "Ikhtisar proyek",

    "WhatsApp chatbot documentation: the Rule → RAG → AI flow, with an outbox and worker for message delivery.": "Dokumentasi chatbot WhatsApp: alur Rule → RAG → AI, dengan outbox dan worker untuk pengiriman pesan.",
    "Dashboard interface for administration and operations.": "Antarmuka dashboard untuk administrasi dan operasional.",
    "An architecture separating response processing, delivery queues, and operator workflows.": "Arsitektur yang memisahkan pemrosesan respons, antrean pengiriman, dan alur kerja operator.",
    "Teams can add a knowledge base. Retrieval-Augmented Generation (RAG) uses this information as context for AI answers, alongside rule-based message handling.": "Tim dapat menambahkan basis pengetahuan. Retrieval-Augmented Generation (RAG) menggunakan informasi ini sebagai konteks jawaban AI, bersama penanganan pesan berbasis aturan.",
    "A dashboard interface for operations and conversation management.": "Antarmuka dashboard untuk operasional dan pengelolaan percakapan.",
    "API for authentication, chatbot routing, RAG, and business logic.": "API untuk autentikasi, routing chatbot, RAG, dan logika bisnis.",
    "Application data storage and access.": "Penyimpanan dan akses data aplikasi.",
    "Job queues and delivery retries.": "Antrean pekerjaan dan percobaan ulang pengiriman.",
    "Document and file storage.": "Penyimpanan dokumen dan berkas.",
    "AI models supporting chatbot responses.": "Model AI yang mendukung respons chatbot.",
    "WhatsApp messaging services and outgoing message processing.": "Layanan pesan WhatsApp dan pemrosesan pesan keluar.",
    "A backend connecting chatbot logic, the knowledge base, and WhatsApp services.": "Backend yang menghubungkan logika chatbot, basis pengetahuan, dan layanan WhatsApp.",
    "OpenAI-compatible AI provider": "Penyedia AI kompatibel OpenAI",

    "10 October 2025": "10 Oktober 2025",
    "01 / PRODUCT DATA": "01 / DATA PRODUK",
    "02 / STOCK": "02 / STOK",
    "03 / LOGISTICS": "03 / LOGISTIK",
    "04 / ADMINISTRATION": "04 / ADMINISTRASI",
    "05 / SYSTEM MANAGEMENT": "05 / MANAJEMEN SISTEM",
    "06 / WORKSPACE": "06 / RUANG KERJA",
    "01 / HERO LIST": "01 / DAFTAR HERO",
    "02 / MATCHUP RESULTS": "02 / HASIL MATCHUP",
    "01 / PLAYSTYLE": "01 / GAYA BERMAIN",
    "02 / TRAITS & WEAKNESSES": "02 / KARAKTERISTIK & KELEMAHAN",
    "03 / TOP 5 COUNTER PICKS": "03 / 5 PILIHAN COUNTER TERATAS",
    "From hero selection to counter pick.": "Dari pemilihan hero hingga counter pick.",
    "Each hero selection produces five recommended counters, with transparent scores.": "Setiap pemilihan hero menghasilkan lima rekomendasi counter dengan skor transparan.",
    "Top 5 counter picks": "5 pilihan counter teratas",
    "Understand the matchup.": "Pahami matchup.",
    "On-device calculations": "Perhitungan di perangkat",
    "Rule-based scoring": "Penilaian berbasis aturan",
    "Local JSON": "JSON lokal"
  });

  const TITLES = {
    "Samudra Portofolio": "Portofolio Samudra",
    "ERP Raho Premier — Samudra’s Work": "ERP Raho Premier — Karya Samudra",
    "WhatsApp Chatbot AI — Samudra’s Work": "WhatsApp Chatbot AI — Karya Samudra",
    "MLBB Heroes Matchup — Samudra’s Work": "MLBB Heroes Matchup — Karya Samudra"
  };
  const META = {
    "Yoga Samudra Heriyanto’s portfolio — IT Developer, Full-Stack Developer, and AI Engineer. Explore my skills, creations, and journey.": "Portofolio Yoga Samudra Heriyanto — IT Developer, Full-Stack Developer, dan AI Engineer. Jelajahi keahlian, karya, dan perjalanan saya.",
    "ERP Raho Premier: an internal ERP system with interfaces for inventory, logistics, and system management. Yoga Samudra Heriyanto’s contribution as a Fullstack Developer.": "ERP Raho Premier: sistem ERP internal dengan antarmuka inventaris, logistik, dan manajemen sistem. Kontribusi Yoga Samudra Heriyanto sebagai Fullstack Developer.",
    "AI-Powered WhatsApp Chatbot case study by Yoga Samudra Heriyanto: knowledge base, RAG, shared inbox, durable outbox, and human handoff for customer service teams.": "Studi kasus Chatbot WhatsApp bertenaga AI oleh Yoga Samudra Heriyanto: basis pengetahuan, RAG, kotak masuk bersama, durable outbox, dan alih tangan manusia untuk tim layanan pelanggan.",
    "MLBB Heroes Matchup Decision Support System: a SwiftUI app that helps players choose Mobile Legends counter heroes through transparent matchup calculations.": "MLBB Heroes Matchup Decision Support System: aplikasi SwiftUI yang membantu pemain memilih hero counter Mobile Legends melalui perhitungan matchup yang transparan."
  };
  const UI = {
    en: {switchLabel: 'Switch language to Indonesian', switchTitle: 'Bahasa Indonesia', changed: 'Language changed to English.'},
    id: {switchLabel: 'Ganti bahasa ke Inggris', switchTitle: 'English', changed: 'Bahasa diubah ke Bahasa Indonesia.'}
  };
  // Keep source data in English. Components read these values later; their
  // rendered text/alt output is translated by the observer instead.
  const ATTRS = ['aria-label', 'title', 'alt', 'placeholder'];
  const textOriginals = new WeakMap();
  const attrOriginals = new WeakMap();
  const titleEn = document.title;
  const metaDescription = document.querySelector('meta[name="description"]');
  const metaEn = metaDescription?.content || '';
  let locale = resolveLocale();
  let observer;
  let switching = false;

  function resolveLocale() {
    const query = new URLSearchParams(location.search).get('lang');
    if (SUPPORTED.has(query)) return query;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.has(stored)) return stored;
    } catch (_) { /* The language switch still works without storage. */ }
    return 'en';
  }

  function normalize(value) {
    return String(value).trim().replace(/\s+/g, ' ');
  }

  function translated(value) {
    return ID[normalize(value)];
  }

  function shouldSkip(node) {
    const parent = node.parentElement;
    return !parent || parent.closest('script,style,noscript,svg,code,pre,.language-toggle,.language-live');
  }

  function applyText(node, remember = true) {
    if (shouldSkip(node) || !normalize(node.nodeValue)) return;
    if (remember && !textOriginals.has(node)) textOriginals.set(node, node.nodeValue);
    const source = textOriginals.get(node) ?? node.nodeValue;
    if (locale === 'en') { node.nodeValue = source; return; }
    const replacement = translated(source);
    if (!replacement) { node.nodeValue = source; return; }
    const leading = source.match(/^\s*/)?.[0] || '';
    const trailing = source.match(/\s*$/)?.[0] || '';
    node.nodeValue = leading + replacement + trailing;
  }

  function elementAttributes(element, remember = true) {
    if (!(element instanceof Element) || element.closest('.language-toggle,.language-live')) return;
    let originals = attrOriginals.get(element);
    if (!originals) { originals = {}; attrOriginals.set(element, originals); }
    ATTRS.forEach(name => {
      if (!element.hasAttribute(name)) return;
      if (remember && originals[name] === undefined) originals[name] = element.getAttribute(name);
      const source = originals[name] ?? element.getAttribute(name);
      if (locale === 'en') { element.setAttribute(name, source); return; }
      element.setAttribute(name, translated(source) || source);
    });
  }

  function scan(root = document, remember = true) {
    if (root.nodeType === Node.TEXT_NODE) { applyText(root, remember); return; }
    if (!(root instanceof Element || root instanceof Document || root instanceof DocumentFragment)) return;
    if (root instanceof Element) elementAttributes(root, remember);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) applyText(node, remember);
      else elementAttributes(node, remember);
    }
  }

  function updateWhatsApp() {
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
      const message = locale === 'id'
        ? 'Halo Samudra, saya ingin berdiskusi tentang sebuah proyek.'
        : 'Hi Samudra, I would like to discuss a project.';
      const url = new URL(link.href);
      url.searchParams.set('text', message);
      link.href = url.toString();
    });
  }

  function updateControl() {
    const button = document.querySelector('.language-toggle');
    if (!button) return;
    const flag = button.querySelector('.language-flag');
    const code = button.querySelector('.language-code');
    const target = locale === 'en' ? 'id' : 'en';
    flag.src = `assets/flags/${locale === 'en' ? 'us' : 'id'}.svg`;
    code.textContent = locale.toUpperCase();
    button.dataset.targetLocale = target;
    button.setAttribute('aria-label', UI[locale].switchLabel);
    button.title = UI[locale].switchTitle;
    button.removeAttribute('aria-pressed');
  }

  function applyLocale(next, persist = true) {
    locale = SUPPORTED.has(next) ? next : 'en';
    observer?.disconnect();
    document.documentElement.lang = locale;
    document.title = locale === 'id' ? (TITLES[titleEn] || titleEn) : titleEn;
    if (metaDescription) metaDescription.content = locale === 'id' ? (META[metaEn] || metaEn) : metaEn;
    scan(document, true);
    updateWhatsApp();
    updateControl();
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, locale); } catch (_) { /* Persistence is optional. */ }
    }
    observe();
    document.dispatchEvent(new CustomEvent('languagechange', {detail: {locale}}));
  }

  function observe() {
    if (!observer) {
      observer = new MutationObserver(mutations => {
        observer.disconnect();
        mutations.forEach(mutation => {
          if (mutation.type === 'characterData') {
            textOriginals.set(mutation.target, mutation.target.nodeValue);
            applyText(mutation.target, false);
          } else if (mutation.type === 'attributes') {
            let originals = attrOriginals.get(mutation.target);
            if (!originals) { originals = {}; attrOriginals.set(mutation.target, originals); }
            originals[mutation.attributeName] = mutation.target.getAttribute(mutation.attributeName);
            elementAttributes(mutation.target, false);
          } else {
            mutation.addedNodes.forEach(node => scan(node, true));
          }
        });
        observer.observe(document.body, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:ATTRS});
      });
    }
    observer.observe(document.body, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:ATTRS});
  }

  function createControl() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'language-toggle';
    button.innerHTML = '<img class="language-flag" alt="" width="18" height="11"><span class="language-code" aria-hidden="true">EN</span>';
    const live = document.createElement('span');
    live.className = 'language-live';
    live.setAttribute('aria-live', 'polite');
    document.body.append(live);
    const actions = document.querySelector('.header-actions');
    const caseNav = document.querySelector('.case-nav');
    if (actions) {
      const sound = actions.querySelector('.sound-toggle');
      const theme = actions.querySelector('.theme-toggle');
      if (sound) sound.after(button);
      else if (theme) theme.before(button);
      else actions.prepend(button);
    } else if (caseNav) {
      const back = caseNav.querySelector('.case-back');
      if (back) back.before(button);
      else caseNav.append(button);
    }
    button.addEventListener('click', () => {
      if (switching) return;
      switching = true;
      button.disabled = true;
      const next = locale === 'en' ? 'id' : 'en';
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('i');
        ripple.className = 'language-ripple';
        ripple.setAttribute('aria-hidden', 'true');
        ripple.style.left = `${rect.left + rect.width / 2}px`;
        ripple.style.top = `${rect.top + rect.height / 2}px`;
        document.body.append(ripple);
        setTimeout(() => ripple.remove(), 650);
      }
      document.body.classList.add('language-shifting');
      button.classList.add('is-switching');
      setTimeout(() => {
        applyLocale(next);
        live.textContent = UI[next].changed;
      }, reduced ? 0 : 150);
      setTimeout(() => {
        document.body.classList.remove('language-shifting');
        button.classList.remove('is-switching');
        button.disabled = false;
        switching = false;
      }, reduced ? 20 : 520);
    });
  }

  window.SamudraI18n = {
    getLocale: () => locale,
    setLocale: next => applyLocale(next),
    t: value => locale === 'id' ? (ID[normalize(value)] || value) : value
  };

  createControl();
  applyLocale(locale, false);
})();
