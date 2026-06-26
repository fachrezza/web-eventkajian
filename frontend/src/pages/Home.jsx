import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Home() {

  const [event, setEvent] = useState(null);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    quantity: 1,
  });

  // ================= FETCH EVENT =================
  const fetchEvent = async () => {
    try {

      const res = await axios.get(
        "http://localhost:8000/api/events"
      );

      const eventData =
        res.data.data?.[0] ??
        res.data?.[0] ??
        res.data;

      setEvent(eventData);

      // AUTO SELECT FIRST TICKET
      if (eventData.ticket_types?.length > 0) {
        setSelectedTicket(eventData.ticket_types[0]);
      }

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= TOTAL =================
  const total =
    selectedTicket
      ? selectedTicket.price * form.quantity
      : 0;

  // ================= CHECKOUT =================
  const checkout = async () => {

    try {

      if (!selectedTicket) {
        alert("Pilih tiket terlebih dahulu");
        return;
      }

      const res = await axios.post(
        "http://localhost:8000/api/checkout",
        {
          event_id: event.id,
          ticket_type_id: selectedTicket.id,
          ...form,
        }
      );

      const snapToken = res.data.snap_token;

      window.snap.pay(snapToken, {

        onSuccess: function () {
          alert("Pembayaran berhasil");
        },

        onPending: function () {
          alert("Menunggu pembayaran");
        },

        onError: function () {
          alert("Pembayaran gagal");
        },

      });

    } catch (err) {
      console.log(err);
      alert("Checkout gagal");
    }
  };

  if (!event) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div className="bg-[#fff7fb] min-h-screen">

      <Navbar />

      {/* ================= HERO ================= */}

      <section className="relative py-28 px-6 overflow-hidden">

        {/* BLUR BG */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-40"></div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-40"></div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-block bg-pink-100 text-pink-600 px-5 py-2 rounded-full font-medium mb-5">
              Hilyatul Muslimah 2026
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-tight text-white-800">

              Hilyatul
              <span className="text-pink-500">
                {" "}Muslimah
              </span>

            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">

              Menjadi bagian dari majelis ilmu terbaik
              bersama ribuan jamaah dalam suasana
              nyaman, eksklusif, dan penuh keberkahan.

            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">

              <a
                href="#checkout"
                className="bg-pink-500 hover:bg-pink-600 transition text-white px-8 py-4 rounded-2xl font-semibold shadow-xl"
              >
                Pesan Tiket
              </a>

              <a href="#lokasi" className="bg-white hover:bg-pink-100 transition border border-pink-200 px-8 py-4 rounded-2xl text-pink-500 font-semibold">
                Lihat Lokasi
              </a>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <div className="">

              <img
                src="https://images.vexels.com/media/users/3/137734/isolated/preview/d02e892fea06ea885d25bad9d0d207c4-mosque-islam-flat.png"
                alt="Kajian"
                className="rounded-[30px] h-[520px] w-full object-cover"
              />

            </div>

          </div>

        </div>

      </section>

      {/* ================= EVENT INFO ================= */}

      <section className="max-w-6xl mx-auto px-6 py-8">

        <div className="bg-white rounded-[40px] p-10 border border-pink-100 shadow-xl">

          <div className="grid md:grid-cols-3 gap-8 text-center">

            <div>
              <p className="text-5xl mb-3">📅</p>

              <h3 className="font-bold text-xl">
                01 November 2026
              </h3>

              <p className="text-gray-500">
                Ahad • 08:00 WIB
              </p>
            </div>

            <div>
              <p className="text-5xl mb-3">📍</p>

              <h3 className="font-bold text-xl">
                Jalan Budi Utomo
              </h3>

              <p className="text-gray-500">
                Gorontalo, Indonesia
              </p>
            </div>

            <div>
              <p className="text-5xl mb-3">🎤</p>

              <h3 className="font-bold text-xl">
                Special Speakers
              </h3>

              <p className="text-gray-500">
                Ustadz Nasional
              </p>
            </div>

          </div>

        </div>

      </section>
      {/* ================= LOCATION MAP ================= */}
      <section id="lokasi" className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-800">
            Lokasi
          </h2>

          <p className="text-gray-500 mt-3">
            Temukan lokasi acara dengan mudah
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-[40px] p-6 border border-pink-100 shadow-2xl">

          {/* MAP CONTAINER */}
          <div className="rounded-[30px] overflow-hidden border border-pink-100">

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d249.35222986074677!2d123.06148021228387!3d0.5482311815359282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1781519594155!5m2!1sid!2sid"
              className="w-full h-[300px] md:h-[450px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

          </div>

          {/* BUTTON OPEN MAP */}
          <div className="mt-6 text-center">

            <a
              href="https://maps.app.goo.gl/uBBE5ehb9W4aCE469"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-pink-500 to-rose-400 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition"
            >
              Buka di Google Maps
            </a>

          </div>

        </div>

      </section>

      {/* ================= CHECKOUT ================= */}

      <section
        id="checkout"
        className="max-w-6xl mx-auto px-6 py-20"
      >

        <div className="text-center mb-16">

          <h2 className="text-5xl font-black text-gray-800">
            Pilih Tiket
          </h2>

          <p className="mt-4 text-gray-500 text-lg">
            Pilih pengalaman terbaikmu dalam kajian ini
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT */}
          <div>

            <div className="space-y-6">

              {event.ticket_types?.map((ticket) => (

                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`cursor-pointer rounded-[35px] p-8 border transition duration-300
                    
                    ${
                      selectedTicket?.id === ticket.id
                        ? "bg-gradient-to-br from-pink-500 to-rose-400 text-white border-pink-500 shadow-2xl scale-[1.02]"
                        : "bg-white border-pink-100 hover:shadow-xl"
                    }
                    
                  `}
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="text-3xl font-black">
                        {ticket.name}
                      </h3>

                      <p className={`mt-3
                        
                        ${
                          selectedTicket?.id === ticket.id
                            ? "text-pink-100"
                            : "text-gray-500"
                        }
                        
                      `}>
                        {ticket.description}
                      </p>

                    </div>

                    <div className="text-right">

                      <h2 className="text-4xl font-black">
                        Rp{" "}
                        {Number(ticket.price)
                          .toLocaleString("id-ID")}
                      </h2>

                      <p className={`mt-2 text-sm
                        
                        ${
                          selectedTicket?.id === ticket.id
                            ? "text-pink-100"
                            : "text-gray-500"
                        }
                        
                      `}>
                        Sisa {ticket.quota - ticket.sold} seat
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-pink-100 sticky top-10">

              <h2 className="text-3xl font-black text-gray-800">
                Checkout
              </h2>

              <div className="mt-8 space-y-4">

                <input
                  name="customer_name"
                  placeholder="Nama Lengkap"
                  className="w-full border border-pink-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                  onChange={handleChange}
                />

                <input
                  name="customer_email"
                  placeholder="Email"
                  className="w-full border border-pink-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                  onChange={handleChange}
                />

                <input
                  name="customer_phone"
                  placeholder="Nomor WhatsApp"
                  className="w-full border border-pink-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={form.quantity}
                  className="w-full border border-pink-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                  onChange={handleChange}
                />

              </div>

              {/* SUMMARY */}
              <div className="mt-8 border-t border-pink-100 pt-6 space-y-3">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Tiket
                  </span>

                  <span className="font-semibold">
                    {selectedTicket?.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Quantity
                  </span>

                  <span className="font-semibold">
                    {form.quantity}
                  </span>
                </div>

                <div className="flex justify-between text-2xl font-black text-pink-500">

                  <span>Total</span>

                  <span>
                    Rp{" "}
                    {Number(total)
                      .toLocaleString("id-ID")}
                  </span>

                </div>

              </div>

              <button
                onClick={checkout}
                className="w-full mt-8 bg-gradient-to-r from-pink-500 to-rose-400 hover:opacity-90 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition"
              >
                Bayar Sekarang
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-gradient-to-r from-pink-50 to-rose-50 border-t border-pink-100 text-center py-14 mt-20">

        <div className="max-w-6xl mx-auto px-6">

          <h3 className="text-3xl font-black text-gray-800">
            HilyatulMuslimah 2026
          </h3>

          <p className="text-gray-500 mt-4">
            Menebar ilmu • Menguatkan iman • Mempererat ukhuwah
          </p>

          {/* divider soft */}
          <div className="my-8 flex justify-center">
            <div className="w-24 h-[2px] bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"></div>
          </div>

          {/* bottom text */}
          <p className="text-gray-400 text-sm">
            © 2026 HilyatulMuslimah. All Rights Reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}