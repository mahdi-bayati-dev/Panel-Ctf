"use client";
import Delete from "@/components/icons/delete";
import Edit from "@/components/icons/edite";
import React, { useState } from "react";

function FAQAdmin() {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "چطور در سایت ثبت‌نام کنم؟",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, praesentium. Sed voluptatem porro laboriosam culpa, soluta nam labore asperiores ex alias hic natus rem, dolor incidunt distinctio ipsam minima eum! Commodi, non quaerat! Vero eligendi fugiat et magnam maiores nulla neque dicta possimus repellat nisi nihil, consequatur, laboriosam doloremque quas error inventore consectetur deserunt voluptate quos! Fugit dolores possimus nihil maxime quidem asperiores cumque, eveniet labore iste facilis quisquam ad id praesentium, quam sequi magni reprehenderit saepe placeat laborum quis tempore? Iste assumenda voluptates soluta architecto sapiente aspernatur, obcaecati suscipit quasi culpa natus quidem mollitia numquam inventore, sint, laborum veniam!",
    },
    {
      id: 2,
      question: "چگونه رمز عبورم را بازیابی کنم؟",
      answer: "به بخش فراموشی رمز عبور بروید و ایمیل خود را وارد کنید.",
    },
    {
      id: 3,
      question: "آیا امکان تغییر نام کاربری وجود دارد؟",
      answer: "بله، از بخش تنظیمات حساب کاربری.",
    },
  ]);

  // استیت‌ها
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ذخیره تغییرات
  const handleSave = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    if (editId) {
      setFaqs(
        faqs.map((faq) =>
          faq.id === editId
            ? { ...faq, question: newQuestion, answer: newAnswer }
            : faq
        )
      );
    } else {
      setFaqs([
        ...faqs,
        { id: Date.now(), question: newQuestion, answer: newAnswer },
      ]);
    }

    // ریست
    setEditId(null);
    setNewQuestion("");
    setNewAnswer("");
    setShowForm(false);
  };

  // حذف
  const handleDelete = (id) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  // ویرایش
  const handleEdit = (faq) => {
    setEditId(faq.id);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
    setShowForm(true);
  };

  // شروع افزودن سوال
  const handleAddNew = () => {
    setEditId(null);
    setNewQuestion("");
    setNewAnswer("");
    setShowForm(true);
  };

  return (
    <div className=" bg-dark text-white flex flex-col items-center py-4  ">
      <div className="w-full max-w-3xl  rounded-2xl ">
        <h1 className="text-2xl font-bold mb-6 text-center">
          مدیریت سوالات متداول
        </h1>
        {/* فرم افزودن/ویرایش */}
        {showForm && (
          <div className="space-y-3 pb-2">
            <input
              type="text"
              placeholder="سوال..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full rounded-xl px-4 py-2 bg-dark border border-colorThemeLite-green focus:outline-none focus:ring-2 focus:ring-colorThemeLite-green"
            />
            <textarea
              placeholder="پاسخ..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full rounded-xl px-4 py-2 bg-dark border border-colorThemeLite-green focus:outline-none focus:ring-2 focus:ring-colorThemeLite-green"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-green-500 text-dark px-4 py-2 font-bold hover:bg-green-600 transition"
              >
                {editId ? "ذخیره ویرایش" : "ثبت سوال"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl bg-gray-500 text-white px-4 py-2 font-bold hover:bg-gray-600 transition"
              >
                لغو
              </button>
            </div>
          </div>
        )}

        {/* لیست سوالات */}
        <div className="space-y-4 mb-6">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-colorThemeLite-green rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
            >
              <div className="text-right">
                <p className="font-bold">{faq.question}</p>
                <p className="text-sm text-colorThemeLite-accent mt-1">
                  {faq.answer}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(faq)}
                  className="px-3 py-1 rounded-lg  text-dark font-bold hover:bg-colorThemeDark-secondary transition"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="px-3 py-1 rounded-lg hover:bg-colorThemeDark-secondary transition"
                >
                  <Delete />
                </button>
              </div>
            </div>
          ))}

          {faqs.length === 0 && (
            <p className="text-center text-colorThemeLite-accent">
              هیچ سوالی موجود نیست.
            </p>
          )}
        </div>

        {/* دکمه افزودن سوال */}
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="w-full rounded-xl bg-green-500 text-dark px-4 py-2 font-bold hover:bg-green-600 transition"
          >
            افزودن سوال جدید
          </button>
        )}
      </div>
    </div>
  );
}

export default FAQAdmin;
