"use client";
import React from "react";
import SearchIcon from "@/components/icons/SearchIcon";
import SearchIcon_2 from "@/components/icons/searchIcon-2";
import Link from "next/link";

// داده‌های فیک
const fakeUsers = [
  {
    id: 1,
    name: "Mahdi Bayati",
    score: 22440,
    avatar: "/img/p-user/person.png",
  },
  {
    id: 2,
    name: "Ali Rezaei",
    score: 19870,
    avatar: "/img/p-user/person.png",
  },
  {
    id: 3,
    name: "Sara Mohammadi",
    score: 17650,
    avatar: "/img/p-user/person.png",
  },
  {
    id: 4,
    name: "Fatemeh Karimi",
    score: 15430,
    avatar: "/img/p-user/person.png",
  },
];

function LeaderBoard() {
  return (
    <div className="min-h-screen flex flex-col items-center text-center mt-2 ">
      <div className="space-y-6 w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mb-20">
        <div className="flex flex-col gap-6 rounded-2xl bg-dark md:p-6 text-white transition">
          {/* فیلد جست‌وجو */}
          <div className="border-b border-colorThemeLite-green pb-4">
            <label
              htmlFor="search"
              className="mb-2 text-colorThemeLite-accent font-semibold flex items-center gap-2"
            >
              <SearchIcon_2 />
              <span>جست‌وجو</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2 px-2">
              <input
                id="search"
                type="text"
                placeholder="دنبال کی می‌گردی؟"
                className="flex-1 bg-colorThemeDark-primary rounded-xl px-3 py-2 border border-colorThemeLite-green focus:outline-none focus:ring-2 focus:ring-colorThemeLite-green"
              />
              <button className="rounded-xl bg-colorThemeDark-muted text-dark px-4 py-2 font-bold hover:bg-green-500 transition flex items-center justify-center">
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* لیست کاربران */}
          <div className="flax flex-col ">
            {fakeUsers.map((user) => (
              <Link key={user.id} href={`/user/${user.id}`} className="w-full">
                <div className="border border-colorThemeLite-green rounded-2xl p-4 flex gap-4 my-2 items-center hover:scale-[102%] hover:bg-colorThemeLite-green/20 transition-transform cursor-pointer">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl object-cover border border-colorThemeLite-green/60"
                  />
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-sm sm:text-base lg:text-lg">
                      {user.name}
                    </span>
                    <span className="text-xs sm:text-sm text-colorThemeLite-accent">
                      امتیاز:
                      <span className="font-mono ml-1">
                        {user.score.toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
