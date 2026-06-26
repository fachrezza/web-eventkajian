import { useEffect, useState } from "react";
import {
  Menu,
  X,
  CalendarDays,
  MapPin,
} from "lucide-react";

/* =========================
   NAVBAR
========================= */

function NavbarCS() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 lg:px-8 pt-5">
      <div
        className="
        max-w-7xl
        mx-auto
        h-20
        rounded-full
        border
        border-white/40
        bg-white/70
        backdrop-blur-2xl
        shadow-lg
        px-6
        flex
        items-center
        justify-between
      "
      >
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div
            className="
            w-11
            h-11
            rounded-full
            bg-gradient-to-br
            from-pink-400
            to-rose-400
            flex
            items-center
            justify-center
            text-white
            font-black
            text-lg
            shadow-lg
          "
          >
            H
          </div>

          <div>
            <h1 className="text-lg font-black text-gray-900 leading-none">
              Hilyatul
            </h1>

            <p className="text-xs text-pink-500 font-medium">
              Muslimah Event
            </p>
          </div>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center gap-3">
          {[
            "Home",
            "About",
            "Speakers",
            "Tickets",
            "Location",
          ].map((item, i) => (
            <button
              key={i}
              className="
              h-11
              px-6
              rounded-full
              border
              border-pink-100
              bg-white/60
              hover:bg-pink-500
              hover:text-white
              transition-all
              duration-300
              text-sm
              font-semibold
              text-gray-700
            "
            >
              {item}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            className="
            h-11
            px-6
            rounded-full
            bg-gradient-to-r
            from-pink-500
            to-rose-500
            hover:scale-[1.03]
            transition
            text-white
            text-sm
            font-semibold
            shadow-lg
          "
          >
            Join Event
          </button>
        </div>

        {/* MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="
          lg:hidden
          w-11
          h-11
          rounded-full
          bg-pink-500
          text-white
          flex
          items-center
          justify-center
        "
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div
          className="
          lg:hidden
          mt-4
          bg-white/90
          backdrop-blur-2xl
          border
          border-pink-100
          rounded-3xl
          shadow-2xl
          p-5
          max-w-7xl
          mx-auto
        "
        >
          <div className="flex flex-col gap-3">
            {[
              "Home",
              "About",
              "Speakers",
              "Tickets",
              "Location",
            ].map((item, i) => (
              <button
                key={i}
                className="
                h-12
                rounded-2xl
                bg-pink-50
                hover:bg-pink-500
                hover:text-white
                transition
                font-semibold
                text-gray-700
              "
              >
                {item}
              </button>
            ))}

            <button
              className="
              mt-2
              h-12
              rounded-2xl
              bg-pink-500
              text-white
              font-semibold
            "
            >
              Join Event
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* =========================
   PAGE
========================= */

export default function ComingSoon() {
  const targetDate = new Date("2026-11-01T00:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) return;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        ),
        seconds: Math.floor(
          (distance % (1000 * 60)) / 1000
        ),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="
      min-h-screen
      overflow-hidden
      bg-gradient-to-br
      from-[#FFF8FB]
      via-[#FFF1F5]
      to-[#FFE4EC]
      relative
    "
    >
      {/* BACKGROUND */}
      <div className="absolute top-[-150px] right-[-120px] w-[450px] h-[450px] rounded-full bg-pink-300/20 blur-[120px]" />

      <div className="absolute bottom-[-200px] left-[-100px] w-[450px] h-[450px] rounded-full bg-rose-200/30 blur-[120px]" />

      {/* PATTERN */}
      <div
        className="
        absolute
        inset-0
        opacity-[0.03]
        bg-[radial-gradient(#ec4899_1px,transparent_1px)]
        [background-size:24px_24px]
      "
      />

      <NavbarCS />

      {/* HERO */}
      <section
        className="
        relative
        z-10
        max-w-7xl
        mx-auto
        px-5
        lg:px-8
        pt-36
        pb-16
      "
      >
        <div
          className="
          grid
          lg:grid-cols-2
          gap-10
          items-center
        "
        >
          {/* LEFT */}
          <div>
            {/* BADGE */}
            <div
              className="
              inline-flex
              items-center
              gap-2
              px-5
              py-2
              rounded-full
              bg-pink-100
              border
              border-pink-200
              text-pink-600
              text-sm
              font-semibold
            "
            >
              ✨ Event Muslimah 2026
            </div>

            {/* TITLE */}
            <h1
              className="
              mt-6
              text-4xl
              md:text-6xl
              font-black
              leading-[1]
              text-gray-900
            "
            >
              Hilyatul
              <span className="block text-pink-500">
                Muslimah
              </span>
            </h1>

            {/* DESC */}
            <p
              className="
              mt-6
              text-base
              md:text-lg
              leading-relaxed
              text-gray-600
              max-w-xl
            "
            >
              Sebuah perjalanan ilmu dan keberkahan bersama
              muslimah hebat untuk memperkuat iman, akhlak,
              dan semangat hijrah di era modern.
            </p>

            {/* BUTTON */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                className="
                h-12
                px-7
                rounded-full
                bg-pink-500
                hover:bg-pink-600
                transition
                text-white
                font-semibold
                shadow-lg
              "
              >
                Coming Soon
              </button>

              <button
                className="
                h-12
                px-7
                rounded-full
                border
                border-pink-200
                bg-white/70
                hover:bg-white
                text-pink-500
                font-semibold
              "
              >
                Explore Event
              </button>
            </div>

            {/* COUNTDOWN */}
            <div className="mt-10 flex flex-wrap gap-4">
              {[
                {
                  label: "DAYS",
                  value: timeLeft.days,
                },
                {
                  label: "HOURS",
                  value: timeLeft.hours,
                },
                {
                  label: "MINUTES",
                  value: timeLeft.minutes,
                },
                {
                  label: "SECONDS",
                  value: timeLeft.seconds,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="
                  w-24
                  h-24
                  rounded-3xl
                  bg-white/70
                  backdrop-blur-xl
                  border
                  border-pink-100
                  shadow-lg
                  flex
                  flex-col
                  items-center
                  justify-center
                "
                >
                  <h2 className="text-3xl font-black text-gray-900">
                    {item.value}
                  </h2>

                  <p className="text-xs tracking-[2px] text-pink-500 font-semibold mt-1">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* INFO */}
            <div className="mt-10 flex flex-wrap gap-8">
              <div className="flex items-start gap-3">
                <div
                  className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-pink-100
                  flex
                  items-center
                  justify-center
                  text-pink-500
                "
                >
                  <CalendarDays size={20} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[3px] text-pink-400 font-semibold">
                    Event Date
                  </p>

                  <h4 className="mt-1 font-bold text-gray-800">
                    01 November 2026
                  </h4>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-pink-100
                  flex
                  items-center
                  justify-center
                  text-pink-500
                "
                >
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[3px] text-pink-400 font-semibold">
                    Location
                  </p>

                  <h4 className="mt-1 font-bold text-gray-800">
                    Gorontalo Convention Hall
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">
            {/* GLOW */}
            <div
              className="
              absolute
              w-[350px]
              h-[350px]
              bg-pink-300/30
              rounded-full
              blur-[100px]
            "
            />

            {/* IMAGE CARD */}
            <div
              className="
              relative
              w-full
              max-w-[420px]
              rounded-[35px]
              overflow-hidden
              border
              border-white/40
              shadow-[0_25px_70px_rgba(0,0,0,0.12)]
            "
            >
              <img
                src="https://images.vexels.com/media/users/3/137734/isolated/preview/d02e892fea06ea885d25bad9d0d207c4-mosque-islam-flat.png"
                alt="Event"
                className="
                w-full
                h-[540px]
                object-cover
              "
              />

              {/* OVERLAY */}
              <div
                className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#2d0d1f]/70
                via-transparent
                to-transparent
              "
              />

              {/* TEXT */}
              <div className="absolute bottom-8 left-8 right-8 z-10">
                <p className="text-pink-200 uppercase tracking-[4px] text-xs">
                  Hilyatul Muslimah
                </p>

                <h2
                  className="
                  mt-3
                  text-4xl
                  md:text-5xl
                  font-black
                  leading-none
                  text-white
                "
                >
                  YOU ARE
                  <span className="block">
                    NOT ALONE
                  </span>
                </h2>
              </div>
            </div>

            {/* FLOAT CARD */}
            <div
              className="
              absolute
              -bottom-6
              right-0
              w-[240px]
              rounded-[28px]
              bg-white/80
              backdrop-blur-2xl
              border
              border-pink-100
              shadow-2xl
              p-5
            "
            >
              <p className="text-pink-500 text-sm font-semibold">
                Main Speaker
              </p>

              <h3 className="mt-2 text-2xl font-black text-gray-900">
                Ustadzah
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Special Kajian Session
              </p>

              <button
                className="
                mt-5
                w-full
                h-11
                rounded-2xl
                bg-pink-500
                hover:bg-pink-600
                transition
                text-white
                font-semibold
              "
              >
                Join Waiting List
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}